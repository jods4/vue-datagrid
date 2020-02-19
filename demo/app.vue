<template>
<h2>
  Pokedex
  <button @click='fetch'>Load data (for 3s)</button>
</h2>
<ui-datagrid :data='data' :columns='columns' style='flex: 1' />
</template>

<script lang="ts">
import { markNonReactive, ref } from "vue";
import data from './pokedex';

export default {
  setup() {
    const state = {
      columns: [ 
        { label: 'Id', data: 'id' },
        { label: 'Name', data: 'name' },
        { label: 'Height', data: 'height', right: true, sortable: false },
        { label: 'Weight', data: 'weight', right: true, sortable: false },
        { label: 'Spawn chance', data: 'spawn_chance', right: true },
      ],
      data: ref<any>([]),

      fetch() {
        state.data.value = new Promise(resolve => { 
          setTimeout(() => resolve(markNonReactive([...data])), 3000);
        });
      }
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