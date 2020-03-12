import { ObjectDirective } from "vue";

export const ResizeDirective = <ObjectDirective>{
  beforeMount(el, binding) {
    const size = binding.value as { width: number; height: number };
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        size.height = entry.contentRect.height;
        size.width = entry.contentRect.width;
      }
    });
    observer.observe(el);
  }
};