import { FunctionalComponent } from 'vue';

export interface ColumnDefinition {
  label?: string;
  data?: string;
  css?: string;
  header?: FunctionalComponent;
  render?: FunctionalComponent;
  resizable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  width?: number;
};

export interface Column extends ColumnDefinition {
  key: string;
  defaultWidth?: number;
  width: number;
  offsetX?: number;
  animationX?: Animation;
  deltaX?: number;
  animate?(el: HTMLElement): void;
  dragged?: boolean;
}