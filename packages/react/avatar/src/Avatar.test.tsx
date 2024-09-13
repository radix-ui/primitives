import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import * as Avatar from '@radix-ui/react-avatar';

const ROOT_TEST_ID = 'avatar-root';
const FALLBACK_TEXT = 'AB';
const IMAGE_ALT_TEXT = 'Fake Avatar';
const DELAY = 300;
const FRAMEWORK_IMAGE_TEST_ID = 'framework-image-component';
const FRAMEWORK_IMAGE_ALT_TEXT = 'framework test';

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
  const orignalGlobalImage = window.Image;

  beforeAll(() => {
    (window.Image as any) = class MockImage {
      onload: () => void = () => {};
      src: string = '';

      constructor() {
        setTimeout(() => {
          this.onload();
        }, DELAY);
        return this;
      }
    };
  });

  afterAll(() => {
    window.Image = orignalGlobalImage;
  });

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
        <Avatar.Image src="/test.jpg" alt={IMAGE_ALT_TEXT} />
      </Avatar.Root>
    );
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

describe('given an Avatar with fallback and child image', () => {
  let rendered: RenderResult;
  let image: HTMLElement | null = null;
  const orignalGlobalImage = window.Image;

  beforeAll(() => {
    (window.Image as any) = class MockImage {
      onload: () => void = () => {};
      src: string = '';

      constructor() {
        setTimeout(() => {
          this.onload();
        }, DELAY);
        return this;
      }
    };
  });

  afterAll(() => {
    window.Image = orignalGlobalImage;
  });

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Image asChild>
          <img
            src="/test.jpg"
            data-testid={FRAMEWORK_IMAGE_TEST_ID}
            alt={FRAMEWORK_IMAGE_ALT_TEXT}
          />
        </Avatar.Image>
        <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
      </Avatar.Root>
    );
    console.log(rendered);
  });

  it('should render the image after it has loaded', async () => {
    image = await rendered.findByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should have alt text on the image', async () => {
    image = await rendered.findByAltText(FRAMEWORK_IMAGE_ALT_TEXT);
    expect(image).toBeInTheDocument();
  });

  it('should render the fallback initially', () => {
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
  });

  it('should render the image framework component', () => {
    const frameworkImage = rendered.queryByTestId(FRAMEWORK_IMAGE_TEST_ID);
    expect(frameworkImage).toBeInTheDocument();
  });
});
