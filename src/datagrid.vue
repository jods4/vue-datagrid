<template>
<div class='dg-wrapper'>
  <div class='dg-scroller' v-virtual='virtual'>
    <table class='dg' :class='selected && "dg-selectable"'>
      <thead>
        <tr>
          <th v-if='selected' class='dg-header'>
            <input type='checkbox' v-model='allSelected' :indeterminate='allSelected == null' />
          </th>
          <th v-for='(c, i) of columns' 
              :key='i'
              class='dg-header' :class='{ "dg-right": c.right, "dg-sort": c.sortable !== false }'
              :style='{ width: c.width }'
              @click='sortOn(c, $event.ctrlKey)'>
            {{ c.label }}
            <sort-indicator :sort='sort' :column='c' />
          </th>
          <th class='dg-header dg-fill' />
        </tr>
        <tr v-if='loading' class='dg-loader'></tr>
      </thead>
      <tbody @click='toggle($event.target)'>
        <tr :style='{ height: virtual.topGap + "px" }'></tr>
        <tr v-for='d of virtual' :key='d.id'
            class='dg-row' :class='selected && selected.has(d) && "dg-selected"'
            :true-value='d'>
          <td v-if='selected' class='dg-cell'>
            <input type='checkbox' :checked='selected.has(d)' />
          </td>
          <td v-for='c of columns' v-text='d[c.data]' class='dg-cell' :class='c.right && "dg-right"' />
          <td class='dg-cell dg-fill' />
        </tr>
        <tr :style='{ height: virtual.bottomGap + "px" }'></tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import { shallowRef as sref, watch } from 'vue';
import { Column } from "./column";
import { useSelection } from "./selection";
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
    selected: Set,
  },

  setup(props: { columns?: Column[], data?: object[] | Promise<object[]>, selected?: Set<object> }) {
    const loading = sref(true);
    const data = sref([] as object[]);
    const selection = useSelection(data, props.selected);
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
      selected: props.selected,
      ...selection,
      ...sorting,
      virtual,
    };
  }
};
</script>

<style src='./datagrid.css'></style>