import React from 'react';
import { UiRow, UiPanel, UiInput, UiLoading, UiButton } from 'ui-components-react';
import MessageList from './MessageList';
import UserList, { WSUser, WSMessage } from './UserList';

interface ChatProps {
  server: string,
  username: string,
  room_name: string,
  exit_callback: Function
}

interface ChatState {
  users: WSUser[],
  messages: WSMessage[],
  new_message: string,
  connected: boolean,
  uid: string
}

class Chat extends React.Component<ChatProps, ChatState> {

  private wsc: WebSocket | null = null;
  private retry_timeout: number = 0;

  constructor(props: ChatProps) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      new_message: '',
      connected: false,
      uid: ''
    };
    this.send_message = this.send_message.bind(this);
  }

  componentDidMount() { 
    this.wsc = this.create_websocket();
  }

  componentWillUnmount(){
    clearTimeout(this.retry_timeout);
    if (this.wsc) {
      this.wsc.close();
      this.wsc = null;
    }
  }

  private create_websocket(): WebSocket {
    clearTimeout(this.retry_timeout);
    this.setState({connected: false});
    const wsc = new WebSocket(this.props.server);
    // per ogni messaggio ricevuto
    wsc.onmessage = (data) => {
      console.debug(data.data);
      const message = JSON.parse(data.data);

      if (message.type === 'USERS') {
        // contiene l'elenco degli utenti connessi alla stanza
        this.setState({
          users: message.users,
          uid: message.uid
        });
      } else if(message.type === 'CONNECTION') {
        // nuovo utente collegato
        const current_users = this.state.users;
        if (!current_users.filter((u) => {return u.id === message.author_uid}).length) {
          // se non già presente lo aggiungo alla lista degli utenti
          current_users.push({id: message.author_uid, name: message.author_name});
          this.setState({
            users: current_users
          });
        }
      } else if(message.type === 'DISCONNECTION') {
        // utente scollegato
        let current_users = this.state.users;
        current_users = current_users.filter((u) => {return u.id !== message.author_uid});
        this.setState({
            users: current_users
        });
      } else if(message.type === 'MSG') {
        // messaggio ricevuto
        let current_messages = this.state.messages;
        current_messages.unshift(message);
        this.setState({
          messages: current_messages
        });
        console.debug(this.state.messages);
      }
    }

    // all'apertura della connessione
    wsc.onopen = () => {
      this.setState({connected: true, messages: [], users: []});
      wsc.send(JSON.stringify({command: "HELO", room: `${this.props.room_name.toLowerCase()}`, username: `${this.props.username}`}));  
    }

    // alla chiusura della connessione
    wsc.onclose = () => {
      this.setState({connected: false});
      // tento di ricollegarmi dopo 3sec
      this.retry_timeout = window.setTimeout(() => {
        if (this.wsc)
          this.wsc = this.create_websocket();
      }, 3000);
    }
    return wsc;
  }

  // invio di un nuovo messaggio
  send_message(event:any): void {
    this.wsc?.send(JSON.stringify({"command": "MSG", "message": this.state.new_message}))
    this.setState({new_message: ''});
    event.preventDefault();
  }

  // onchange del messaggio
  handle_change_message(event: any) {
    this.setState({new_message: event.target.value});
  }

  // onclick sul bottone di uscita dalla stanza
  handle_exit(event:any) {
    event.preventDefault();
    this.props.exit_callback.apply(null, [event]);
  }
  
  render(){
    return (
      <UiRow>
        {!this.state.connected && (
          <UiLoading></UiLoading>
        )}

        <UiPanel panel_title={'#' + this.props.room_name} size="1">
          <UserList uid={this.state.uid} users={this.state.users}></UserList>
          <UiButton name="exit" click_callback={(evt: any) => this.handle_exit(evt)}>Exit</UiButton>
        </UiPanel>

        <UiPanel panel_title="Messages" size="3">
          <form onSubmit={this.send_message}>
            <UiInput name="new_chat_message" value={this.state.new_message}
              field_id="new_chat_message" placeholder="Write here your message"
              change_event={(ev:any) => this.handle_change_message(ev)}></UiInput>
          </form>
          <MessageList uid={this.state.uid} messages={this.state.messages}></MessageList>
        </UiPanel>

      </UiRow>
    );
  }
}
    
export default Chat;
    