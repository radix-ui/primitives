import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
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

function renderRangeSlider(
  props: React.ComponentProps<typeof Slider.Root>,
  thumbCount = props.defaultValue?.length ?? props.value?.length ?? 2,
) {
  return render(
    <Slider.Root {...props}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <Slider.Thumb key={index} />
      ))}
    </Slider.Root>,
  );
}

function getThumbValue() {
  return Number(screen.getByRole('slider').getAttribute('aria-valuenow'));
}

function getThumbValues() {
  return screen.getAllByRole('slider').map((thumb) => Number(thumb.getAttribute('aria-valuenow')));
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

  // https://github.com/radix-ui/primitives/issues/3041
  describe('when the value is off the step grid', () => {
    it('snaps to the next aligned value on arrow up without skipping a step', async () => {
      const user = userEvent.setup();
      renderSlider({ defaultValue: [49000], min: 1000, max: 100000, step: 5000 });

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(51000);

      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(56000);
    });

    it('snaps to the next aligned value on arrow down without skipping a step', async () => {
      const user = userEvent.setup();
      renderSlider({ defaultValue: [49000], min: 1000, max: 100000, step: 5000 });

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(getThumbValue()).toBe(46000);
    });
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

  // Regression tests for https://github.com/radix-ui/primitives/issues/3963
  describe('ref stability', () => {
    it('keeps a stable composed ref on the root', () => {
      assertStableComposedRef((ref) => (
        <Slider.Root ref={ref} defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
      ));
    });

    it('keeps a stable composed ref on the thumb', () => {
      assertStableComposedRef((ref) => (
        <Slider.Root defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb ref={ref} />
        </Slider.Root>
      ));
    });
  });

  // Regression tests for https://github.com/radix-ui/primitives/issues/3698
  describe('when dragging a range thumb to overlap another', () => {
    function renderRangeSlider(props: React.ComponentProps<typeof Slider.Root>) {
      const result = render(
        <Slider.Root {...props} data-testid="slider">
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
          <Slider.Thumb />
        </Slider.Root>,
      );
      // The root slider element's bounding rect maps pointer coordinates to
      // values, so with a width of 100 over the [100, 110] range each unit of
      // value equals 10px (e.g. 107 → 70px).
      const slider = result.getByTestId('slider');
      slider.getBoundingClientRect = () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 10,
          right: 100,
          bottom: 10,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect;

      // jsdom implements the `PointerEvent` interface but not the pointer
      // capture methods that the slide handlers rely on, so we stub them here.
      // See https://github.com/jsdom/jsdom/pull/2666
      slider.setPointerCapture = () => {};
      slider.releasePointerCapture = () => {};
      slider.hasPointerCapture = () => true;
      return { ...result, slider };
    }

    it('calls `onValueCommit` with the narrowed value', () => {
      const handleValueCommit = vi.fn();
      const { slider } = renderRangeSlider({
        defaultValue: [105, 107],
        min: 100,
        max: 110,
        step: 1,
        onValueCommit: handleValueCommit,
      });

      // Grab the right thumb (value 107 → 70px), then drag it left onto the
      // left thumb (value 105 → 50px) so both thumbs share the same value.
      fireEvent.pointerDown(slider, { pointerId: 1, clientX: 70 });
      fireEvent.pointerMove(slider, { pointerId: 1, clientX: 50 });
      fireEvent.pointerUp(slider, { pointerId: 1, clientX: 50 });

      expect(handleValueCommit).toHaveBeenCalledTimes(1);
      expect(handleValueCommit).toHaveBeenCalledWith([105, 105]);
    });

    it('does not call `onValueCommit` when the value is unchanged', () => {
      const handleValueCommit = vi.fn();
      const { slider } = renderRangeSlider({
        defaultValue: [105, 107],
        min: 100,
        max: 110,
        step: 1,
        onValueCommit: handleValueCommit,
      });

      // Press and release on the right thumb without moving it.
      fireEvent.pointerDown(slider, { pointerId: 1, clientX: 70 });
      fireEvent.pointerUp(slider, { pointerId: 1, clientX: 70 });

      expect(handleValueCommit).not.toHaveBeenCalled();
    });
  });

  describe('preserveThumbOrder', () => {
    it('allows thumbs to swap by default', async () => {
      const user = userEvent.setup();
      renderRangeSlider({ defaultValue: [10, 30], min: 0, max: 100, step: 1 });

      screen.getAllByRole('slider')[0]!.focus();
      for (let i = 0; i < 25; i++) {
        await user.keyboard('{ArrowRight}');
      }

      // The first thumb crosses the second and they swap positions.
      expect(getThumbValues()).toEqual([30, 35]);
    });

    it('prevents a thumb from crossing its neighbour when set', async () => {
      const user = userEvent.setup();
      renderRangeSlider({
        defaultValue: [10, 30],
        min: 0,
        max: 100,
        step: 1,
        preserveThumbOrder: true,
      });

      screen.getAllByRole('slider')[0]!.focus();
      for (let i = 0; i < 25; i++) {
        await user.keyboard('{ArrowRight}');
      }

      // The first thumb stops at the second thumb's value instead of swapping.
      expect(getThumbValues()).toEqual([30, 30]);
    });

    it('respects `minStepsBetweenThumbs` when preserving order', async () => {
      const user = userEvent.setup();
      renderRangeSlider({
        defaultValue: [10, 30],
        min: 0,
        max: 100,
        step: 1,
        minStepsBetweenThumbs: 5,
        preserveThumbOrder: true,
      });

      screen.getAllByRole('slider')[0]!.focus();
      for (let i = 0; i < 25; i++) {
        await user.keyboard('{ArrowRight}');
      }

      // The first thumb stops 5 steps short of the second thumb.
      expect(getThumbValues()).toEqual([25, 30]);
    });
  });

  describe('within a form that is reset', () => {
    function renderSliderInForm(props: React.ComponentProps<typeof Slider.Root>) {
      return render(
        <form>
          <Slider.Root {...props}>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
          <button type="reset">Reset</button>
        </form>,
      );
    }

    it('should restore its `defaultValue` when the form is reset (uncontrolled)', async () => {
      const user = userEvent.setup();
      renderSliderInForm({ name: 'volume', defaultValue: [20], min: 0, max: 100 });

      screen.getByRole('slider').focus();
      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(21);

      await user.click(screen.getByText('Reset'));
      expect(getThumbValue()).toBe(20);
    });

    it('should restore its initial `value` when the form is reset (controlled)', async () => {
      function ControlledSlider() {
        const [value, setValue] = React.useState([20]);
        return (
          <form>
            <Slider.Root name="volume" value={value} onValueChange={setValue} min={0} max={100}>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Root>
            <button type="reset">Reset</button>
          </form>
        );
      }

      const user = userEvent.setup();
      render(<ControlledSlider />);

      screen.getByRole('slider').focus();
      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(21);

      await user.click(screen.getByText('Reset'));
      expect(getThumbValue()).toBe(20);
    });
  });

  describe('with external form association', () => {
    it('should restore its `defaultValue` when reset from an external form', async () => {
      const user = userEvent.setup();
      render(
        <>
          <form id="slider-reset-form">
            <button type="reset">Reset</button>
          </form>
          <Slider.Root name="volume" form="slider-reset-form" defaultValue={[20]} min={0} max={100}>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </>,
      );

      screen.getByRole('slider').focus();
      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(21);

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(getThumbValue()).toBe(20);
    });

    it('should restore its initial `value` when reset from an external form', async () => {
      function ControlledSlider() {
        const [value, setValue] = React.useState([20]);
        return (
          <>
            <form id="slider-reset-form">
              <button type="reset">Reset</button>
            </form>
            <Slider.Root
              name="volume"
              form="slider-reset-form"
              value={value}
              onValueChange={setValue}
              min={0}
              max={100}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Root>
          </>
        );
      }

      const user = userEvent.setup();
      render(<ControlledSlider />);

      screen.getByRole('slider').focus();
      await user.keyboard('{ArrowRight}');
      expect(getThumbValue()).toBe(21);

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(getThumbValue()).toBe(20);
    });
  });
});
