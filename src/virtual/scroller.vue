<template>
  <div ref='el' @scroll.passive='onScroll' v-bind='$attrs'>
    <slot />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { getState } from "./state";

export default {
  setup() {
    const state = getState();
    const el = ref<any>(); // FIXME: TS is giving me headaches inside onMounted

    function onScroll() {
      state.scrollTop = el.value.scrollTop;
    }

    onMounted(() => { state.scroller = el.value; });

    return {
      el,
      onScroll,
    };
  }
};
</script>