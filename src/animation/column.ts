import { ObjectDirective } from 'vue';

export const AnimColumn: ObjectDirective<HTMLTableCellElement> = {
  updated(el, { value, oldValue }) {
    if (value && value !== oldValue && oldValue !== null)
      value(el);
  }
}