import { createApp } from 'vue';
import MyApp from './app.vue';
import Datagrid from '../src/datagrid.vue';

createApp(MyApp)
  .component('ui-datagrid', Datagrid)
  .mount('#app');