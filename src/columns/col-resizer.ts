import { h } from "vue";
import { Column } from './column';

export default function render(props: { column?: Column }) {
  const column = props.column!;
  return h('b', column.resizable === false ?
    { class: 'dg-separator' } :
    {
      class: 'dg-resizer',
      
      onClick(event: Event) { event.stopPropagation(); },
        
      onPointerdown({ target, x, pointerId }: PointerEvent & { target: HTMLElement }) {
        const baseWidth = parseInt(column.width!, 10);
        const moveHandler = (event: PointerEvent) => column.width = Math.max(baseWidth + event.x - x, 40) + "px";
        target.setPointerCapture(pointerId)
        target.addEventListener('pointermove', moveHandler);
        target.addEventListener('pointerup', () => target.removeEventListener('pointermove', moveHandler), { once: true });
      },
  });
}

render.props = {
  column: Object,
};