import { computed, Ref, provide, reactive, unref } from "vue";
import { injectKey, VirtualState } from './state';

export { default as VirtualScroller } from './scroller.vue';
export { default as VirtualBody } from './body.vue';

type Val<T> = T | Ref<T>;

export function useVirtual(data: Val<object[]>, size: { height: number }) {
  const state: VirtualState = reactive({
    scroller: <any>null!, // initialized on mount // FIXME: TS error if declared as Element?
    scrollTop: 0,
    rowHeight: 25,
    buffer: 4,
    topGap: 0,
    bottomGap: 0,
    index: 0,

    items: computed(() => {
      // Technically, size.height is slighty too high because it's the height of the full table, 
      // including thead, rather than just tbody.
      // That's not an issue though, it just means one or two extra rows will be rendered past the bottom.
      const length = unref(data).length;
      const { buffer, rowHeight, scrollTop } = state;
      const index = state.index = Math.max((scrollTop / rowHeight | 0) - buffer, 0);
      const count = Math.min((size.height / rowHeight | 0) + 1 + buffer + buffer, length - index);
      state.topGap = index * rowHeight;
      state.bottomGap = (length - count - index) * rowHeight;

      return function*() {
        const all = unref(data);
        const to = index + count;
        for (let i = index; i < to; i++)
          yield all[i];
      };
    }),
  });

  provide(injectKey, state);

  return {
    scrollToTop() {
      state.scroller.scrollTop = 0;
    }
  }
}