function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(...((arguments as unknown) as [E]));

    if (
      !isObject(event) ||
      checkForDefaultPrevented === false ||
      !((event as unknown) as Event).defaultPrevented
    ) {
      return ourEventHandler?.(...((arguments as unknown) as [E]));
    }
  };
}

function isObject(value: unknown): boolean {
  return value !== undefined && value !== null && typeof value === 'object';
}

export { composeEventHandlers };
