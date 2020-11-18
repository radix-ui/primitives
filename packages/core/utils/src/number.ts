function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function wrap(index: number, [min, max]: [number, number]) {
  return index < min ? max : index > max ? min : index;
}

export { clamp, wrap };
