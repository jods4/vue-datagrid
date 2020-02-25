<template>
<div class='dg-wrapper'>
  <virt-scroller class='dg-scroller'>
    <table ref='table' class='dg' :class='selected && "dg-selectable"'>
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
import { shallowRef as sref, reactive, watch, h } from 'vue';
import { Column } from "./columns/column";
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
    
    watch(async () => {
      loading.value = true;
      data.value = await props.data!;
      loading.value = false;
      scrollToTop();
    });

    return {      
      columns,
      loading,
      table,
      selected: props.selected,
      ...selection,
      ...sorting,
    };
  }
};
</script>

<style src='./datagrid.css'></style>