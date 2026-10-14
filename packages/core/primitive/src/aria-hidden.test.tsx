/**
 * Fork of `aria-hidden`
 *
 * MIT License
 * Copyright (c) 2017 Anton Korzunov
 */

import { act, cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { hideOthers, supportsInert, inertOthers, suppressOthers } from '.';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('hideOthers', () => {
  const factory = () => {
    const parent = React.createRef() as React.RefObject<HTMLDivElement>;
    const target1 = React.createRef() as React.RefObject<HTMLDivElement>;
    const target2 = React.createRef() as React.RefObject<HTMLDivElement>;
    const targetOutside1 = React.createRef() as React.RefObject<HTMLDivElement>;
    const wrapper = render(
      <div>
        <div ref={parent}>
          <div>hide me 1</div>
          <div ref={target1}>not me 2</div>
          <div>
            <div ref={target2}>not me 3</div>
          </div>
          <div ref={targetOutside1}>hide me 4</div>
          <svg>
            <text>svg</text>
          </svg>
          <div aria-hidden>I am already hidden! 5</div>
        </div>
        <div>dont touch me 6</div>
      </div>,
    );

    const html = () => wrapper.container.innerHTML;

    return {
      base: html(),
      wrapper: {
        html,
      },
      parent,
      target1,
      target2,
      targetOutside1,
    };
  };

  it('hides single', () => {
    const { base, parent, target1, target2, targetOutside1, wrapper } = factory();

    const unhide = hideOthers(new Set([target1.current]), parent.current);
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true">hide me 1</div><div>not me 2</div><div data-aria-hidden="true" aria-hidden="true"><div>not me 3</div></div><div data-aria-hidden="true" aria-hidden="true">hide me 4</div><svg data-aria-hidden="true" aria-hidden="true"><text>svg</text></svg><div aria-hidden="true" data-aria-hidden="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );

    expect(getNearestAttribute(target1.current, 'aria-hidden', parent)).toBe(null);
    expect(getNearestAttribute(target2.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'aria-hidden', parent)).toBe('true');

    unhide();
    expect(wrapper.html()).toEqual(base);
  });

  it('hides multiple', () => {
    const { base, parent, target1, target2, targetOutside1, wrapper } = factory();

    const unhide = hideOthers(new Set([target1.current, target2.current]), parent.current);
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true">hide me 1</div><div>not me 2</div><div><div>not me 3</div></div><div data-aria-hidden="true" aria-hidden="true">hide me 4</div><svg data-aria-hidden="true" aria-hidden="true"><text>svg</text></svg><div aria-hidden="true" data-aria-hidden="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );

    expect(getNearestAttribute(target1.current, 'aria-hidden', parent)).toBe(null);
    expect(getNearestAttribute(target2.current, 'aria-hidden', parent)).toBe(null);
    expect(getNearestAttribute(targetOutside1.current, 'aria-hidden', parent)).toBe('true');

    unhide();
    expect(wrapper.html()).toEqual(base);
  });

  it('hides cross', () => {
    const { base, parent, target1, target2, targetOutside1, wrapper } = factory();

    const unhide1 = hideOthers(new Set([target1.current]), parent.current);
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true">hide me 1</div><div>not me 2</div><div data-aria-hidden="true" aria-hidden="true"><div>not me 3</div></div><div data-aria-hidden="true" aria-hidden="true">hide me 4</div><svg data-aria-hidden="true" aria-hidden="true"><text>svg</text></svg><div aria-hidden="true" data-aria-hidden="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );

    expect(getNearestAttribute(target1.current, 'aria-hidden', parent)).toBe(null);
    expect(getNearestAttribute(target2.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'data-aria-hidden', parent)).toBe('true');

    const unhide2 = hideOthers(new Set([target2.current]), parent.current);

    expect(getNearestAttribute(target1.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(target2.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'data-aria-hidden', parent)).toBe('true');

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true">hide me 1</div><div data-aria-hidden="true" aria-hidden="true">not me 2</div><div data-aria-hidden="true" aria-hidden="true"><div>not me 3</div></div><div data-aria-hidden="true" aria-hidden="true">hide me 4</div><svg data-aria-hidden="true" aria-hidden="true"><text>svg</text></svg><div aria-hidden="true" data-aria-hidden="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );
    unhide1();

    expect(getNearestAttribute(target1.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(target2.current, 'aria-hidden', parent)).toBe(null);
    expect(getNearestAttribute(targetOutside1.current, 'aria-hidden', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'data-aria-hidden', parent)).toBe('true');

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true">hide me 1</div><div data-aria-hidden="true" aria-hidden="true">not me 2</div><div><div>not me 3</div></div><div data-aria-hidden="true" aria-hidden="true">hide me 4</div><svg data-aria-hidden="true" aria-hidden="true"><text>svg</text></svg><div aria-hidden="true" data-aria-hidden="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );
    unhide2();

    expect(wrapper.html()).toEqual(base);
  });

  it('hides cross markers', () => {
    const { base, parent, target1, target2, targetOutside1, wrapper } = factory();

    const unhide1 = hideOthers(new Set([target1.current]), parent.current, 'marker1');
    expect(getNearestAttribute(targetOutside1.current, 'marker1', parent)).toBe('true');

    const unhide2 = hideOthers(new Set([target2.current]), parent.current, 'marker2');

    expect(getNearestAttribute(targetOutside1.current, 'marker1', parent)).toBe('true');
    expect(getNearestAttribute(targetOutside1.current, 'marker2', parent)).toBe('true');

    unhide1();

    expect(getNearestAttribute(targetOutside1.current, 'marker1', parent)).toBe(null);

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div><div><div aria-hidden="true" marker2="true">hide me 1</div><div marker2="true" aria-hidden="true">not me 2</div><div><div>not me 3</div></div><div aria-hidden="true" marker2="true">hide me 4</div><svg aria-hidden="true" marker2="true"><text>svg</text></svg><div aria-hidden="true" marker2="true">I am already hidden! 5</div></div><div>dont touch me 6</div></div>"`,
    );
    unhide2();

    expect(wrapper.html()).toEqual(base);
  });

  it('handles aria-live', () => {
    const wrapper = render(
      <div>
        <div>
          <div id="to-be-hidden">hidden</div>
          <div aria-live="polite">not-hidden life</div>
          <div aria-live="off">hidden life</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(
      getNearestAttribute(root.querySelector('[aria-live]')!, 'aria-hidden', { current: root }),
    ).toBe(null);
    expect(
      getNearestAttribute(root.querySelector('#to-be-hidden')!, 'aria-hidden', { current: root }),
    ).toBe('true');
    expect(
      getNearestAttribute(root.querySelector('[aria-live="off"]')!, 'aria-hidden', {
        current: root,
      }),
    ).toBe(null);

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div><div id="to-be-hidden" data-aria-hidden="true" aria-hidden="true">hidden</div><div aria-live="polite">not-hidden life</div><div aria-live="off">hidden life</div></div><div>not-hidden</div></div></div>"`,
    );

    unhide();
  });

  it('handles script', () => {
    const scriptContainer = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={scriptContainer}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    // React warns when rendering `<script>`, so it is inserted directly
    scriptContainer.current!.append(document.createElement('script'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('script')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('script')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(scriptContainer.current!.getAttribute('aria-hidden')).toBe('true');
    expect(
      getNearestAttribute(root.querySelector('#to-be-hidden')!, 'aria-hidden', { current: root }),
    ).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><script></script></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(scriptContainer.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('handles style', () => {
    const container = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={container}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    container.current!.append(document.createElement('style'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('style')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('style')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(container.current!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><style></style></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(container.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('handles link', () => {
    const container = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={container}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    // React hoists `<link>` into `<head>`, so it is inserted directly
    container.current!.append(document.createElement('link'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('link')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('link')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(container.current!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><link></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(container.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('handles meta', () => {
    const container = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={container}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    // React hoists `<meta>` into `<head>`, so it is inserted directly
    container.current!.append(document.createElement('meta'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('meta')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('meta')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(container.current!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><meta></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(container.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('handles template', () => {
    const container = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={container}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    container.current!.append(document.createElement('template'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('template')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('template')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(container.current!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><template></template></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(container.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('handles noscript', () => {
    const container = React.createRef<HTMLDivElement>();
    const wrapper = render(
      <div>
        <div ref={container}>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div>not-hidden</div>
      </div>,
    );
    container.current!.append(document.createElement('noscript'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(root.querySelector('noscript')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('noscript')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(container.current!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-aria-hidden="true" aria-hidden="true"><div id="to-be-hidden">hidden</div><noscript></noscript></div><div>not-hidden</div></div></div>"`,
    );

    unhide();

    expect(container.current!.hasAttribute('aria-hidden')).toBe(false);
  });

  it('does not skip svg title elements', () => {
    const wrapper = render(
      <div>
        <svg>
          <title>icon</title>
          <circle />
        </svg>
        <div>not-hidden</div>
      </div>,
    );
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.querySelector('circle')!]), root);

    expect(root.querySelector('title')!.getAttribute('aria-hidden')).toBe('true');

    unhide();
  });

  it('does not mark script siblings of hidden elements', () => {
    const wrapper = render(
      <div>
        <div id="to-be-hidden">hidden</div>
        <div>not-hidden</div>
      </div>,
    );
    // React warns when rendering `<script>`, so it is inserted directly
    wrapper.container.firstElementChild!.append(document.createElement('script'));
    const root = wrapper.container;

    const unhide = hideOthers(new Set([root.firstElementChild!.children[1]!]), root);

    expect(root.querySelector('script')!.hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('script')!.hasAttribute('data-aria-hidden')).toBe(false);
    expect(root.querySelector('#to-be-hidden')!.getAttribute('aria-hidden')).toBe('true');

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div id="to-be-hidden" data-aria-hidden="true" aria-hidden="true">hidden</div><div>not-hidden</div><script></script></div></div>"`,
    );

    unhide();
  });
});

describe('inert', () => {
  it('supports in jsdom', () => {
    // not yet
    expect(supportsInert()).toBeFalsy();
  });

  it('inertOthers', () => {
    const wrapper = render(
      <div>
        <div>
          <div id="to-be-hidden">hidden</div>
        </div>
        <div id="not-to-be-hidden">not-hidden</div>
      </div>,
    );
    const root = wrapper.container;

    const unhide = inertOthers(new Set([root.firstElementChild!.lastElementChild!]), root);

    expect(
      getNearestAttribute(root.querySelector('#to-be-hidden')!, 'inert', { current: root }),
    ).toBe('true');
    expect(
      getNearestAttribute(root.querySelector('#not-to-be-hidden')!, 'inert', { current: root }),
    ).toBe(null);

    expect(wrapper.baseElement.innerHTML).toMatchInlineSnapshot(
      `"<div><div><div data-inert-ed="true" inert="true"><div id="to-be-hidden">hidden</div></div><div id="not-to-be-hidden">not-hidden</div></div></div>"`,
    );

    unhide();
  });

  it('preserves inert="false" since it is still inert', () => {
    const wrapper = render(
      <div>
        <div id="already-inert">already inert</div>
        <div id="not-to-be-hidden">not-hidden</div>
      </div>,
    );
    const root = wrapper.container;
    const alreadyInert = root.querySelector('#already-inert')!;

    alreadyInert.setAttribute('inert', 'false');

    const unhide = inertOthers(new Set([root.querySelector('#not-to-be-hidden')!]), root);

    expect(alreadyInert.getAttribute('inert')).toBe('false');
    expect(alreadyInert.getAttribute('data-inert-ed')).toBe('true');

    unhide();

    expect(alreadyInert.getAttribute('inert')).toBe('false');
    expect(alreadyInert.hasAttribute('data-inert-ed')).toBe(false);
  });
});

describe('suppressOthers', () => {
  describe('shadow dom', () => {
    it('Understand the host location', () => {
      function App() {
        return (
          <div className="App">
            <input id="input" />
            <input id="another-input" />
          </div>
        );
      }

      class WebComp extends HTMLElement {
        root: ShadowRoot;
        reactRoot: Root;
        getTarget() {
          return this.root.querySelector<HTMLInputElement>('#input')!;
        }
        getAnotherTarget() {
          return this.root.querySelector<HTMLInputElement>('#another-input')!;
        }
        constructor() {
          super();

          // attach to the Shadow DOM
          this.root = this.attachShadow({ mode: 'closed' });
          this.reactRoot = createRoot(this.root);
          act(() => this.reactRoot.render(<App />));
        }
      }

      if (!window.customElements.get('web-comp')) {
        window.customElements.define('web-comp', WebComp);
      }

      const webComp = document.createElement('web-comp') as WebComp;
      document.body.innerHTML = '<div id="test"></div>';
      document.body.appendChild(webComp);

      const unsuppressBody = suppressOthers(new Set([webComp.getTarget()]), document.body);
      expect(webComp.getAttribute('aria-hidden')).toBeFalsy();

      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div id="test" data-suppressed="true" aria-hidden="true"></div><web-comp></web-comp>"`,
      );

      expect(webComp.root.innerHTML).toMatchInlineSnapshot(
        `"<div class="App"><input id="input"><input id="another-input"></div>"`,
      );

      const unsuppressShadowRoot = suppressOthers(new Set([webComp.getTarget()]), webComp.root);
      expect(webComp.getTarget().getAttribute('aria-hidden')).toBeFalsy();
      expect(webComp.getAnotherTarget().getAttribute('aria-hidden')).not.toBeFalsy();

      unsuppressShadowRoot();
      unsuppressBody();
      document.body.innerHTML = '';

      // assert error
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const unsuppressDetached = suppressOthers(new Set([webComp.getTarget()]), document.body);

      expect(error).toHaveBeenCalledWith(
        'aria-hidden',
        webComp.getTarget(),
        expect.any(String),
        document.body,
        expect.any(String),
      );

      unsuppressDetached();
      act(() => webComp.reactRoot.unmount());
    });
  });
});

export function getNearestAttribute(
  node: Element,
  name: string,
  parent: React.RefObject<Element> | Element,
) {
  const attr = node.getAttribute(name);

  if (attr) {
    return attr;
  }

  if (
    node === parent ||
    node === (parent as React.RefObject<Element>).current ||
    !node.parentNode
  ) {
    return null;
  }

  return getNearestAttribute(node.parentNode as Element, name, parent);
}
