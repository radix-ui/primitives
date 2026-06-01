import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { DismissableLayer } from './dismissable-layer';

describe('DismissableLayer', () => {
  afterEach(() => {
    cleanup();
    document.body.style.pointerEvents = '';
  });

  it('restores body pointer events after a disabled layer is removed from the stack', () => {
    document.body.style.pointerEvents = 'auto';

    const { rerender } = render(
      <TestLayers firstLayerDisabled secondLayerOpen />,
    );

    expect(document.body.style.pointerEvents).toBe('none');

    rerender(<TestLayers firstLayerDisabled={false} secondLayerOpen />);
    expect(document.body.style.pointerEvents).toBe('none');

    rerender(<TestLayers firstLayerDisabled={false} secondLayerOpen={false} />);
    expect(document.body.style.pointerEvents).toBe('auto');
  });
});

function TestLayers({
  firstLayerDisabled,
  secondLayerOpen,
}: {
  firstLayerDisabled: boolean;
  secondLayerOpen: boolean;
}) {
  return (
    <>
      <DismissableLayer disableOutsidePointerEvents={firstLayerDisabled} />
      {secondLayerOpen ? <DismissableLayer disableOutsidePointerEvents /> : null}
    </>
  );
}
