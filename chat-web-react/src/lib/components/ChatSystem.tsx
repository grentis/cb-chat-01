import React from 'react';
import { UiLogin, UiInput, UiButton, UiRow } from 'ui-components-react';
import Chat from './Chat';

interface ChatSystemProps {
  server: string
}

interface ChatSystemState {
  username: string,
  room_name: string
  logged: boolean
}

class ChatSystem extends React.Component<ChatSystemProps, ChatSystemState> {

  constructor(props: ChatSystemProps) {
    super(props);
    this.state = {
      username: '',
      room_name: '',
      logged: false
    };
  }

  componentDidMount() { }

  componentWillUnmount(){ }

  handle_change_username(event: any) {
    this.setState({username: event.target.value});
  }

  handle_change_room_name(event: any) {
    this.setState({room_name: event.target.value});
  }

  handle_submit(event: any) {
    if (this.state.room_name && this.state.room_name.length && this.state.username && this.state.username.length) {
      this.setState({logged: true});
    }
  }

  handle_exit(event: any) {
    event.preventDefault();
    this.setState({logged: false});
  }
  
  render(){
    return (
      <UiRow>
        { this.state.logged && (
          <Chat exit_callback={(evt: any) => this.handle_exit(evt)} username={this.state.username} room_name={this.state.room_name} server={this.props.server}></Chat>
        ) }
        { !this.state.logged && (
          <UiLogin panel_title="Login" submit_event={(ev:any) => this.handle_submit(ev)}>
            <UiInput label="Username" name="username" value={this.state.username}
              field_id="username" placeholder="Username"
              change_event={(ev:any) => this.handle_change_username(ev)}></UiInput>
            <UiInput label="Room" name="room_name" value={this.state.room_name}
              field_id="room_name" placeholder="Room name"
              change_event={(ev:any) => this.handle_change_room_name(ev)}></UiInput>
            <UiButton name="login" click_callback={(ev:any) => this.handle_submit(ev)}>Login</UiButton>
          </UiLogin>
        ) }
      </UiRow>
    );
  }
}
    
export default ChatSystem;
    