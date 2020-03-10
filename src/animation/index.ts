import { Ref, watchEffect } from 'vue';
import { pauseTracking, resetTracking } from "@vue/reactivity";
import { Column } from '../columns';
import { moveX } from './animations';

export { AnimBody } from './body';
export { AnimColumn } from './column';

export function useAnimations(columns: Column[], autoSized: Ref<boolean>) {

  // Compute columns offset from left
  watchEffect(() => {
    // wait until columns widths are fixed
    if (!autoSized.value) return; 
    // take dependency on column order
    for (let _ of columns) {};

    // don't take dependency on column widths:
    // we only want to animate if columns are reordered or shown/hidden, not when resizing.
    pauseTracking(); 
    let offset = 0;
    for (let c of columns) {
      let old = c.offsetX;
      c.offsetX = offset;
      offset += c.width;

      // create animation if column moved
      if (old !== undefined) {
        let delta = old - c.offsetX;        
        if (Math.abs(delta) > 3) {
          const anim = c.animationX;
          if (anim?.playState === 'running') {
            const progress = anim.effect!.getComputedTiming().progress!;
            delta += (1 - progress) * c.deltaX!;
          }

          const effect = moveX(delta);
          c.deltaX = delta;
          c.animate = el => c.animationX = el.animate(...effect);
        }
      }        
    }
    resetTracking();
  });

  return function headerPointerDown({ currentTarget: th, x, pointerId }: PointerEvent & { currentTarget: HTMLElement }, column: Column) {
    let i = columns.indexOf(column);

    function thresholds() {
      return [
        i > 0 ? -columns[i - 1].width / 2 : -Infinity,
        i < columns.length - 1 ? columns[i + 1].width / 2 : Infinity,
      ];
    }

    let [left, right] = thresholds();
    let translateX: CSSUnitValue;    
    let transform: CSSTransformValue;

    const preventClick = (e: Event) => e.stopImmediatePropagation();

    const moveHandler = (event: PointerEvent) => {
      let delta = event.x - x;      
      
      // start dragging after a significant amount of movement
      if (!column.dragged) {
        if (Math.abs(delta) < 4) return;
        column.dragged = true;
        window.addEventListener('click', preventClick, { once: true, capture: true })
        transform = new CSSTransformValue([ new CSSTranslate(translateX = CSS.px(0), CSS.px(0)) ]);        
      }

      // swap columns if required
      if (delta < left) {
        const other = columns[--i];
        x -= other.width;
        columns.splice(i, 2, column, other);
        delta = event.x - x;
        [left, right] = thresholds();
      }
      else if (delta > right) {
        const other = columns[++i];
        x += other.width;
        columns.splice(i - 1, 2, other, column);
        delta = event.x - x;
        [left, right] = thresholds();
      }

      translateX.value = delta;
      th.attributeStyleMap.set('transform', transform);
    };

    window.addEventListener('pointermove', moveHandler, true);

    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', moveHandler, true);
      if (!column.dragged) return;
      column.dragged = false;
      th.attributeStyleMap.delete('transform');
      setTimeout(() => window.removeEventListener('click', preventClick, true), 0);
    }, { 
      once: true, 
      capture: true 
    });
  }
}