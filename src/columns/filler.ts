import { shallowReactive as sreactive, onMounted, watchEffect } from 'vue';
import { Column } from './column';

export function addFiller(columns: Column[], size: { width: number }) {
  const filler = sreactive({ sortable: false, header: () => '', render: () => '', width: '' });
  
  columns.push(filler);

  onMounted(() => watchEffect(() => {
    const total = columns.reduce((sum, col) => {
      const width = parseInt(col.width!, 10);        
      return isNaN(width) || col === filler ? sum : sum + width;
    }, 0);
    filler.width = (size.width - total) + 'px';
  }));
}