import { h } from 'vue';
import { SortColumn } from './sort-column';
import { Column } from '../columns';

export default function render(props: { sort?: SortColumn[], column?: Column }) {
  const { sort, column } = props as Required<typeof props>;
  // We always render a sorting icon and number, even when the column is unsorted,
  // so that we can account for the icon width when auto-sizing the column.
  let i = sort.findIndex((x: any) => x.column === column) + 1;
  let asc = i === 0 ? 1 : sort[i - 1].asc;
  let icon = h('svg', { class: 'dg-sort-icon' }, 
                h('use', { href: asc > 0 ? '/src/icons.svg#arrow-up' : '/src/icons.svg#arrow-down' }));
  return h('span', 
    { style: { visibility: i === 0 ? 'hidden' : null } }, 
    [ 
      icon, 
      h('span', { class: 'dg-sort-count', style: { visibility: sort.length <= 1 ? 'hidden' : null } }, i)
    ]);
}

render.props = {
  sort: Array,
  column: Object,
};