<template>
<div style='position: relative; overflow: hidden'>
  <table class='dg' v-virtual='virtual'>
    <thead>
      <tr>
        <th v-for='(c, i) of columns' 
            :key='i'
            class='dg-header' :class='{ "dg-right": c.right, "dg-sort": c.sortable !== false }'
            @click='sortOn(c, $event.ctrlKey)'>
          {{ c.label }}
          <sort-indicator :sort='sort' :column='c' />
        </th>
        <th class='dg-header dg-fill' />
      </tr>
      <tr v-if='loading' class='dg-loader'></tr>
    </thead>
    <tbody>
      <tr :style='{ height: virtual.topGap + "px" }'></tr>
      <tr v-for='d of virtual' class='dg-row' :key='d.id'>
        <td v-for='c of columns' v-text='d[c.data]' class='dg-cell' :class='c.right && "dg-right"' />
        <td class='dg-cell dg-fill' />
      </tr>
      <tr :style='{ height: virtual.bottomGap + "px" }'></tr>
    </tbody>
  </table>
</div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { Column } from "./column";
import SortIndicator from './sort-indicator';
import { useSorting } from "./sorting";
import { useVirtual, VirtualTable } from "./virtual";

export default {
  components: {
    'sort-indicator': SortIndicator,
  },

  directives: {
    'virtual': VirtualTable,
  },

  props: {
    columns: Array,
    data: [Array, Promise],
  },

  setup(props: { columns?: Column[], data?: object[] | Promise<object[]> }) {
    const loading = ref(true);
    const data = ref([] as object[]);
    const sorting = useSorting(data);
    const virtual = useVirtual(sorting.data);
    
    watch(async () => {
      loading.value = true;
      data.value = await props.data!;
      loading.value = false;
      virtual.scrollToTop();
    });

    return {
      columns: props.columns,
      loading,
      ...sorting,
      virtual,
    };
  }
};
</script>

<style src='./datagrid.css'></style>