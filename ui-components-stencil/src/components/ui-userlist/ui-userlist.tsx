import { Component, h } from '@stencil/core';

@Component({
  tag: 'ui-userlist',
  styleUrl: 'ui-userlist.scss',
  shadow: true
})
export class UiUserList {
  
  render() {
    return (
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <slot />
        </ul>
    );
  }
}
