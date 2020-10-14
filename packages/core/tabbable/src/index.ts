// https://github.com/davidtheclark/tabbable/blob/master/src/index.js
const candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];
const candidateSelector = candidateSelectors.join(',');

const matches: (selectors: string) => boolean =
  typeof Element === 'undefined'
    ? () => false
    : Element.prototype.matches ||
      (Element.prototype as any).msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;

function tabbable(el: Element, options: TabbableOptions = {}) {
  options = options || {};

  const regularTabbables = [];
  const orderedTabbables = [];

  let candidates: NodeListOf<Element> | Element[] = el.querySelectorAll(candidateSelector);

  if (options.includeContainer) {
    if (matches.call(el, candidateSelector)) {
      candidates = Array.prototype.slice.apply(candidates);
      candidates.unshift(el);
    }
  }

  let candidate;
  let candidateTabindex;
  for (let i = 0; i < candidates.length; i++) {
    candidate = candidates[i];

    if (!isNodeMatchingSelectorTabbable(candidate)) {
      continue;
    }

    candidateTabindex = getTabindex(candidate);
    if (candidateTabindex === 0) {
      regularTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        node: candidate,
      });
    }
  }

  const tabbableNodes = orderedTabbables
    .sort(sortOrderedTabbables)
    .map((a) => a.node)
    .concat(regularTabbables);

  return tabbableNodes;
}

function isNodeMatchingSelectorTabbable(node: Element) {
  if (!isNodeMatchingSelectorFocusable(node) || isNonTabbableRadio(node) || getTabindex(node) < 0) {
    return false;
  }
  return true;
}

function isNodeMatchingSelectorFocusable(node: Element) {
  if ((node as any).disabled || isHiddenInput(node) || isHidden(node)) {
    return false;
  }
  return true;
}

function getTabindex(node: Element) {
  const tabindexAttr = parseInt(node.getAttribute('tabindex') as any, 10);
  if (!isNaN(tabindexAttr)) {
    return tabindexAttr;
  }
  // Browsers do not return `tabIndex` correctly for contentEditable nodes; so if they don't have a
  // tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) {
    return 0;
  }
  return (node as HTMLElement).tabIndex;
}

function sortOrderedTabbables(a: any, b: any) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
}

function isContentEditable(node: Element): node is HTMLElement {
  return (node as any).contentEditable === 'true';
}

function isInput(node: Element): node is HTMLInputElement {
  return node.tagName === 'INPUT';
}

function isHiddenInput(node: Element): node is HTMLInputElement {
  return isInput(node) && node.type === 'hidden';
}

function isRadio(node: Element): node is HTMLInputElement {
  return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node: Element): node is HTMLInputElement {
  return isRadio(node) && !isTabbableRadio(node);
}

function getCheckedRadio(nodes: NodeListOf<Element> | Element[]) {
  for (let i = 0; i < nodes.length; i++) {
    const input = nodes[i] as HTMLInputElement;
    if (isInput(input) && input.checked) {
      return input;
    }
  }
  return;
}

function isTabbableRadio(node: Element) {
  const input = node as HTMLInputElement;
  if (!input.name) {
    return true;
  }
  // This won't account for the edge case where you have radio groups with the same in separate
  // forms on the same page.
  const radioSet = input.ownerDocument.querySelectorAll(
    'input[type="radio"][name="' + input.name + '"]'
  );
  const checked = getCheckedRadio(radioSet);
  return !checked || checked === input;
}

function isHidden(node: Element) {
  // offsetParent being null will allow detecting cases where an element is invisible or inside an
  // invisible element, as long as the element does not use position: fixed. For them, their
  // visibility has to be checked directly as well.
  return (node as any).offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}

interface TabbableOptions {
  includeContainer?: boolean;
}

export { tabbable };
