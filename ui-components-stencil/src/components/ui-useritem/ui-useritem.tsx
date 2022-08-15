import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-useritem',
  styleUrl: 'ui-useritem.scss',
  shadow: true
})
export class UiUserItem {
  @Prop() user_name: string;
  @Prop() key: string;
  @Prop() highlight?: boolean;
  
  render() {
    return (
      <li class="py-3 sm:py-4 border-b dark:border-gray-700" key={this.key}>
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
            <div class="overflow-hidden relative w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600">
              <svg class="absolute -left-1 w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    { this.user_name }
                </p>
            </div>
            { this.highlight && (
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <span class="inline-flex items-center p-1 mr-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-200 dark:text-blue-800">
                  <svg aria-hidden="true" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span class="sr-only">current</span>
                </span>
              </div>
            )}
        </div>
    </li>
    );
  }
}
