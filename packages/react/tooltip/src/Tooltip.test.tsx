import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const TOOLTIP_CONTENT_TEST_ID = 'TOOLTIP_CONTENT_TEST_ID';

describe('when using Tooltip primitives', () => {
  describe('when adjusting mouse rest threshold durations', () => {
    beforeEach(() => {
      jest.useFakeTimers();

      (window as any).ResizeObserver = class {
        // eslint-disable-next-line @typescript-eslint/no-useless-constructor
        constructor(callback: ResizeObserverCallback) {}
        disconnect() {}
        observe(target: Element, options?: any) {}
        unobserve(target: Element) {}
      };

      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent>
            <div data-testid={TOOLTIP_CONTENT_TEST_ID}>Instantly rendered!</div>
          </TooltipContent>
        </Tooltip>
      );
    });

    describe('with duration at 0', () => {
      beforeEach(() => {
        window.RADIX_TOOLTIP_REST_THRESHOLD_DURATION = 0;
        window.RADIX_TOOLTIP_SKIP_REST_THRESHOLD_DURATION = 0;
      });

      it('renders the tooltip content instantly on hover', async () => {
        expect(screen.queryByTestId(TOOLTIP_CONTENT_TEST_ID)).toBeNull();
        fireEvent.mouseEnter(screen.getByText('Trigger'));
        jest.advanceTimersByTime(0);
        expect(await screen.findByTestId(TOOLTIP_CONTENT_TEST_ID)).not.toBeNull();
      });
    });

    describe.each([300, 1500])('to %i milliseconds', (duration) => {
      beforeEach(() => {
        window.RADIX_TOOLTIP_REST_THRESHOLD_DURATION = duration;
        window.RADIX_TOOLTIP_SKIP_REST_THRESHOLD_DURATION = duration;
      });

      it(`renders the tooltip content after ${duration} milliseconds`, async () => {
        expect(screen.queryByTestId(TOOLTIP_CONTENT_TEST_ID)).toBeNull();
        fireEvent.mouseEnter(screen.getByText('Trigger'));
        jest.advanceTimersByTime(duration);
        expect(await screen.findByTestId(TOOLTIP_CONTENT_TEST_ID)).not.toBeNull();
      });
    });
  });
});
