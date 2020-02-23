import { InjectionKey, inject } from 'vue';

export interface VirtualState {
  scroller: Element;
  height: number;
  scrollTop: number;
  rowHeight: number;
  buffer: number;
  topGap: number;
  bottomGap: number;
  index: number;
  count: number;

  items: () => Iterator<object>;
}

export const injectKey : InjectionKey<VirtualState> = Symbol('virt-state');

export function getState() { return inject(injectKey)!; }