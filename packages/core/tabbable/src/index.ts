// https://github.com/davidtheclark/tabbable/blob/master/src/index.js
let candidateSelectors = [
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
let candidateSelector = candidateSelectors.join(',');

let matches: (selectors: string) => boolean =
  typeof Element === 'undefined'
    ? () => false
    : Element.prototype.matches ||
      (Element.prototype as any).msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;

function tabbable(el: Element, options: TabbableOptions = {}) {
  options = options || {};

  let regularTabbables = [];
  let orderedTabbables = [];

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

  let tabbableNodes = orderedTabbables
    .sort(sortOrderedTabbables)
    .map((a) => a.node)
    .concat(regularTabbables);

  return tabbableNodes;
}

tabbable.isTabbable = isTabbable;
tabbable.isFocusable = isFocusable;

function isNodeMatchingSelectorTabbable(node: Element) {
  if (!isNodeMatchingSelectorFocusable(node) || isNonTabbableRadio(node) || getTabindex(node) < 0) {
    return false;
  }
  return true;
}

function isTabbable(node: Element) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(node);
}

function isNodeMatchingSelectorFocusable(node: Element) {
  if ((node as any).disabled || isHiddenInput(node) || isHidden(node)) {
    return false;
  }
  return true;
}

let focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
function isFocusable(node: Element) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(node);
}

function getTabindex(node: Element) {
  let tabindexAttr = parseInt(node.getAttribute('tabindex') as any, 10);
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
    let input = nodes[i] as HTMLInputElement;
    if (isInput(input) && input.checked) {
      return input;
    }
  }
  return;
}

function isTabbableRadio(node: Element) {
  let input = node as HTMLInputElement;
  if (!input.name) {
    return true;
  }
  // This won't account for the edge case where you have radio groups with the same in separate
  // forms on the same page.
  let radioSet = input.ownerDocument.querySelectorAll(
    'input[type="radio"][name="' + input.name + '"]'
  );
  let checked = getCheckedRadio(radioSet);
  return !checked || checked === input;
}

function isHidden(node: Element) {
  // offsetParent being null will allow detecting cases where an element is invisible or inside an
  // invisible element, as long as the element does not use position: fixed. For them, their
  // visibility has to be checked directly as well.
  return (node as any).offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}

export { tabbable };

interface TabbableOptions {
  includeContainer?: boolean;
}
