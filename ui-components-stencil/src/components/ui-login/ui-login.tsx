import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'ui-login',
  styleUrl: 'ui-login.scss',
  shadow: false
})
export class UiLogin {
  @Prop() panel_title: string;
  @Prop() submit_event?: Function;

  handleSubmit(event: any) {
    event.preventDefault();
    if (this.submit_event) {
      this.submit_event.apply(null, [event])
    }
  }

  render() {
    return (
      <Host style={ {flex: '1'} }>
        <div class="flex items-center justify-center h-screen">
          <div class="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form class="space-y-6" onSubmit={(evt) => this.handleSubmit(evt)}>
                <h5 class="text-xl font-medium text-gray-900 dark:text-white">{this.panel_title}</h5>
                <slot />
            </form>
          </div>
        </div>
      </Host>
    );
  }
}
