import { ObjectDirective, Ref, reactive, watch } from "vue";

interface VirtualState {
  height: number;
  scrollTop: number;
  rowHeight: number;
  buffer: number;
  topGap: number;
  bottomGap: number;
  index: number;
  count: number;

  scrollToTop: Function;
}

export function useVirtual(data: Ref<object[]>) {
  const state: VirtualState = reactive({
    height: 0,
    scrollTop: 0,
    rowHeight: 24,
    buffer: 4,
    topGap: 0,
    bottomGap: 0,
    index: 0,
    count: 0,

    scrollToTop: null!, // initialized on mount

    [Symbol.iterator]: function*() {
      const all = data.value;
      const to = state.index + state.count;
      for (let i = state.index; i < to; i++)
        yield all[i];
    },
  });

  watch(() => {
    const length = data.value.length;
    const { buffer, height, rowHeight, scrollTop } = state;
    const index = state.index = Math.max((scrollTop / rowHeight | 0) - buffer, 0);
    const count = state.count = Math.min((height / rowHeight | 0) + 1 + buffer + buffer, length - index);
    state.topGap = index * rowHeight;
    state.bottomGap = (length - count - index) * rowHeight;
  });

  return state;
}

type VirtualHTMLTable = HTMLTableElement & { _vscroll: VirtualState };

const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    let table = entry.target as VirtualHTMLTable;
    table._vscroll.height = entry.contentRect.height - table.querySelector('tHead')!.clientHeight;
  }
});

function onScroll(ev: Event) {
  let table = ev.target as VirtualHTMLTable;
  table._vscroll.scrollTop = table.scrollTop;
}

export const VirtualTable: ObjectDirective<VirtualHTMLTable> = {
  beforeMount(el, binding) {
    binding.value.scrollToTop = () => el.scrollTop = 0;
    el._vscroll = binding.value;
    resizeObserver.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
  },

  unmounted(el) {
    resizeObserver.unobserve(el);
    el.removeEventListener('scroll', onScroll);
  }
};