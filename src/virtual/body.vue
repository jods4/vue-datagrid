<template>
  <tbody v-bind='$attrs'>
    <tr :style='{ height: topGap + "px" }' />
    <tr v-if='(index & 1) === 0' />
    <slot :items="items" />
    <tr :style='{ height: bottomGap + "px" }' />
  </tbody>
</template>

<script lang="ts">
import { getState } from "./state";

export default {
  setup() {
    return getState();
  }
}
</script>