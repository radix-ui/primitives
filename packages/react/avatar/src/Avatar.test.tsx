import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, waitFor } from '@testing-library/react';
import { getPartDataAttr } from '@radix-ui/utils';
import * as Avatar from './Avatar';

const ROOT_TEST_ID = 'avatar-root';
const FALLBACK_TEXT = 'AB';
const DELAY = 300;

describe('given an Avatar with fallback and no image', () => {
  let rendered: RenderResult;
  let root: HTMLElement;
  let fallback: HTMLElement;

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
      </Avatar.Root>
    );
    root = rendered.getByTestId(ROOT_TEST_ID);
    fallback = rendered.getByText(FALLBACK_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a radix attribute on the root', () => {
    const partDataAttr = getPartDataAttr('Avatar');
    expect(root).toHaveAttribute(partDataAttr);
  });

  it('should have a radix attribute on the fallback', () => {
    const partDataAttr = getPartDataAttr('AvatarFallback');
    expect(fallback).toHaveAttribute(partDataAttr);
  });
});

describe('given an Avatar with fallback and a working image', () => {
  let rendered: RenderResult;

  const orignalImage = window.Image;
  beforeAll(() => {
    jest.useFakeTimers();
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
    jest.useRealTimers();
    window.Image = orignalImage;
  });

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback>{FALLBACK_TEXT}</Avatar.Fallback>
        <Avatar.Image data-testid="tst-123">{FALLBACK_TEXT}</Avatar.Image>
      </Avatar.Root>
    );
  });

  it('should render the fallback initially', () => {
    const fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).toBeInTheDocument();
  });

  it('should not render the image initially', () => {
    const image = rendered.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  // TODO: MockImage isn't working as expected. Come back and figure out why.
  // it('should render the image after it has loaded', async () => {
  //   let image: HTMLElement | null = null;
  //   await waitFor(() => {
  //     jest.advanceTimersByTime(DELAY);
  //   });
  //   image = rendered.queryByTestId('tst-123');
  //   expect(image).toBeInTheDocument();
  // });

  // it('should have a radix attribute on the image', () => {
  //   const partDataAttr = getPartDataAttr('AvatarImage');
  //   expect(root).toHaveAttribute(partDataAttr);
  // });
});

describe('given an Avatar with fallback and delayed render', () => {
  let rendered: RenderResult;
  let fallback: HTMLElement | null;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    rendered = render(
      <Avatar.Root data-testid={ROOT_TEST_ID}>
        <Avatar.Fallback delayMs={DELAY}>{FALLBACK_TEXT}</Avatar.Fallback>
      </Avatar.Root>
    );
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should not render a fallback immediately', () => {
    fallback = rendered.queryByText(FALLBACK_TEXT);
    expect(fallback).not.toBeInTheDocument();
  });

  it('should render a fallback after the delay', async () => {
    await waitFor(() => {
      jest.advanceTimersByTime(DELAY);
      fallback = rendered.queryByText(FALLBACK_TEXT);
    });
    expect(fallback).toBeInTheDocument();
  });
});

export default EventTarget;
