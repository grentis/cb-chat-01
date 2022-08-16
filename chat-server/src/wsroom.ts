import WSMessage from './wsmessage';

export default class WSRoom {
  private readonly name: string;
  public messages: WSMessage[];

  constructor (name: string) {
    this.name = name;
    this.messages = [];
  }

  public get_name (): string {
    return this.name.toLowerCase();
  }
}
