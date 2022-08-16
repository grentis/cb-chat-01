import WSRoom from './wsroom';
import WSUser from './wsuser';
import WSMessage, { WSReceivedMessage } from './wsmessage';

import WebSocket, { WebSocketServer } from 'ws';

// Estensione typescript per WebSocket.WebSocket
interface ExtWebSocket extends WebSocket.WebSocket { uid: string, authorized: boolean, room: string, user: WSUser }

export default class WSServer {
  private readonly wss: WebSocketServer;
  private readonly rooms: WSRoom[];

  constructor (port: number) {
    this.wss = this.initialize_ws(port);
    this.rooms = [];
    console.debug('Server is running - waiting for connection');
  }

  /*
  Genera una stringa random come identificativo di connessione di un client
  */
  private generate_unique_identifier (): string {
    function s4 (): string {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
  }

  private initialize_ws (port: number): WebSocketServer {
    const wss_obj: WebSocketServer = new WebSocketServer({ port });
    wss_obj.on('connection', (con: ExtWebSocket) => {
      con.uid = this.generate_unique_identifier();
      con.authorized = false;
      // callback per i messaggi ricevuti dai client
      con.on('message', (data: WebSocket.RawData) => {
        let message: WSReceivedMessage = { command: 'empty' };
        try {
          message = JSON.parse(String(data));
        } catch (e) { console.error(e); return; }
        if (message.command) {
          // autenticazione di un nuovo clint
          if (message.command === 'HELO') {
            if (!message.username || !message.room) return;
            console.debug(`Client ${message.username} has sent: ${String(data)}`);
            let current_room = this.rooms.filter((r) => { return r.get_name() === message.room; });
            // in caso di stanza non esistente se ne crea una nuova
            if (!current_room.length) {
              const temp_room = new WSRoom(message.room);
              this.rooms.push(temp_room);
              current_room = [temp_room];
            }

            con.room = current_room[0].get_name();
            con.user = new WSUser(con.uid, message.username);
            con.authorized = true;
            console.debug(`Client ${con.user.name} authorized`);

            // invio elenco dei partecipanti al client appena connesso e gli ultimi messaggi
            this.send_partecipants_to_client(con);
            this.send_lastmessages_to_client(con);

            // invio comunicazione ai client della connessione di un nuovo utente
            this.send_message_to_all(con.room, {
              type: 'CONNECTION',
              message: `${message.username} connected`,
              author_name: message.username,
              author_uid: con.uid,
              created_at: new Date()
            }, false);
            this.send_message_to_all(con.room, {
              type: 'MSG',
              message: `${message.username} connected`,
              author_name: message.username,
              author_uid: con.uid,
              created_at: new Date()
            }, true);
          } else {
            // si scartano tutti i messaggi ricevuti da client non autenticati
            if (!con.authorized) return;
            console.debug(`Client ${con.user.name} has sent: ${String(data)}`);
            if (message.command === 'MSG' && message.message) {
              // in caso di nuovo messaggio lo si inoltra a tutti i clienti connessi
              this.send_message_to_all(con.room, {
                type: 'MSG',
                message: message.message,
                author_name: con.user.name,
                author_uid: con.uid,
                created_at: new Date()
              }, true);
            }
          }
        }
      });

      // callback per la disconnessione di un client
      con.on('close', () => {
        if (!con.user) return;
        console.debug(`Clients ${con.user.name} disconnected`);
        // si notifica a tutti i client ancora connessi l'avvenuta disconnessione
        this.send_message_to_all(con.room, {
          type: 'DISCONNECTION',
          message: `${con.user.name} disconnected`,
          author_name: con.user.name,
          author_uid: con.uid,
          created_at: new Date()
        }, false);
        this.send_message_to_all(con.room, {
          type: 'MSG',
          message: `${con.user.name} disconnected`,
          author_name: con.user.name,
          author_uid: con.uid,
          created_at: new Date()
        }, true);
      });

      // callback in caso di errore
      con.onerror = () => {
        console.error('Some error occurred');
      };
    });
    return wss_obj;
  }

  /*
  invio di un messaggio a tutti i client connessi ad una stanza
  - room: nome della stanza
  - message: testo del messaggio
  - store: se salvare il messaggio stesso nella history della chat
  */
  private send_message_to_all (room: string, message: WSMessage, store: boolean): void {
    const current_room = this.rooms.filter((r) => { return r.get_name() === room; });
    if (!current_room.length) return;
    if (store) {
      current_room[0].messages.push(message);
    }
    this.wss.clients.forEach((client: WebSocket.WebSocket) => {
      if ((client as ExtWebSocket).authorized && client.readyState === WebSocket.OPEN && (client as ExtWebSocket).room === room) {
        console.debug(`Sending message to ${(client as ExtWebSocket).user.name}`);
        client.send(JSON.stringify(message));
      }
    });
  }

  /*
  invio degli ultimi 20 messaggi ad un singolo client
  */
  private send_lastmessages_to_client (client: ExtWebSocket): void {
    const current_room = this.rooms.filter((r) => { return r.get_name() === client.room; });
    if (!current_room.length) return;
    const last20 = current_room[0].messages.slice(-20);
    if (client.authorized && client.readyState === WebSocket.OPEN) {
      for (const message of last20) {
        console.debug(`Sending message to ${client.user.name}`);
        client.send(JSON.stringify(message));
      }
    }
  }

  /*
  invio degli utenti connessi alla stessa stanza del client
  */
  private send_partecipants_to_client (client: ExtWebSocket): void {
    const current_clients: WSUser[] = [];
    this.wss.clients.forEach((c: WebSocket.WebSocket) => {
      if ((c as ExtWebSocket).authorized && c.readyState === WebSocket.OPEN && (c as ExtWebSocket).room === client.room) {
        current_clients.push((c as ExtWebSocket).user);
      }
    });
    if (client.authorized && client.readyState === WebSocket.OPEN) {
      console.debug(`Sending message to ${client.user.name}`);
      client.send(JSON.stringify({
        type: 'USERS',
        users: current_clients,
        uid: client.uid
      }));
    }
  }
}
