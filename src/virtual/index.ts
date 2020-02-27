import { Ref, provide, shallowReactive, unref, watchEffect } from "vue";
import { injectKey, VirtualState } from './state';

export { default as VirtualScroller } from './scroller.vue';
export { default as VirtualBody } from './body.vue';

type Val<T> = T | Ref<T>;

export function useVirtual(data: Val<object[]>) {
  const state: VirtualState = shallowReactive({
    scroller: <any>null!, // initialized on mount // FIXME: TS error if declared as Element?
    height: 0,
    scrollTop: 0,
    rowHeight: 24,
    buffer: 4,
    topGap: 0,
    bottomGap: 0,
    index: 0,
    count: 0,

    items: function*() {
      const all = unref(data);
      const to = state.index + state.count;
      for (let i = state.index; i < to; i++)
        yield all[i];
    },
  });

  watchEffect(() => {
    const length = unref(data).length;
    const { buffer, height, rowHeight, scrollTop } = state;
    const index = state.index = Math.max((scrollTop / rowHeight | 0) - buffer, 0);
    const count = state.count = Math.min((height / rowHeight | 0) + 1 + buffer + buffer, length - index);
    state.topGap = index * rowHeight;
    state.bottomGap = (length - count - index) * rowHeight;
  });

  provide(injectKey, state);

  return {
    scrollToTop() {
      state.scroller.scrollTop = 0;
    }
  }
}