<template>
  <div class='dg-wrapper'>  
    <virt-scroller class='dg-scroller' v-resize='size'>
      <table ref='table' class='dg' :class='$props.selected && "dg-selectable"'>
        <thead>
          <tr>
            <th v-for='(c, i) of columns' 
                :key='i'
                class='dg-header' :class='[c.css, { "dg-sort": c.sortable !== false }]'
                :style='{ width: c.width }'
                @click='sortOn(c, $event.ctrlKey)'>
              <component :is='c.header' />
              <sort-indicator :sort='sort' :column='c' />
              <col-resizer :column='c' />
            </th>
          </tr>
          <tr v-if='loading' class='dg-loader'></tr>
        </thead>
        <virt-body @click='clicked($event.target)' v-slot='{ items }'>
          <tr v-for='d of items()' :key='d.id' v-item='d'
              class='dg-row' :class='$props.selected && $props.selected.has(d) && "dg-selected"'>
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
import { reactive, shallowRef as sref, watchEffect, onMounted, shallowReactive } from 'vue';
import { addFiller, autoSize, Column, ColumnDefinition, ColResizer } from './columns';
import { ItemDirective, getItem } from './item';
import ResizeDirective from './resize';
import { addSelection } from './selection';
import { useSorting, SortIndicator } from './sort';
import { useVirtual, VirtualBody, VirtualScroller } from './virtual';

export default {
  components: {
    'col-resizer': ColResizer,
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

  setup(props: { columns?: ColumnDefinition[], data?: object[] | Promise<object[]>, selected?: Set<object> }) {
    const loading = sref(true);
    const data = sref([] as object[]);
    const table = sref();
    const size = shallowReactive({ width: 0, height: 0});
    const sorting = useSorting(data);
    const { scrollToTop } = useVirtual(sorting.data, size);
    
    const columns: Column[] = reactive(props.columns!.map(c => ({
      header: (childProps: any) => c.label + "",
      render: (childProps: any) => childProps.data[c.data!] + "",      
      ...c, 
      defaultWidth: c.width 
    })));

    const select = addSelection(columns, data, props.selected);
    addFiller(columns, size);

    let autosized = false;

    onMounted(() => watchEffect(async () => {
      loading.value = true;
      let rawData = data.value = await props.data!;
      loading.value = false;
      scrollToTop();
      if (!autosized && rawData.length > 0)
        autoSize(table.value, columns);
    }));
    
    function clicked(el: Element) {
      const item = getItem(el);
      if (!item) return;
      
      if (select) select(item);
    }

    return {      
      clicked,
      columns,
      loading,
      table,
      size,
      ...sorting,
    };
  }
};
</script>

<style src='./datagrid.css'></style>