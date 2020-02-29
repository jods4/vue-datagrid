<template>
<h2 style='margin: 0'>Pokedex</h2>
<div style='margin: 12px 0'>
  <button @click='fetch'>Load data (1.5s)</button>
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
        { label: 'Height', data: 'height', css: 'dg-right', sortable: false, width: '100px' },
        { label: 'Weight', data: 'weight', css: 'dg-right', sortable: false, width: '100px' },
        { label: 'Spawn chance', data: 'spawn_chance', right: true, width: '100px' },
      ],
      data: ref<any>([]),

      fetch() {
        state.data.value = new Promise(resolve => setTimeout(resolve, 1500))
          .then(() => import(/* webpackChunkName: "pokedex" */ './pokedex'))
          .then(({ default: data }) => markNonReactive([...data]));
      },

      selected: shallowReactive(new Set()),
    };

    state.fetch();

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