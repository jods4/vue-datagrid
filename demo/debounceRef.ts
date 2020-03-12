import { Ref } from 'vue';
import { track, trigger, TrackOpTypes, TriggerOpTypes } from '@vue/reactivity';

export function debouncedRef<T>(delay: number, value?: T) {  
  let timeout = 0;
  return <Ref<T>><any>{
    _isRef: true,
    get value() {
      track(this, TrackOpTypes.GET, 'value');
      return value;
    },
    set value(v) {
      value = v;
      clearTimeout(timeout);
      timeout = setTimeout(<Function>(() => trigger(this, TriggerOpTypes.SET, 'value')), delay);
    },
  };
}