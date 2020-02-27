<template>
<div class='dg-wrapper'>  
  <virt-scroller class='dg-scroller'>
    <table ref='table' class='dg' :class='selected && "dg-selectable"' v-resize='size'>
      <thead>
        <tr>
          <th v-for='(c, i) of columns' 
              :key='i'
              class='dg-header' :class='[c.css, { "dg-sort": c.sortable !== false }]'
              :style='{ width: c.width }'
              @click='sortOn(c, $event.ctrlKey)'>
            {{ c.label }}
            <sort-indicator :sort='sort' :column='c' />
          </th>
        </tr>
        <tr v-if='loading' class='dg-loader'></tr>
      </thead>
      <virt-body @click='toggle($event.target)' v-slot='{ items }'>
        <tr v-for='d of items()' :key='d.id' v-item='d'
            class='dg-row' :class='selected && selected.has(d) && "dg-selected"'>
          <td v-for='(c,i) of columns' :key='i' class='dg-cell' :class='c.css'>
            <component :is='c.render' :data='d' />
          </td>
        </tr>
      </virt-body>
    </table>
  </virt-scroller>
</div>
</template>

<script lang="ts">
import { h, reactive, shallowRef as sref, watchEffect, onMounted, shallowReactive } from 'vue';
import { Column } from "./columns/column";
import { autoSize } from "./columns/autosize";
import ResizeDirective from "./resize";
import { useSelection, ItemDirective } from "./selection";
import { useSorting, SortIndicator } from "./sort/index";
import { useVirtual, VirtualBody, VirtualScroller } from "./virtual/index";

export default {
  components: {
    'sort-indicator': SortIndicator,
    'virt-body': VirtualBody,
    'virt-scroller': VirtualScroller,
  },

  directives: {
    'item': ItemDirective,
    'resize': ResizeDirective,
  },

  props: {
    columns: Array,
    data: [Array, Promise],
    selected: Set,
  },

  setup(props: { columns?: Column[], data?: object[] | Promise<object[]>, selected?: Set<object> }) {
    const loading = sref(true);
    const data = sref([] as object[]);
    const table = sref();
    const size = shallowReactive({ width: 0, height: 0});
    const selection = useSelection(data, props.selected);
    const sorting = useSorting(data);
    const { scrollToTop } = useVirtual(sorting.data);
    
    const columns = reactive([...props.columns!.map(c => ({ render: (childProps: any) => childProps.data[c.data!] + "", ...c, defaultWidth: c.width })), 
                              { css: 'dg-fill', sortable: false, render: () => '' }]);
    if (props.selected)
      columns.unshift({ 
        sortable: false, 
        defaultWidth: '',
        render: (childProps: any) => h('input', { type: 'checkbox', checked: props.selected!.has(childProps.data) }) 
      });
    let autosized = false;
    
    onMounted(() => watchEffect(async () => {
      loading.value = true;
      let rawData = data.value = await props.data!;
      loading.value = false;
      scrollToTop();
      if (!autosized && rawData.length > 0)
        autoSize(table.value, columns as { width?: string }[]);
    }));

    return {      
      columns,
      loading,
      table,
      size,
      selected: props.selected,
      ...selection,
      ...sorting,
    };
  }
};
</script>

<style src='./datagrid.css'></style>