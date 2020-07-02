export function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}

export function arrayInsert<T>(array: T[], item: T, index: number) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}
