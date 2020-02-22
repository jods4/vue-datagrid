import { computed, Ref, watch } from "vue";

export function useSelection(data: Ref<object[]>, selected?: Set<object>) {
  if (!selected) return null;

  // empty selection when data is reloaded
  watch(data, () => selected.clear());

  return {
    toggle(el: HTMLElement) {
      let item: object | undefined = el.closest('.dg-row')?.['_trueValue'];
      if (!item) return;
      if (!selected.delete(item))
        selected.add(item);      
    },

    allSelected: computed({ 
      get() {
        return selected.size === 0 ? false :
          selected.size === data.value.length ? true : 1; // 1 is purposefully truthy (null or undefined is not)
      }, 
      set(value: boolean | 1) {
        if (value)
          data.value.forEach(selected.add, selected);
        else
          selected.clear();
      }
    })
  };
}