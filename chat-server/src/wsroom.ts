import WSUser from "./wsuser";
import WSMessage from "./wsmessage";

export default class WSRoom {
    private name: string;
    public messages: WSMessage[];
    
    constructor(name: string) {
        this.name = name;
        this.messages = [];
    }

    public get_name(){
        return this.name.toLowerCase();
    }
}