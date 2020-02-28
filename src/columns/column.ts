import { FunctionalComponent } from 'vue';

export interface ColumnDefinition {
  label?: string;
  data?: string;
  css?: string;
  header?: FunctionalComponent;
  render?: FunctionalComponent;
  resizable?: boolean;
  sortable?: boolean;
  width?: string;
};

export interface Column extends ColumnDefinition {
  defaultWidth?: string;
}