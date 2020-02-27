import { nextTick } from "vue";

export function autoSize(table: HTMLTableElement, columns: { width?: string, defaultSize?: string }[]) {
  nextTick(() =>  {
    let i = 0;
    let total = 0;
    for (let header of table.tHead!.rows[0].cells) {
      if (i < columns.length - 1) {
        total += header.clientWidth;
        columns[i++].width = header.clientWidth + "px";
      }
      else
      {
        columns[i++].width = ((table.parentNode! as HTMLElement).clientWidth - total) + "px";
      }
    }

    // Once autosizing is done, put the grid in fixed-layout mode
    table.style.width = "100%";
  });
}