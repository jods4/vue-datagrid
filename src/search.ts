import { computed, Ref } from 'vue';
import { ColumnDefinition } from './columns';

function escapeRegExp(re: string) {
  return re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useSearching(data: Ref<object[]>, props: { search?: string, columns: ColumnDefinition[] }) {
  return computed(() => {
    const { search, columns } = props;
    if (!search) return data.value;
    const re = RegExp(escapeRegExp(search), 'i');
    const searchables = columns.filter(c => c.searchable !== false).map(c => c.data!);
    return data.value.filter(obj => {
      for (const s of searchables) {
        const val = obj[s];
        if (val != null && re.test(val + ""))
          return true;
      }
      return false;
    });
  });  
}