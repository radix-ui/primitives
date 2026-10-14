/**
 * Fork of `aria-hidden`
 *
 * MIT License
 * Copyright (c) 2017 Anton Korzunov
 */

import { IS_DEVELOPMENT } from '@radix-ui/env-check/is-development';

type Undo = () => void;

type DomParentNode = Element | ShadowRoot;

let counterMap = /* @__PURE__ */ new WeakMap<Element, number>();
let uncontrolledNodes = /* @__PURE__ */ new WeakMap<Element, boolean>();
let lockCount = /* @__PURE__ */ 0;
const markerMap = /* @__PURE__ */ new Map<string, WeakMap<Element, number>>();

// Elements that are never rendered and are not in the accessibility tree, so
// marking them is wasted work.
//
// See https://html.spec.whatwg.org/multipage/rendering.html#hidden-elements
const SKIPPED_ELEMENTS = new Set([
  //
  'link',
  'meta',
  'noscript',
  'script',
  'style',
  'template',
]);

// Elements (and their ancestors) matching this selector are never hidden.
// `aria-live` regions are preserved so announcements still reach assistive
// technology. `data-radix-aria-hidden-exclude` lets components opt out
// explicitly, and must stay stable since different versions of Radix may share
// a page.
//
// TODO(2.0): Only exclude `aria-live` elements that are not set to `"off" since
// these are not live regions. Some users have used this as a workaround and we
// don't want to break their apps.
const EXCLUDED_SELECTOR = '[aria-live], [data-radix-aria-hidden-exclude]';

// Like the attribute, these event names must stay stable across versions
const EXCLUDED_ELEMENT_MOUNT_EVENT = 'radix-aria-hidden-exclude-mount';
const EXCLUDED_ELEMENT_UNMOUNT_EVENT = 'radix-aria-hidden-exclude-unmount';

/**
 * Notifies active `hideOthers`, `inertOthers` and `suppressOthers` calls that
 * an element with `data-radix-aria-hidden-exclude` has mounted after they ran,
 * so it is not left inside a hidden subtree.
 */
function notifyExcludedElementMounted(element: Element): void {
  element.dispatchEvent(new Event(EXCLUDED_ELEMENT_MOUNT_EVENT, { bubbles: true, composed: true }));
}

/**
 * Notifies active `hideOthers`, `inertOthers` and `suppressOthers` calls that
 * an element with `data-radix-aria-hidden-exclude` is unmounting, so ancestors
 * kept visible on its behalf can be hidden again.
 *
 * Must be called while the element is still connected to the DOM (eg. in a
 * layout effect cleanup) or the notification cannot reach them.
 */
function notifyExcludedElementUnmounting(element: Element): void {
  element.dispatchEvent(
    new Event(EXCLUDED_ELEMENT_UNMOUNT_EVENT, { bubbles: true, composed: true }),
  );
}

function unwrapHost(node: DomParentNode): Element | null {
  return node && ((node as ShadowRoot).host || unwrapHost(node.parentNode as Element));
}

function correctTargets(parent: DomParentNode, targets: Set<Element>): Set<Element> {
  const correctedTargets = new Set<Element>();
  for (const target of targets) {
    if (parent.contains(target)) {
      correctedTargets.add(target);
    } else {
      const correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        correctedTargets.add(correctedTarget);
      } else {
        if (IS_DEVELOPMENT) {
          console.error(
            'aria-hidden',
            target,
            'in not contained inside',
            parent,
            '. Doing nothing',
          );
        }
      }
    }
  }

  return correctedTargets;
}

/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param originalTargets - elements to keep on the page
 * @param parentNode - top element
 * @param markerName - a special attribute to mark every node
 * @param controlAttribute - html Attribute to control
 * @return undo command
 */
function applyAttributeToOthers(
  originalTargets: Set<Element>,
  parentNode: DomParentNode,
  markerName: string,
  controlAttribute: string,
): Undo {
  const targets = correctTargets(parentNode, originalTargets);

  const markerCounter = markerMap.get(markerName) ?? new WeakMap<Element, number>();
  markerMap.set(markerName, markerCounter);

  const hiddenNodes = new Set<Element>();
  let keptTargets = new Set<Element>();
  let elementsToKeep = new Set<Node>();
  let elementsToStop = new Set<Node>();
  let isReleased = false;
  let isRefreshScheduled = false;

  apply();
  lockCount++;

  parentNode.addEventListener(EXCLUDED_ELEMENT_MOUNT_EVENT, handleExcludedElementMount);
  parentNode.addEventListener(EXCLUDED_ELEMENT_UNMOUNT_EVENT, handleExcludedElementUnmount);

  return () => {
    isReleased = true;
    parentNode.removeEventListener(EXCLUDED_ELEMENT_MOUNT_EVENT, handleExcludedElementMount);
    parentNode.removeEventListener(EXCLUDED_ELEMENT_UNMOUNT_EVENT, handleExcludedElementUnmount);
    release();

    lockCount--;

    if (!lockCount) {
      // clear
      counterMap = new WeakMap();
      uncontrolledNodes = new WeakMap();
      markerMap.clear();
    }
  };

  function apply() {
    keptTargets = new Set(targets);
    for (const target of parentNode.querySelectorAll(EXCLUDED_SELECTOR)) {
      keptTargets.add(target);
    }

    elementsToKeep = new Set();
    elementsToStop = new Set(keptTargets);
    keptTargets.forEach(keep);
    deep(parentNode);
    elementsToKeep.clear();
    elementsToStop.clear();
  }

  function release() {
    for (const node of hiddenNodes) {
      const counterValue = counterMap.get(node)! - 1;
      const markerValue = markerCounter.get(node)! - 1;

      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);

      if (!counterValue) {
        if (!uncontrolledNodes.has(node)) {
          node.removeAttribute(controlAttribute);
        }

        uncontrolledNodes.delete(node);
      }

      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    }

    hiddenNodes.clear();
  }

  function handleExcludedElementMount(event: Event) {
    let node = event.target as Node | null;
    while (node && node !== parentNode) {
      if (hiddenNodes.has(node as Element)) {
        scheduleRefresh();
        return;
      }
      node = node.parentNode;
    }
  }

  function handleExcludedElementUnmount(event: Event) {
    if (keptTargets.has(event.target as Element)) {
      scheduleRefresh();
    }
  }

  function scheduleRefresh() {
    if (isRefreshScheduled) {
      return;
    }

    isRefreshScheduled = true;
    // An unmounting element is still connected when it notifies us, so the
    // refresh must wait until it has been removed from the DOM
    queueMicrotask(() => {
      isRefreshScheduled = false;
      if (isReleased) {
        return;
      }

      release();
      apply();
    });
  }

  function keep(el: Node | undefined) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }

    elementsToKeep.add(el);
    keep(el.parentNode!);
  }

  function deep(parent: DomParentNode | null) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }

    for (const node of parent.children) {
      if (SKIPPED_ELEMENTS.has(node.localName)) {
        continue;
      }

      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          const attr = node.getAttribute(controlAttribute);
          // `inert` is a boolean attribute, so `inert="false"` is still inert
          const alreadyHidden =
            controlAttribute === 'inert' ? attr !== null : attr !== null && attr !== 'false';
          const counterValue = (counterMap.get(node) || 0) + 1;
          const markerValue = (markerCounter.get(node) || 0) + 1;

          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.add(node);

          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }

          if (markerValue === 1) {
            node.setAttribute(markerName, 'true');
          }

          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, 'true');
          }
        } catch (e) {
          if (IS_DEVELOPMENT) {
            console.error('aria-hidden: cannot operate on ', node, e);
          }
        }
      }
    }
  }
}

/**
 * Marks everything except given nodes as aria-hidden
 *
 * @param originalTargets - elements to keep on the page
 * @param parentNode - top element
 * @param markerName - a special attribute to mark every node
 * @return undo command
 */
function hideOthers(
  originalTargets: Set<Element>,
  parentNode: DomParentNode,
  markerName = 'data-aria-hidden',
): Undo {
  return applyAttributeToOthers(originalTargets, parentNode, markerName, 'aria-hidden');
}

/**
 * Marks everything except given nodes as inert
 *
 * @param originalTargets - elements to keep on the page
 * @param parentNode - top element
 * @param markerName - a special attribute to mark every node
 * @return undo command
 */
function inertOthers(
  originalTargets: Set<Element>,
  parentNode: DomParentNode,
  markerName = 'data-inert-ed',
): Undo {
  return applyAttributeToOthers(originalTargets, parentNode, markerName, 'inert');
}

function supportsInert(): boolean {
  return typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('inert');
}

/**
 * Automatic function to "suppress" DOM elements - _hide_ or _inert_ in the best
 * possible way.
 *
 * @param originalTargets - elements to keep on the page
 * @param parentNode - top element
 * @param markerName - a special attribute to mark every node
 * @return undo command
 */
function suppressOthers(
  originalTargets: Set<Element>,
  parentNode: DomParentNode,
  markerName = 'data-suppressed',
): Undo {
  return (supportsInert() ? inertOthers : hideOthers)(originalTargets, parentNode, markerName);
}

export {
  hideOthers,
  inertOthers,
  notifyExcludedElementMounted,
  notifyExcludedElementUnmounting,
  supportsInert,
  suppressOthers,
};
export type { Undo };
