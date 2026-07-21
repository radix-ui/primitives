// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { sidecar } from './lib/use-sidecar';
import { RemoveScroll } from './remove-scroll';
import { RemoveScroll as RemoveScrollUI } from './ui';

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

const car = sidecar(async () => (await import('../src/sidecar')).SideCar);

afterEach(cleanup);

describe('RemoveScroll', () => {
  describe('UI', () => {
    it('smoke', async () => {
      const { container } = render(<RemoveScrollUI sideCar={car}>content</RemoveScrollUI>);
      await tick();
      expect(container.innerHTML).toBe('<div>content</div>');
    });

    it('smoke as style class', async () => {
      const { container } = render(
        <RemoveScrollUI sideCar={car} as="span" style={{ width: 'auto' }} className="name">
          content
        </RemoveScrollUI>,
      );
      await tick();
      expect(container.innerHTML).toBe('<span style="width: auto;" class="name">content</span>');
    });

    it('forward', async () => {
      const { container } = render(
        <RemoveScrollUI sideCar={car} forwardProps>
          <span>content</span>
        </RemoveScrollUI>,
      );
      await tick();
      expect(container.innerHTML).toBe('<span>content</span>');
    });
  });

  describe('Endpoint UI', () => {
    it('smoke', async () => {
      const { container } = render(<RemoveScroll>content</RemoveScroll>);
      expect(container.innerHTML).toContain('content');
      await tick();
      expect(container.innerHTML).toContain('content');
      expect(document.body.className).toBe('');
    });

    it('smoke inert', async () => {
      const { container, unmount } = render(<RemoveScroll inert>content</RemoveScroll>);
      expect(container.innerHTML).toContain('content');
      await tick();
      expect(container.innerHTML).toContain('content');
      // The `inert` prop adds a `block-interactivity-<id>` class to the body. The `<id>` is a
      // module-level counter that depends on how many locks have been instantiated in the run,
      // so we match the pattern rather than a fixed number (Enzyme's original assertion).
      expect(document.body.className).toMatch(/^block-interactivity-\d+$/);
      unmount();
      expect(document.body.className).toBe('');
    });

    it('forward', async () => {
      const { container } = render(
        <RemoveScroll forwardProps>
          <div>content</div>
        </RemoveScroll>,
      );
      expect(container.innerHTML).toContain('content');
      await tick();
      expect(container.innerHTML).toContain('content');
      expect(document.body.className).toBe('');
    });
  });
});
