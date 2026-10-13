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

  // We should not hide aria-live elements and script elements
  //
  // See https://github.com/theKashey/aria-hidden/issues/10
  const additionalTargets = parentNode.querySelectorAll('[aria-live], script');
  for (const target of additionalTargets) {
    targets.add(target);
  }

  let markerCounter = markerMap.get(markerName);
  if (!markerCounter) {
    markerCounter = new WeakMap();
    markerMap.set(markerName, markerCounter);
  }

  const hiddenNodes = new Set<Element>();
  const elementsToKeep = new Set<Node>();
  const elementsToStop = new Set<Node>(targets);

  targets.forEach(keep);
  deep(parentNode);
  elementsToKeep.clear();
  lockCount++;

  return () => {
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

    lockCount--;

    if (!lockCount) {
      // clear
      counterMap = new WeakMap();
      uncontrolledNodes = new WeakMap();
      markerMap.clear();
    }
  };

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
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          const attr = node.getAttribute(controlAttribute);
          const alreadyHidden = attr !== null && attr !== 'false';
          const counterValue = (counterMap.get(node) || 0) + 1;
          const markerValue = (markerCounter?.get(node) || 0) + 1;

          counterMap.set(node, counterValue);
          markerCounter?.set(node, markerValue);
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

export { hideOthers, inertOthers, supportsInert, suppressOthers };
export type { Undo };
