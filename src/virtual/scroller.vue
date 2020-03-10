<template>
  <div ref='$el' @scroll.passive='onScroll' v-bind='$attrs'>
    <slot />
  </div>
</template>

<script lang='ts'>
import { shallowRef as sref, onMounted } from 'vue';
import { getState } from './state';
import { view } from '../reactivity/view';

export default {
  setup() {
    const state = getState();
    const $el = sref<any>(); // FIXME: TS is giving me headaches inside onMounted

    function onScroll() {
      state.scrollTop = $el.value.scrollTop;
    }

    onMounted(() => { state.scroller = $el.value; });

    return view({
      $el,
      onScroll,
    });
  }
};
</script>