/**
 * Utility to get the currently focused element even across Shadow DOM boundaries
 */
export function getDeepActiveElement(): Element | null {
  let activeElement = document.activeElement;

  // Traverse through shadow DOMs to find the deepest active element
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}
