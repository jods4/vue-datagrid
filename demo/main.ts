import { createApp } from 'vue';
import MyApp from './app.vue';
import Datagrid from '../src/datagrid.vue';

createApp(MyApp)
  .component('ui-datagrid', <any>Datagrid) // HACK: vue bug for now
  .mount('#app');