<template>
<h2 style='margin: 0'>Pokedex</h2>
<div style='margin: 12px 0'>
  <button @click='fetch(1500)'>Load data (1.5s)</button>
  Selected count: {{ selected.size }}
  <button @click='selected.clear()'>Clear selection</button>
</div>
<ui-datagrid :data='data' :columns='columns' 
             :selected='selected'
             style='flex: 1' />
</template>

<script lang="ts">
import { markNonReactive, ref, shallowReactive } from "vue";

export default {
  setup() {
    const state = {
      columns: [ 
        { label: 'Id', data: 'id' },
        { label: 'Name', data: 'name' },
        { label: 'Height', data: 'height', css: 'dg-right', sortable: false, width: 100 },
        { label: 'Weight', data: 'weight', css: 'dg-right', sortable: false, width: 100 },
        { label: 'Spawn chance', data: 'spawn_chance', right: true, width: 100 },
      ],
      data: ref<any>([]),

      fetch(delay: number) {
        state.data.value = new Promise(resolve => setTimeout(resolve, delay)) 
          .then(() => import(/* webpackChunkName: "pokedex" */ './pokedex'))
          .then(({ default: data }) => markNonReactive([...data]));
      },

      selected: shallowReactive(new Set()),
    };

    state.fetch(0);

    return state;
  }
}
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  margin: 0;
  padding: 12px;
}
</style>