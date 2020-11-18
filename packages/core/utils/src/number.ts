function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function wrap(index: number, max: number) {
  return (max + index) % max;
}

export { clamp, wrap };
