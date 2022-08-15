import WSRoom from "./wsroom";
import WSUser from "./wsuser";
import WSMessage from "./wsmessage";

import WebSocket, { WebSocketServer } from 'ws';

interface ExtWebSocket extends WebSocket.WebSocket { uid: string, authorized: boolean, room: string, user: WSUser };


export default class WSServer {
    private wss: WebSocketServer;
    private rooms: WSRoom[];
    
    constructor(port: number) {
        this.wss = this.initialize_ws(port);
        this.rooms = [];
        console.error("Server is running - waiting for connection");
    }
    
    private generate_unique_identifier(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    }
    
    private initialize_ws(port: number): WebSocketServer {
        const _wss:WebSocketServer = new WebSocketServer({ port });
        _wss.on("connection", (con: ExtWebSocket) => {
            con.uid = this.generate_unique_identifier();
            con.authorized = false;
            con.on("message", (data: any) => {
                let message: any = {};
                try {
                    message = JSON.parse(data);
                }catch(e) { console.error(e); return; }
                if (message.command) {
                    if (message.command === 'HELO') {
                        if (!message.username || !message.room) return;
                        console.debug(`Client ${message.username} has sent: ${data}`)
                        let current_room = this.rooms.filter((r) => { return r.get_name() === message.room });
                        if (!current_room.length) {
                            const _temp = new WSRoom(message.room);
                            this.rooms.push(_temp);
                            current_room = [_temp];
                        }
                        
                        con.room = current_room[0].get_name();
                        con.user = new WSUser(con.uid, message.username);
                        con.authorized = true;
                        console.debug(`Client ${con.user.name} authorized`);
                        
                        this.send_partecipants_to_client(con);
                        this.send_lastmessages_to_client(con);
                        
                        this.send_message_to_all(con.room, {
                            type: "CONNECTION",
                            message: `${message.username} connected`,
                            author_name: message.username,
                            author_uid: con.uid,
                            created_at: new Date()
                        }, false);
                        this.send_message_to_all(con.room, {
                            type: "MSG",
                            message: `${message.username} connected`,
                            author_name: message.username,
                            author_uid: con.uid,
                            created_at: new Date()
                        }, true);
                    } else {
                        if (!con.authorized) return;
                        console.debug(`Client ${con.user.name} has sent: ${data}`)
                        if (message.command === 'MSG' && message.message) {
                            this.send_message_to_all(con.room, {
                                type: "MSG",
                                message: message.message,
                                author_name: con.user.name,
                                author_uid: con.uid,
                                created_at: new Date()
                            }, true);
                        }
                    }
                }
            });
            
            con.on("close", () => {
                if (!con.user) return;
                console.debug(`Clients ${con.user.name} disconnected`)
                this.send_message_to_all(con.room, {
                    type: "DISCONNECTION",
                    message: `${con.user.name} disconnected`,
                    author_name: con.user.name,
                    author_uid: con.uid,
                    created_at: new Date()
                }, false);
                this.send_message_to_all(con.room, {
                    type: "MSG",
                    message: `${con.user.name} disconnected`,
                    author_name: con.user.name,
                    author_uid: con.uid,
                    created_at: new Date()
                }, true);
            });
            
            con.onerror = function () {
                console.error("Some Error occurred")
            }
            
        });
        return _wss;
    }
    
    private send_message_to_all(room: string, message: WSMessage, store: boolean):void {
        const current_room = this.rooms.filter((r) => { return r.get_name() === room });
        if (!current_room.length) return;
        if (store)
            current_room[0].messages.push(message);
        this.wss.clients.forEach((client: WebSocket.WebSocket) => {
            if ((client as ExtWebSocket).authorized && client.readyState === WebSocket.OPEN && (client as ExtWebSocket).room === room) {
                console.debug(`Sending message to ${(client as ExtWebSocket).user.name}`)
                client.send(JSON.stringify(message));
            }
        });
    }
    
    private send_lastmessages_to_client(client: ExtWebSocket) {
        const current_room = this.rooms.filter((r) => { return r.get_name() === client.room });
        if (!current_room.length) return;
        const last20 = current_room[0].messages.slice(-20);
        if (client.authorized && client.readyState === WebSocket.OPEN) {
            for (let message of last20) {
                console.debug(`Sending message to ${client.user.name}`)
                client.send(JSON.stringify(message));
            }
        }
    }

    private send_partecipants_to_client(client: ExtWebSocket) {
        const current_clients: WSUser[] = [];
        this.wss.clients.forEach((c: any) => {
            if (c.authorized && c.readyState === WebSocket.OPEN && c.room === client.room) {
                current_clients.push(c.user);
            }
        });
        if (client.authorized && client.readyState === WebSocket.OPEN) {
            console.debug(`Sending message to ${client.user.name}`)
            client.send(JSON.stringify({
                type: "USERS",
                users: current_clients
            }));
        }
    }
    
}