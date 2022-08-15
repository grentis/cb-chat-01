import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-messageitem',
  styleUrl: 'ui-messageitem.scss',
  shadow: true
})
export class UiMessageItem {
  @Prop() user_name: string;
  @Prop() date: Date;
  @Prop() message: string;
  @Prop() key: string;
  @Prop() highlight?: boolean
  
  render() {
    return (
      <li class={`mt-6 ml-8`} key={this.key}>
        <span class={`flex absolute -left-3 justify-center items-center w-6 h-6 {this.hi} rounded-full ring-8 ring-white dark:ring-gray-900 ${this.highlight ? 'bg-blue-900 dark:bg-blue-200' : 'bg-blue-200 dark:bg-blue-900'}`}>
            <svg aria-hidden="true" class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
        </span>
        <h5 class="flex items-center mb-1 text-xsm font-semibold text-gray-900 dark:text-white">
          {this.user_name}
        </h5>
        <time class="block mb-2 text-xxsm font-normal leading-none text-gray-400 dark:text-gray-500">
          {this.date}
        </time>
        <p class="break-all mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
          {this.message}
        </p>
    </li>
    );
  }
}
