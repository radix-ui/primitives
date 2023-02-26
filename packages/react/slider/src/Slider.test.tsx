import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Root, Track, Range, Thumb, SliderProps } from '@radix-ui/react-slider';

// Simulate a thumb size of 16 by 16
jest.mock('@radix-ui/react-use-size', () => ({
  useSize: () => ({ width: 16, height: 16 }),
}));

describe('given a default horizontal Slider', () => {
  describe('when computing elements positioning', () => {
    it('should compute positioning', () => {
      render(<DefaultSlider min={2} max={4} value={[3]} />);

      expect(screen.getByTestId('range').style.right).toBe('50%');
      expect(screen.getByTestId('thumb').parentElement?.style.left).toBe('calc(50% + 0px)');
    });

    it('should clamp a value below the minimum', () => {
      render(<DefaultSlider min={0} max={200} value={[-42]} />);

      expect(screen.getByTestId('range').style.right).toBe('100%');
      expect(screen.getByTestId('thumb').parentElement?.style.left).toBe('calc(0% + 8px)');
    });

    it('should clamp a value above the max', () => {
      render(<DefaultSlider min={0} max={200} value={[9000]} />);

      expect(screen.getByTestId('range').style.right).toBe('0%');
      expect(screen.getByTestId('thumb').parentElement?.style.left).toBe('calc(100% + -8px)');
    });
  });
});

function DefaultSlider(props: SliderProps) {
  return (
    <Root {...props}>
      <Track data-testid="track">
        <Range data-testid="range" />
      </Track>
      <Thumb data-testid="thumb" />
    </Root>
  );
}
