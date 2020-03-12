<template>
  <tbody>
    <tr :style='{ height: topGap + "px" }' />
    <tr v-if='(index & 1) === 0' />
  </tbody>
  <slot :items='items' />
  <tbody>
    <tr :style='{ height: bottomGap + "px" }' />
  </tbody>
</template>

<script lang="ts">
import { getState } from './state';
import { view } from '../utils';

export default {
  setup() {
    return view(getState());
  }
}
</script>