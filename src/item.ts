import { ObjectDirective } from 'vue';

export const ItemDirective: ObjectDirective<HTMLElement> = {
  mounted(el, binding) {
    el['_item'] = binding.value; 
  }
};

export function getItem(el: Element): object | undefined {
  return el.closest('.dg-row')?.['_item'];
}