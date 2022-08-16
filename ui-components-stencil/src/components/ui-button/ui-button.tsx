import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-button',
  styleUrl: 'ui-button.scss',
  shadow: false,
})
export class UiButton {
  @Prop() name: string;
  @Prop() click_callback?: Function;

  private handle_click = (event: any) => {
    this.click_callback?.apply(null, [event]);
  }
  
  render() {
    return (
      <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" name={this.name} onClick={(event) => this.handle_click(event)}>
        <slot />
      </button>
    );
  }
}
