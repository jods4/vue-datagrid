import { InjectionKey, inject } from 'vue';

export interface VirtualState {
  scroller: Element;
  scrollTop: number;
  rowHeight: number;
  buffer: number;
  topGap: number;
  bottomGap: number;

  items: () => Iterator<object>;
}

export const injectKey : InjectionKey<VirtualState> = Symbol('virt-state');

export function getState() { return inject(injectKey)!; }