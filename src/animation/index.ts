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

  // Note that it's possible to skip pointerup events in some edge cases (at least happens in Chromium 82).
  // Examples include stressing the thing like a madman (not sure what triggers the bug then)
  // or judicious use of Alt-Tab when dragging.
  return function headerPointerDown({ currentTarget: th, x: x0, button }: PointerEvent & { currentTarget: HTMLElement }, column: Column) {
    if (button !== 0) return;

    let i = columns.indexOf(column);
    // We missed a pointerup but nevermind, the old listeners are still in place
    if (column.dragged) return;

    function thresholds() {
      return [
        i > 0 ? -columns[i - 1].width / 2 : -Infinity,
        i < columns.length - 1 ? columns[i + 1].width / 2 : Infinity,
      ];
    }

    let [left, right] = thresholds();
    let translateX: CSSUnitValue;
    let transform: CSSTransformValue;

    const listeners = {
      handleEvent(e: PointerEvent) {
        switch (e.type) {
          case 'click': 
            e.stopImmediatePropagation();
            break;
          case 'pointermove':
            this.move(e);
            break;
          case 'pointerup':
            if (e.button === 0)
              this.up();
            break;
        }
      },

      move({ x, buttons }: PointerEvent) {
        let delta = x - x0;      
        
        // start dragging after a significant amount of movement
        if (!column.dragged) {
          if (Math.abs(delta) < 4) return;
          column.dragged = true;
          window.addEventListener('click', this, { once: true, capture: true })
          transform = new CSSTransformValue([ new CSSTranslate(translateX = CSS.px(0), CSS.px(0)) ]);        
        } 
        else if ((buttons & 1) === 0) {
          // button was released without us noticing. This is bad :(
          this.up();
          return;
        }

        // swap columns if required
        if (delta < left) {
          const other = columns[--i];
          x0 -= other.width;
          delta = x - x0;
          columns.splice(i, 2, column, other);
          [left, right] = thresholds();
        }
        else if (delta > right) {
          const other = columns[++i];
          x0 += other.width;
          delta = x - x0;
          columns.splice(i - 1, 2, other, column);
          [left, right] = thresholds();
        }

        translateX.value = delta;
        th.attributeStyleMap.set('transform', transform);
      },

      up() {
        ['pointermove', 'pointerup']
          .forEach(name => window.removeEventListener(name, this, true));
        if (!column.dragged) return;
        column.dragged = false;
        th.attributeStyleMap.delete('transform');
        setTimeout(() => window.removeEventListener('click', this, true), 0);
      }
    };

    ['pointermove', 'pointerup']
      .forEach(name => window.addEventListener(name, listeners, true));
  }
}