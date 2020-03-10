import { unref, markNonReactive } from 'vue';

const handler = {
  get(target: object, key: string | number | Symbol, receiver: any) {
    let value = target[<any>key];
    return typeof key === 'string' && key.startsWith('$') ?
      value :
      unref(value);
  }
}

export function view(data: object) {
  return markNonReactive(new Proxy(data, handler));
}