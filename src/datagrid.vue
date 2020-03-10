<template>
  <div class='dg-wrapper'>  
    <virt-scroller class='dg-scroller' v-resize='size'>
      <table ref='$table' class='dg' :class='$props.selected && "dg-selectable"'>        
        <virt-body v-slot='{ items }'>
          <anim-body @click='clicked($event.target)' :data='data'>
            <tr v-for='d of items()' :key='d.id' v-item='d'
                class='dg-row' :class='$props.selected && $props.selected.has(d) && "dg-selected"'>
              <td v-for='c of columns' :key='c.key' 
                  class='dg-cell' :class='c.css'
                  v-anim-column='c.animate'>
                <component :is='c.render' :data='d' />
              </td>
            </tr>
          </anim-body>
        </virt-body>
        <!-- HACK: thead at the end is ugly, but required to have sticky headers on top of tr that 
                   have their own stacking context, e.g. when using opacity or transform. -->
        <thead>          
          <tr v-resize='headerSize'>
            <th v-for='c of columns' 
                :key='c.key'
                class='dg-header' :class='[c.css, { "dg-sort": c.sortable !== false, "dg-header-dragged": c.dragged }]'
                :style='{ width: c.width + "px" }'
                @click='sortOn(c, $event.ctrlKey)'
                @pointerdown='headerPointerDown($event, c)'
                v-anim-column='c.dragged ? null : c.animate'>
              <component :is='c.header' />
              <sort-indicator v-if='c.sortable !== false' :sort='sort' :column='c' />
              <col-resizer :column='c' />
            </th>
          </tr>
          <tr>
            <th :colspan='columns.length' class='dg-header dg-header-back' :style='{ height: headerSize.height + "px", width: headerSize.width + "px" }'></th>
          </tr>
          <tr v-if='loading' class='dg-loader' :style='{ top: headerSize.height + "px", width: headerSize.width + "px" }'></tr>
        </thead>
      </table>
    </virt-scroller>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, shallowReactive, shallowRef as sref, watchEffect } from 'vue';
import { AnimBody, AnimColumn, useAnimations } from "./animation";
import { addFiller, autoSize, Column, ColumnDefinition, ColResizer } from './columns';
import { ItemDirective, getItem } from './item';
import { view } from "./reactivity/view";
import ResizeDirective from './resize';
import { addSelection } from './selection';
import { useSorting, SortIndicator } from './sort';
import { useVirtual, VirtualBody, VirtualScroller } from './virtual';

export default {
  components: {
    'anim-body': AnimBody,
    'col-resizer': ColResizer,
    'sort-indicator': SortIndicator,
    'virt-body': VirtualBody,
    'virt-scroller': VirtualScroller,
  },

  directives: {
    'anim-column': AnimColumn,
    'item': ItemDirective,
    'resize': ResizeDirective,
  },

  props: {
    columns: Array,
    data: [Array, Promise],
    selected: Set,
  },

  setup(props: { columns?: ColumnDefinition[], data?: object[] | Promise<object[]>, selected?: Set<object> }) {
    const autoSized = sref(false);
    const loading = sref(true);
    const data = sref([] as object[]);
    const table = sref();
    const size = shallowReactive({ width: 0, height: 0 });
    const headerSize = shallowReactive({ width: 0, height: 0 });
    const sorting = useSorting(data);
    const { scrollToTop } = useVirtual(sorting.data, size);
    
    const columns: Column[] = reactive(props.columns!.map((c, i) => ({
      header: (childProps: any) => c.label + "",
      render: (childProps: any) => childProps.data[c.data!] + "",      
      width: 0,
      ...c,       
      defaultWidth: c.width,
      key: 'user-' + i,
    })));

    const select = addSelection(columns, data, props.selected);
    addFiller(columns, size);    

    const headerPointerDown = useAnimations(columns, autoSized);

    onMounted(() => watchEffect(async () => {
      loading.value = true;
      data.value = await props.data!;
      loading.value = false;
      scrollToTop();
      autoSize(table.value, columns, autoSized);
    }));
    
    function clicked(el: Element) {
      const item = getItem(el);
      if (!item) return;
      
      if (select) select(item);
    }

    return view({
      headerPointerDown,
      clicked,
      columns,
      loading,
      $table: table,
      size,
      headerSize,
      ...sorting,
    });
  }
};
</script>

<style src='./datagrid.css'></style>