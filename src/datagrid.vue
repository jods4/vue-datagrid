<template>
  <table class='dg'>
    <thead>
      <th v-for='(c, i) of columns' 
          :key='i'
          class='dg-header' :class='{ "dg-right": c.right, "dg-sort": c.sortable !== false }'
          @click='sortOn(c, $event.ctrlKey)'>
        {{ c.label }}
        <sort-indicator :sort='sort' :column='c' />
      </th>
      <th class='dg-header dg-fill' />
    </thead>
    <tbody>
      <tr v-for='d of data' class='dg-row'>
        <td v-for='c of columns' v-text='d[c.data]' class='dg-cell' :class='c.right && "dg-right"' />
        <td class='dg-cell dg-fill' />
      </tr>      
    </tbody>
  </table>
</template>

<script lang="ts">
import { markNonReactive } from 'vue';
import { Column } from "./column";
import SortIndicator from './sort-indicator';
import { useSorting } from "./sorting";

export default {
  components: {
    'sort-indicator': SortIndicator,
  },

  props: {
    columns: Array,
    data: Array,
  },

  setup(props: { columns?: Column[], data?: object[] }) {
    for (let c of props.columns!) markNonReactive(c); // HACK: temporary until alpha.5 

    return {
      columns: props.columns,
      ...useSorting(props.data!),
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
}
.dg-header, .dg-cell {
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dg-header {
  padding: 4px 10px;
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
.dg-header:not(:last-child):after {
  content: ' ';
  position: absolute;
  right: 0;
  top: 5px;
  height: calc(100% - 10px);
  border-right: solid 1px #d9e0e4;
}
.dg-cell {
  padding: 2px 10px;
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
</style>