import WSUser from "./wsuser";
import WSMessage from "./wsmessage";

export default class WSRoom {
    public name: string;
    public messages: WSMessage[];
    
    constructor(name: string) {
        this.name = name;
        this.messages = [];
    }
}