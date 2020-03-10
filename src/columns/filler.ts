import { shallowReactive as sreactive, onMounted, watchEffect } from 'vue';
import { Column } from './column';

export function addFiller(columns: Column[], size: { width: number }) {
  const filler = sreactive({ key: 'fill', sortable: false, header: () => '', render: () => '', width: 0 });
  
  columns.push(filler);

  onMounted(() => watchEffect(() => {
    const total = columns.reduce((sum, col) => isNaN(col.width) || col === filler ? sum : sum + col.width, 0);
    filler.width = size.width - total;
  }));
}