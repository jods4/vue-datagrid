<template>
<h2 style='margin: 0'>Pokedex</h2>
<div style='margin: 12px 0'>
  <button @click='fetch'>Load data (for 2s)</button>
  Selected count: {{ selected.size }}
  <button @click='selected.clear()'>Clear selection</button>
</div>
<ui-datagrid :data='data' :columns='columns' 
             :selected='selected'
             style='flex: 1' />
</template>

<script lang="ts">
import { markNonReactive, ref, shallowReactive } from "vue";
import data from './pokedex';

export default {
  setup() {
    const state = {
      columns: [ 
        { label: 'Id', data: 'id' },
        { label: 'Name', data: 'name' },
        { label: 'Height', data: 'height', right: true, sortable: false, width: '80px' },
        { label: 'Weight', data: 'weight', right: true, sortable: false, width: '80px' },
        { label: 'Spawn chance', data: 'spawn_chance', right: true, width: '80px' },
      ],
      data: ref<any>([]),

      fetch() {
        state.data.value = new Promise(resolve => { 
          setTimeout(() => resolve(markNonReactive([...data])), 2000);
        });
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