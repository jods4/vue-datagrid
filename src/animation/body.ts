import { h, defineComponent, Fragment, VNode, onUpdated, watch } from 'vue';
import { fade, move } from './animations';

export const AnimBody = defineComponent({  
  props: {
    data: Array,
  },

  setup(props, { attrs, slots }) {
    let children: VNode<HTMLTableRowElement, unknown>[];
    let oldYMap = null as Map<VNode['key'], number> | null;

    // Only animate when data changes (e.g. sort), not on virtual scroll
    watch(() => props.data, 
      () => oldYMap = new Map(children.map(n => [n.key, n.el!.offsetTop])), 
      { flush: 'pre' });

    onUpdated(() => {
      if (!oldYMap) return;

      const newYMap = new Map(children.map(n => [n.key, n.el!.offsetTop]));
      const fades = [] as HTMLElement[];
      const moves = [] as { el: HTMLElement, y0: number, dist: number }[];      

      // Compute changes
      for (const child of children) {
        const { key, el } = child;

        const y0 = oldYMap.get(key);
        if (y0 === undefined) {
          fades.push(el!);
          continue;
        } 

        const y1 = newYMap.get(key)!;
        const dist = y0 - y1
        if (Math.abs(dist) > 2)
          moves.push({ el: el!, y0, dist });
      }
      oldYMap = null;
      
      // Perform animations
      let delay = 0;
      moves.sort((a, b) => a.y0 - b.y0); // top-down animation looks nicer
      for (const m of moves) {
        move(m.el, m.dist, delay);
        delay += 10;
      }      
      if (moves.length) 
        delay += 350;
      for (let row of fades) {
        fade(row, delay);
        delay += 10;
      }      
    });

    return () => {
      children = slots.default!();
      if (children.length === 1 && children[0].type === Fragment)
        children = children[0].children as VNode[];
      return h('tbody', attrs, children);
    };
  }
});