import React from 'react';
import { UiUserlist, UiUseritem } from 'ui-components-react';

export interface WSUser {
    name: string;
    id: string;
}

export interface WSMessage {
    message: string;
    author_name: string;
    author_uid: string;
    created_at: Date;
    type: string;
}

interface UserListPros {
  users: WSUser[]
}

class UserList extends React.Component<UserListPros> {

  render(){
    return (
        <UiUserlist>
        { 
            this.props.users.map((user) => {
                return <UiUseritem key={user.id} user_name={user.name}></UiUseritem>;
            })
        }
        </UiUserlist>
    );
  }
}
    
export default UserList;
    