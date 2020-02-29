import { computed, Ref, shallowReactive } from "vue";
import { ColumnDefinition } from "../columns/column";
import { SortColumn } from './sort-column';

export { default as SortIndicator } from "./sort-indicator";

export function useSorting(data: Ref<object[]>) {
  const sort = shallowReactive([] as SortColumn[]);

  return {
    sort, 

    data: computed(() => {
      if (sort.length === 0) return data.value;

      const comparer = (a: object, b: object) =>  {
        for (let s of sort) {
          let d = s.column.data!;
          let da = a[d], db = b[d];
          if (da > db) return s.asc;
          if (da < db) return -s.asc;
        }
        return 0;
      };
      return [...data.value].sort(comparer);
    }),

    sortOn(column: ColumnDefinition, multi: boolean) {
      if (column.sortable === false) return;

      let i = sort.findIndex(x => x.column === column);        
      let asc = i >= 0 ? sort[i].asc : 0;
      if (!multi)
        sort.length = 0;
      else if (asc !== 0)
        sort.splice(i, 1);
      asc = asc === 0 ? 1 :
            asc > 0 ? -1 : 0;
      if (asc !== 0)
        sort.push({ column, asc });
    },
  }
}