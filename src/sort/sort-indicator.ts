import { h } from "vue";

export default function render({ sort, column }: any) {
  let i = sort.findIndex((x: any) => x.column === column);
  if (i < 0) return null;
  let asc = sort[i].asc;
  let icon = h('svg', { class: 'dg-icon' }, 
                h('use', { href: asc > 0 ? '/src/icons.svg#arrow-up' : '/src/icons.svg#arrow-down' }));
  return sort.length > 1 ?
    h('span', [ h('span', { class: 'dg-sort-count' }, i + 1), icon]) :
    icon;
}

render.props = {
  sort: Array,
  column: Object,
};