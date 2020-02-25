import { FunctionalComponent } from 'vue';

export interface Column {
  label?: string;
  data?: string;
  css?: string;
  render?: FunctionalComponent;
  sortable?: boolean;
  width?: string;
};