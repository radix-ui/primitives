import * as React from 'react';
import { render, RenderResult } from '@testing-library/react';
import * as Menubar from '.';

const MenubarFixture = () => {
  return <Menubar.Root />;
};

describe('given a default Menubar component', () => {
  // @ts-ignore
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<MenubarFixture />);
  });
  it('should be amazing', () => {
    expect(true).toBeTruthy();
  });
});
