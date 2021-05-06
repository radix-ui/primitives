function composeEventHandlers<E>(
  originalEventHandler?: (...args: any[]) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(...arguments);

    if (checkForDefaultPrevented === false || !((event as unknown) as Event).defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export { composeEventHandlers };
