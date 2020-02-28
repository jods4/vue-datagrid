import { computed, Ref, watch, h } from "vue";
import { Column } from '../columns';

export function useSelection(data: Ref<object[]>, selected?: Set<object>) {
  if (!selected) return null;

  // empty selection when data is reloaded
  watch(data, () => selected.clear());

  return {
    toggle(item: object) {
      if (!selected.delete(item))
        selected.add(item);
    },

    allSelected: computed({ 
      get() {
        return selected.size === 0 ? false :
          selected.size === data.value.length ? true : null;
      }, 
      set(value: boolean | null) {
        if (value)
          data.value.forEach(selected.add, selected);
        else
          selected.clear();
      }
    })
  };
}

export function addSelection(columns: Column[], selected: Set<object> | undefined) {
  if (!selected) return;

  columns.unshift({ 
    resizable: false,
    sortable: false, 
    defaultWidth: '',
    render: (childProps: any) => h('input', { type: 'checkbox', checked: selected.has(childProps.data) }) 
  });
}