// WIP, but I felt like including the scaffold for this test was better than nothing at all!
/* eslint-disable */
import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, fireEvent } from '@testing-library/react';
import { getPartDataAttr } from '@interop-ui/utils';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaButtonEnd,
  ScrollAreaButtonStart,
  ScrollAreaScrollbarX,
  ScrollAreaScrollbarY,
  ScrollAreaCorner,
  ScrollAreaTrack,
  ScrollAreaThumb,
} from './ScrollArea';

const BUTTON_UP_TEXT = 'Button Up';
const BUTTON_DOWN_TEXT = 'Button Down';
const BUTTON_LEFT_TEXT = 'Button Left';
const BUTTON_RIGHT_TEXT = 'Button Right';
const LONG_CONTENT_ID = 'long-content';

const ScrollAreaTest = ({ children, ...props }: React.ComponentProps<typeof ScrollArea>) => (
  <ScrollArea {...props}>
    <ScrollAreaScrollbarY>
      <ScrollAreaButtonStart style={{ height: 10, width: 10 }}>
        {BUTTON_UP_TEXT}
      </ScrollAreaButtonStart>
      <ScrollAreaTrack>
        <ScrollAreaThumb />
      </ScrollAreaTrack>
      <ScrollAreaButtonEnd style={{ height: 10, width: 10 }}>
        {BUTTON_DOWN_TEXT}
      </ScrollAreaButtonEnd>
    </ScrollAreaScrollbarY>

    <ScrollAreaScrollbarX>
      <ScrollAreaButtonStart style={{ height: 10, width: 10 }}>
        {BUTTON_LEFT_TEXT}
      </ScrollAreaButtonStart>

      <ScrollAreaTrack>
        <ScrollAreaThumb />
      </ScrollAreaTrack>
      <ScrollAreaButtonEnd style={{ height: 10, width: 10 }}>
        {BUTTON_RIGHT_TEXT}
      </ScrollAreaButtonEnd>
    </ScrollAreaScrollbarX>

    <ScrollAreaCorner />

    <ScrollAreaViewport>{children}</ScrollAreaViewport>
  </ScrollArea>
);

beforeAll(() => {
  (window as any).ResizeObserver = class {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: ResizeObserverCallback) {}
    disconnect() {}
    observe(target: Element, options?: any) {}
    unobserve(target: Element) {}
  };
});

describe('given a default ScrollArea', () => {
  let rendered: RenderResult;
  let buttonUp: HTMLElement;
  let buttonDown: HTMLElement;
  let buttonLeft: HTMLElement;
  let buttonRight: HTMLElement;
  let trackX: HTMLElement;
  let trackY: HTMLElement;
  let thumbX: HTMLElement;
  let thumbY: HTMLElement;
  let longContent: HTMLElement | null;
  let scrollArea: Node | null;
  let scrollable: Node | null;

  beforeEach(() => {
    rendered = render(
      <ScrollAreaTest>
        <LongContent />
      </ScrollAreaTest>
    );
    buttonUp = rendered.getByText(BUTTON_UP_TEXT);
    buttonDown = rendered.getByText(BUTTON_DOWN_TEXT);
    longContent = rendered.getByTestId(LONG_CONTENT_ID);
    scrollArea = rendered.container.firstChild;

    // NOTE: This is the actual scrollable element but we don't currently expose it as a component.
    // May be a better way to query for this that doesn't rely on an implementation detail.
    scrollable = rendered.container.querySelector(`[${getPartDataAttr('ScrollAreaPosition')}]`);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have an interop attribute on the container', () => {
    const partDataAttr = getPartDataAttr('ScrollArea');
    expect(scrollArea).toHaveAttribute(partDataAttr);
  });

  it('should render an up button', () => {
    // TODO:
    expect(true).toBe(true);
  });

  it('should render a down button', () => {
    // TODO:
    expect(true).toBe(true);
  });

  describe('when clicking the up button', () => {
    beforeEach(() => {
      // fireEvent.click(buttonUp);
      buttonUp = rendered.getByText(BUTTON_UP_TEXT);
      longContent = rendered.getByTestId(LONG_CONTENT_ID);
      scrollArea = rendered.container.firstChild;
    });

    it('should scroll up', () => {
      // TODO:
      expect(true).toBe(true);
    });
  });

  describe('when clicking the down button', () => {
    beforeEach(() => {
      // fireEvent.click(buttonDown);
      buttonDown = rendered.getByText(BUTTON_DOWN_TEXT);
      longContent = rendered.getByTestId(LONG_CONTENT_ID);
      scrollArea = rendered.container.firstChild;
    });

    it('should scroll down', () => {
      // TODO:
      expect(true).toBe(true);
    });
  });
});

function LongContent() {
  return (
    <div data-testid={LONG_CONTENT_ID}>
      <p>
        Lacinia hendrerit auctor nam quisque augue suscipit feugiat, sit at imperdiet vitae lacus.
        Dolor sit dui posuere faucibus non pharetra laoreet conubia, augue rhoncus cras nisl sodales
        proin hac ipsum, per hendrerit sed volutpat natoque curae consectetur. Curae blandit neque
        vehicula vel mauris vulputate per felis sociosqu, sodales integer sollicitudin id litora
        accumsan viverra pulvinar, mus non adipiscing dolor facilisis habitasse mi leo. Litora
        faucibus eu pulvinar tempus gravida iaculis consectetur risus euismod fringilla, dui posuere
        viverra sapien tortor mattis et dolor tempor sem conubia, taciti sociis mus rhoncus cubilia
        praesent dapibus aliquet quis. Diam hendrerit aliquam metus dolor fusce lorem, non gravida
        arcu primis posuere ipsum adipiscing, mus sollicitudin eros lacinia mollis.
      </p>
      <p>
        Habitant fames mi massa mollis fusce congue nascetur magna bibendum inceptos accumsan,
        potenti ipsum ac sollicitudin taciti dis rhoncus lacinia fermentum placerat. Himenaeos
        taciti egestas lacinia maecenas ornare ultricies, auctor vitae nulla mi posuere leo mollis,
        eleifend lacus rutrum ante curabitur. Nullam mi quisque nulla enim pretium facilisi interdum
        morbi, himenaeos velit fames pellentesque eget nascetur laoreet vel rutrum, malesuada risus
        ad netus dolor et scelerisque.
      </p>
      <ul>
        <li>Dis cubilia aenean tortor iaculis fames duis aliquet</li>
        <li>Erat non lacinia, tempor molestie fringilla</li>
        <li>Porttitor litora praesent placerat pulvinar</li>
        <li>Arcu curabitur fermentum felis sollicitudin varius nec cras</li>
      </ul>
      <p>
        Habitasse tristique hac ligula in metus blandit lobortis leo nullam litora, tempus fusce
        tincidunt phasellus urna est rhoncus pretium etiam eu, fames neque faucibus sociis primis
        felis dui vitae odio. Egestas purus morbi pulvinar luctus adipiscing rutrum ultrices hac,
        vehicula odio ridiculus cubilia vivamus blandit faucibus, dapibus velit sociis metus
        ultricies amet scelerisque.
      </p>
      <p>
        Scelerisque commodo nam cras litora lacinia primis fames morbi natoque, quisque ante duis
        phasellus pharetra convallis montes felis. Consectetur leo suspendisse fringilla elementum
        maecenas massa urna malesuada auctor senectus, pretium turpis nisi orci ipsum vulputate
        cubilia sociis adipiscing. Vulputate ridiculus amet dis accumsan non ultrices fames mattis
        hendrerit, ornare elementum sociosqu eget consectetur duis viverra vivamus tincidunt,
        blandit nulla porta semper dolor pharetra nisi scelerisque. Consequat conubia porta cras et
        ac auctor pellentesque luctus morbi potenti, viverra varius commodo venenatis vestibulum
        erat sagittis laoreet.
      </p>
    </div>
  );
}
