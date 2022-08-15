import React from 'react';
import { WSMessage } from './UserList';

import { UiMessagelist, UiMessageitem } from 'ui-components-react';

interface MessageListPros {
  messages: WSMessage[],
  uid?: string
}

class MessageList extends React.Component<MessageListPros> {

  render(){
    return (
        <UiMessagelist>
        { 
            this.props.messages.map((msg) => {
                return <UiMessageitem highlight={msg.author_uid === this.props.uid} key={msg.author_uid + '_' + msg.created_at} date={msg.created_at} user_name={msg.author_name} message={msg.message}></UiMessageitem>;
            })
        }
        </UiMessagelist>
    );
  }
}
    
export default MessageList;
    