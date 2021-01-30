import React from 'react';
import { render } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  test('render (default appends to body)', () => {
    const { baseElement } = render(<Portal>portal</Portal>);
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
        <div
          data-radix-portal=""
          style="position: absolute; top: 0px; left: 0px; z-index: 2147483647;"
        >
          portal
        </div>
      </body>
    `);
  });

  test('render 2 portals (default appends to body)', () => {
    const { baseElement } = render(
      <>
        <Portal>portal 1</Portal>
        <Portal>portal 2</Portal>
      </>
    );
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
        <div
          data-radix-portal=""
          style="position: absolute; top: 0px; left: 0px; z-index: 2147483647;"
        >
          portal 1
        </div>
        <div
          data-radix-portal=""
          style="position: absolute; top: 0px; left: 0px; z-index: 2147483647;"
        >
          portal 2
        </div>
      </body>
    `);
  });

  test('render in custom container', () => {
    function Example() {
      const portalContainerRef = React.useRef(null);
      return (
        <>
          <Portal containerRef={portalContainerRef}>portal inside custom container</Portal>
          <section id="portal-container" ref={portalContainerRef} />
        </>
      );
    }
    const { baseElement } = render(<Example />);
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <section
            id="portal-container"
          >
            <div
              data-radix-portal=""
            >
              portal inside custom container
            </div>
          </section>
        </div>
      </body>
    `);
  });

  test('cleanup', () => {
    const { baseElement, unmount } = render(<Portal>portal</Portal>);
    unmount();
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });
});
