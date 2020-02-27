import { nextTick } from "vue";

export function autoSize(table: HTMLTableElement, columns: { width?: string, defaultSize?: string }[]) {
  nextTick(() =>  {
    let i = 0;
    for (let header of table.tHead!.rows[0].cells)
      columns[i++].width = header.clientWidth + "px";

    // Once autosizing is done, put the grid in fixed-layout mode
    table.style.width = "100%";
  });
}