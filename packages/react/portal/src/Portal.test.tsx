import React from 'react';
import { render } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  test('render (default appends to body)', () => {
    const { baseElement } = render(<Portal>portal</Portal>);
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
        <interop-portal>
          portal
        </interop-portal>
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
        <interop-portal>
          portal 1
        </interop-portal>
        <interop-portal>
          portal 2
        </interop-portal>
      </body>
    `);
  });

  test('render in custom container', () => {
    function Example() {
      const portalContainerRef = React.useRef(null);
      return (
        <>
          <section id="portal-container" ref={portalContainerRef} />
          <Portal containerRef={portalContainerRef}>portal inside custom container</Portal>
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
            <interop-portal>
              portal inside custom container
            </interop-portal>
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
