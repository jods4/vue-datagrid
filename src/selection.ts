import { computed, Ref, watch, h } from 'vue';
import { Column } from './columns';

export function addSelection(columns: Column[], data: Ref<object[]>, selected: Set<object> | undefined) {
  if (!selected) return null;

  // empty selection when data is reloaded
  watch(data, () => selected.clear());

  const allSelected = computed({ 
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
  });

  columns.unshift({ 
    key: 'select',
    resizable: false,
    sortable: false, 
    searchable: false,
    defaultWidth: 0,
    width: 0,
    header: () => h('input', { 
      type: 'checkbox', 
      checked: allSelected.value, 
      indeterminate: allSelected.value === null,
      onclick(e: Event) { 
        if ((e.target as HTMLInputElement).checked)
          data.value.forEach(selected.add, selected);
        else
          selected.clear();
      },
    }),
    render: (childProps: any) => h('input', { 
      type: 'checkbox', 
      checked: selected.has(childProps.data) 
    }),
  });

  return (item: object) => {
    if (!selected!.delete(item))
      selected!.add(item);
  };
}