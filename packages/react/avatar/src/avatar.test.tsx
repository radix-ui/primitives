import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, waitFor } from '@testing-library/react';
import * as Avatar from './avatar';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, it, beforeAll, afterAll, beforeEach, vi, expect } from 'vitest';

const ROOT_TEST_ID = 'avatar-root';
const FALLBACK_TEXT = 'AB';
const IMAGE_ALT_TEXT = 'Fake Avatar';
const DELAY = 300;
const cache = new Set<string>();

describe('given an Avatar with fallback and no image', () => {
  afterEach(cleanup);

  const ui = (
    <Avatar.Root data-testid={ROOT_TEST_ID}>
      <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
    </Avatar.Root>
  );

  it('should have no accessibility violations', async () => {
    const rendered = render(ui);
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should work with SSR', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = renderToString(ui);
    const rendered = render(ui, { hydrate: true, container });
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
  });
});

describe('given an Avatar with fallback and an image', () => {
  let rendered: RenderResult;
  let image: HTMLElement | null = null;
  const originalGlobalImage = window.Image;
  const ui = (src?: string) => (
    <Avatar.Root data-testid={ROOT_TEST_ID}>
      <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
      <Avatar.Image src={src} alt={IMAGE_ALT_TEXT} />
    </Avatar.Root>
  );

  beforeAll(() => {
    (window.Image as any) = MockImage;
  });

  afterAll(() => {
    window.Image = originalGlobalImage;
    vi.restoreAllMocks();
  });

  afterEach(cleanup);

  beforeEach(() => {
    cache.clear();
    rendered = render(ui('/test.png'));
  });

  it('should render the fallback initially', () => {
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
  });

  it('should not render the image initially', () => {
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('should render the image after it has loaded', async () => {
    image = await rendered.findByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should have alt text on the image', async () => {
    image = await rendered.findByAltText(IMAGE_ALT_TEXT);
    expect(image).toBeInTheDocument();
  });

  it('does not leak event listeners', async () => {
    rendered.unmount();
    const addEventListenerSpy = vi.spyOn(window.Image.prototype, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window.Image.prototype, 'removeEventListener');
    rendered = render(ui('/test.png'));
    rendered.unmount();
    expect(addEventListenerSpy.mock.calls.length).toEqual(removeEventListenerSpy.mock.calls.length);
  });

  it('can handle changing src', async () => {
    image = await rendered.findByRole('img');
    expect(image).toBeInTheDocument();
    rendered.rerender(ui('/test2.png'));
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
    image = await rendered.findByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should render the image immediately after it is cached', async () => {
    image = await rendered.findByRole('img');
    expect(image).toBeInTheDocument();

    rendered.unmount();
    rendered = render(ui('/test.png'));
    image = rendered.queryByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should not render image with no src', async () => {
    rendered.rerender(ui());
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
    rendered.unmount();
    rendered = render(ui());
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('should not render image with empty string as src', async () => {
    rendered.rerender(ui(''));
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
    rendered.unmount();
    rendered = render(ui(''));
    image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('should show fallback if image has no data', async () => {
    rendered.unmount();
    const spy = vi.spyOn(window.Image.prototype, 'naturalWidth', 'get');
    spy.mockReturnValue(0);
    rendered = render(ui('/test.png'));
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
    spy.mockRestore();
  });

  describe('SSR', () => {
    afterEach(cleanup);

    function renderAndHydrate(ui: React.ReactElement) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.innerHTML = renderToString(ui);
      return render(ui, { hydrate: true, container });
    }

    it('can render with working image', async () => {
      const rendered = renderAndHydrate(ui('/test.png'));
      let image = rendered.queryByRole('img');
      expect(image).not.toBeInTheDocument();

      image = await rendered.findByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('can render with no src', () => {
      const rendered = renderAndHydrate(ui());
      const image = rendered.queryByRole('img');
      expect(image).not.toBeInTheDocument();
      const fallback = rendered.queryByText(FALLBACK_TEXT);
      expect(fallback).toBeInTheDocument();
    });
  });
});

describe('given an Avatar with fallback and delayed render', () => {
  let rendered: RenderResult;
  let fallback: HTMLElement | null;

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback delayMs={DELAY}>{FALLBACK_TEXT}</Avatar.Fallback>
      </Avatar.Root>
    );
  });

  afterEach(cleanup);

  it('should not render a fallback immediately', () => {
    fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).not.toBeInTheDocument();
  });

  it('should render a fallback after the delay', async () => {
    fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).not.toBeInTheDocument();
    fallback = await rendered.findByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
  });
});

describe('given an Avatar with an image that only works when referrerPolicy=no-referrer', () => {
  let rendered: RenderResult;
  const originalGlobalImage = window.Image;
  const ui = (src?: string, referrerPolicy?: React.HTMLAttributeReferrerPolicy) => (
    <Avatar.Root data-testid={ROOT_TEST_ID}>
      <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
      <Avatar.Image src={src} alt={IMAGE_ALT_TEXT} referrerPolicy={referrerPolicy} />
    </Avatar.Root>
  );

  beforeAll(() => {
    (window.Image as any) = class MockNoReferrerImage extends MockImage {
      referrerPolicy: string | undefined;

      onSrcChange() {
        setTimeout(() => {
          if (this.referrerPolicy === 'no-referrer') {
            this.dispatchEvent(new Event('load'));
          } else {
            this.dispatchEvent(new Event('error'));
          }
        }, DELAY);
      }
    };
  });

  afterAll(() => {
    window.Image = originalGlobalImage;
    vi.restoreAllMocks();
  });

  afterEach(cleanup);

  describe('referrerPolicy=no-referrer', () => {
    beforeEach(() => {
      cache.clear();
      rendered = render(ui('/test.png', 'no-referrer'));
    });

    it('should render the fallback initially', () => {
      const fallback = rendered.queryByText(FALLBACK_TEXT);
      expect(fallback).toBeInTheDocument();
    });

    it('should not render the image initially', () => {
      const image = rendered.queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });

    it('should render the image after it has loaded', async () => {
      const image = await rendered.findByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('should have alt text on the image', async () => {
      const image = await rendered.findByAltText(IMAGE_ALT_TEXT);
      expect(image).toBeInTheDocument();
    });
  });

  describe('referrerPolicy=origin', () => {
    beforeEach(() => {
      cache.clear();
      rendered = render(ui('/test.png', 'origin'));
    });

    it('should render the fallback initially', () => {
      const fallback = rendered.queryByText(FALLBACK_TEXT);
      expect(fallback).toBeInTheDocument();
    });

    it('should never render the image', async () => {
      try {
        await waitFor(() => rendered.getByRole('img'), {
          timeout: DELAY + 100,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).name).toBe('TestingLibraryElementError');
        expect((error as Error).message).toContain('Unable to find role="img"');
      }
    });
  });
});

class MockImage extends EventTarget {
  _src: string = '';

  constructor() {
    super();
    return this;
  }

  get src() {
    return this._src;
  }

  set src(src: string) {
    if (!src) {
      return;
    }
    this._src = src;
    this.onSrcChange();
  }

  get complete() {
    return !this.src || cache.has(this.src);
  }

  get naturalWidth() {
    return this.complete ? 300 : 0;
  }

  onSrcChange() {
    setTimeout(() => {
      this.dispatchEvent(new Event('load'));
      cache.add(this.src);
    }, DELAY);
  }
}
