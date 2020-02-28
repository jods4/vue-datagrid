import { nextTick } from "vue";
import { Column } from './column';

export function autoSize(table: HTMLTableElement, columns: Column[]) {
  nextTick(() =>  {
    let i = 0;
    for (let header of table.tHead!.rows[0].cells)
      columns[i++].width = header.clientWidth + "px";

    // Once autosizing is done, put the grid in fixed-layout mode
    table.style.width = "100%";
  });
}