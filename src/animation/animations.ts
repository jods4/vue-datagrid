const fadeKeyframes = [
  { opacity: 0 },
  { opacity: 1 },
];

export function fade(element: HTMLElement, delay: number) {
  element.animate(fadeKeyframes, {
    duration: 400,
    fill: 'backwards',
    delay,
  });
}

export function move(element: HTMLElement, distance: number, delay: number) {
  element.animate([
      { transform: `translateY(${distance}px)` },
      { transform: 'none' },
    ], {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'backwards',
      delay
    });
}