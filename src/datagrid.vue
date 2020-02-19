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

<style>
.dg {
  border: 1px solid #bdc3c7;
  border-spacing: 0;
  display: block;
  table-layout: fixed;
  empty-cells: show;
  overflow: auto;
  height: 100%;
}
.dg-header, .dg-cell {
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dg-header {
  padding: 4px 12px;
  background: #f5f7f7;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 600;  
  border-bottom: solid 1px #bdc3c7;
  position: sticky;
  top: 0;
  text-align: left;
  user-select: none;
}
.dg-sort {
  cursor: pointer;
}
.dg-sort:active {
  background: #e0e0e0;
}
.dg-fill {
  width: 100%;
}
.dg-header:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 5px;
  height: calc(100% - 10px);
  border-right: solid 1px #d9e0e4;
}
.dg-cell {
  padding: 2px 12px;
  border-bottom: solid 1px #d9e0e4;  
}
.dg-right {
  text-align: right;
}
.dg-row:nth-child(even) {
  background: #fcfdfe;
}
.dg-row:hover {
  background: #e0f4ff;
}
.dg-sort-count {
  font-weight: normal;
  margin-right: 0.5ch;
}
.dg-icon {
  fill: currentColor;
  height: .83em;
  width: .83em;
}

@keyframes dg-loader {
  50% { background-size: 80%; }
  100% { background-position: 125% 0; }
}
.dg-loader {
  height: 0; 
}
.dg-loader::after
{
  content: '';
  position: absolute; 
  background: linear-gradient(to right, #64bff0, #64bff0) repeat-y; 
  height: 2px;
  width: 100%;
  left: 0;
  background-position: -25% 0; 
  background-size: 20%; 
  animation: dg-loader 1.5s ease-in-out infinite;
}
</style>