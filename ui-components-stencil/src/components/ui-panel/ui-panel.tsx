import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'ui-panel',
  styleUrl: 'ui-panel.scss',
  shadow: false
})
export class UiPanel {
  @Prop() panel_title: string;
  @Prop() size?: string;
  
  render() {
    return (
        <Host style={this.size ? {flex: this.size} : null}>
            <div class="min-w-[300px] h-full p-8 m-1 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                        {this.panel_title}
                    </h3>
                </div>
                <div class="flow-root">
                    <slot />
                </div>
            </div>
        </Host>
    );
  }
}
