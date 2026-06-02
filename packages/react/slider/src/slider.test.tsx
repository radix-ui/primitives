import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect } from 'vitest';
import * as Slider from './slider';

function renderSlider(props: React.ComponentProps<typeof Slider.Root>) {
  return render(
    <Slider.Root {...props}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb />
    </Slider.Root>,
  );
}

function getThumbValue() {
  return Number(screen.getByRole('slider').getAttribute('aria-valuenow'));
}

describe('Slider', () => {
  afterEach(cleanup);

  it('steps by a normal step value on arrow key press', async () => {
    const user = userEvent.setup();
    renderSlider({ defaultValue: [0], min: 0, max: 1, step: 0.1 });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(getThumbValue()).toBeCloseTo(0.1, 10);
  });

  // https://github.com/radix-ui/primitives/issues/3852
  it('steps correctly when step is serialized in scientific notation', async () => {
    const user = userEvent.setup();
    renderSlider({ defaultValue: [0], min: 0, max: 1, step: 1e-7 });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(getThumbValue()).toBeCloseTo(1e-7, 12);
    await user.keyboard('{ArrowRight}');
    expect(getThumbValue()).toBeCloseTo(2e-7, 12);
  });

  it('preserves precision for fractional scientific-notation steps', async () => {
    const user = userEvent.setup();
    renderSlider({ defaultValue: [0], min: 0, max: 1, step: 1.5e-7 });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(getThumbValue()).toBeCloseTo(1.5e-7, 12);
  });
});
