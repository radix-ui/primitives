type Measurable = { getBoundingClientRect(): DOMRect };

/**
 * Observes an element's rectangle on screen (getBoundingClientRect)
 * This is useful to track elements on the screen and attach other elements
 * that might be in different layers, etc.
 */
function observeElementRect(
  /** The element whose rect to observe */
  elementToObserve: Measurable,
  /** The callback which will be called when the rect changes */
  callback: CallbackFn
) {
  const observedData = observedElements.get(elementToObserve);

  if (observedData === undefined) {
    // add the element to the map of observed elements with its first callback
    // because this is the first time this element is observed
    observedElements.set(elementToObserve, { rect: {} as DOMRect, callbacks: [callback] });

    if (observedElements.size === 1) {
      // start the internal loop once at least 1 element is observed
      rafId = requestAnimationFrame(runLoop);
    }
  } else {
    // only add a callback for this element as it's already observed
    observedData.callbacks.push(callback);
    callback(elementToObserve.getBoundingClientRect());
  }

  return () => {
    const observedData = observedElements.get(elementToObserve);
    if (observedData === undefined) return;

    // start by removing the callback
    const index = observedData.callbacks.indexOf(callback);
    if (index > -1) {
      observedData.callbacks.splice(index, 1);
    }

    if (observedData.callbacks.length === 0) {
      // stop observing this element because there are no
      // callbacks registered for it anymore
      observedElements.delete(elementToObserve);

      if (observedElements.size === 0) {
        // stop the internal loop once no elements are observed anymore
        cancelAnimationFrame(rafId);
      }
    }
  };
}

// ========================================================================
// module internals

type CallbackFn = (rect: DOMRect) => void;

type ObservedData = {
  rect: DOMRect;
  callbacks: Array<CallbackFn>;
};

let rafId: number;
const observedElements: Map<Measurable, ObservedData> = new Map();

function runLoop() {
  const changedRectsData: Array<ObservedData> = [];

  // process all DOM reads first (getBoundingClientRect)
  observedElements.forEach((data, element) => {
    const newRect = element.getBoundingClientRect();

    // gather all the data for elements whose rects have changed
    if (!rectEquals(data.rect, newRect)) {
      data.rect = newRect;
      changedRectsData.push(data);
    }
  });

  // group DOM writes here after the DOM reads (getBoundingClientRect)
  // as DOM writes will most likely happen with the callbacks
  changedRectsData.forEach((data) => {
    data.callbacks.forEach((callback) => callback(data.rect));
  });

  rafId = requestAnimationFrame(runLoop);
}
// ========================================================================

/**
 * Returns whether 2 rects are equal in values
 */
function rectEquals(rect1: DOMRect, rect2: DOMRect) {
  return (
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom &&
    rect1.left === rect2.left
  );
}

export { observeElementRect };
export type { Measurable };
