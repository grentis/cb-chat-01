import { Component, h } from '@stencil/core';

@Component({
  tag: 'ui-messagelist',
  styleUrl: 'ui-messagelist.scss',
  shadow: true
})
export class UiMessageList {
  
  render() {
    return (
      <ol class="relative border-l border-gray-200 dark:border-gray-700">
        <slot />
      </ol>
    );
  }
}
  