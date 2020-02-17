<template>
<h2>
  Pokedex
  <button @click='loading = !loading'>Loading</button>
</h2>
<ui-datagrid :data='data' :columns='columns' :loading='loading' />
</template>

<script lang="ts">
import { ref } from "vue";
import data from './pokedex';

export default {
  setup() {
    return {
      columns: [ 
        { label: 'Id', data: 'id' },
        { label: 'Name', data: 'name' },
        { label: 'Height', data: 'height', right: true, sortable: false },
        { label: 'Weight', data: 'weight', right: true, sortable: false },
        { label: 'Spawn chance', data: 'spawn_chance', right: true },
      ],
      data,

      loading: ref(false),
    };
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