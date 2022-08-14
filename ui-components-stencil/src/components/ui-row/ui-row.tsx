import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ui-row',
  styleUrl: 'ui-row.scss',
  shadow: true
})
export class UiRow {
  
  render() {
    return (
        <Host style={{flex: "1"}}>
          <div class="flex flex-wrap relative">
              <slot />
          </div>
        </Host>
    );
  }
}
