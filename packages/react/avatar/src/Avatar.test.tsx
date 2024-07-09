import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import * as Avatar from '@radix-ui/react-avatar';

const ROOT_TEST_ID = 'avatar-root';
const FALLBACK_TEXT = 'AB';
const IMAGE_ALT_TEXT = 'Fake Avatar';
const DELAY = 300;
const cache = new Set<string>();

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
    setTimeout(() => {
      this.dispatchEvent(new Event('load'));
      cache.add(this.src);
    }, DELAY);
  }

  get complete() {
    return !this.src || cache.has(this.src);
  }

  get naturalWidth() {
    return this.complete ? 300 : 0;
  }
}

describe('given an Avatar with fallback and no image', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
      </Avatar.Root>
    );
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });
});

describe('given an Avatar with fallback and a working image', () => {
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
    jest.restoreAllMocks();
  });

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
    const addEventListenerSpy = jest.spyOn(window.Image.prototype, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window.Image.prototype, 'removeEventListener');
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
    const spy = jest.spyOn(window.Image.prototype, 'naturalWidth', 'get');
    spy.mockReturnValue(0);
    rendered = render(ui('/test.png'));
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
    spy.mockRestore();
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
