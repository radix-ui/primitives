/**
 * Type to define a possible event handler
 */
type PossibleHandler<E> = ((event: E) => void) | undefined;

/**
 * Merges multiple event handlers into a single event handler array
 * @param event Shared event for all merged event handlers
 * @param handlers Event handlers that will be merged
 * @returns A single event handler array of all provided handlers
 */
function mergeEventHandlers<E>(event: E, ...handlers: PossibleHandler<E>[]) {
  return handlers.forEach((handler) => {
    return handler?.(event);
  });
}

/**
 * Composes multiple event handlers into a single event handler function
 * @param handlers Array of event handlers that will be composed
 * @returns A single event handler function composed from all provided handlers
 */
function composeEventHandlers<E>(...handlers: PossibleHandler<E>[]) {
  // return the composed event handler
  return function (event: E) {
    return mergeEventHandlers(event, ...handlers);
  };
}

/**
 * Composes multiple preventable event handlers into a single handler
 * @param original Original event handler that we are composing from, this handler will always execute
 * @param handlers Array of additional event handlers that will only execute when the event has not been prevented
 * @returns A single event handler function composed from all provided handlers
 */
function composePreventableEventHandlers<E>(
  original: PossibleHandler<E>,
  ...handlers: PossibleHandler<E>[]
) {
  // return the composed event handler
  return function (event: E) {
    // original event handler will always execute
    original?.(event);

    // additional event handlers will only execute when default is not prevented
    if (!(event as unknown as Event).defaultPrevented) {
      return mergeEventHandlers(event, ...handlers);
    }
  };
}

export { composeEventHandlers, composePreventableEventHandlers };
