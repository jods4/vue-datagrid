import { nextTick, Ref } from "vue";
import { Column } from './column';

export function autoSize(table: HTMLTableElement, columns: Column[], autoSized: Ref<boolean>) {
  if (autoSized.value) return;
  nextTick(() =>  {
    let i = 0;
    for (let header of table.tHead!.rows[0].cells)
      columns[i++].width = header.clientWidth;

    // Once autosizing is done, put the grid in fixed-layout mode
    table.style.width = "100%";
    autoSized.value = true;
  });
}