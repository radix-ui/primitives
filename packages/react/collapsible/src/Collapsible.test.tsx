import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, fireEvent } from '@testing-library/react';
import { getPartDataAttr } from '@interop-ui/utils';
import { Collapsible } from './Collapsible';

const BUTTON_TEXT = 'Button';
const CONTENT_TEXT = 'Content';

const CollapsibleTest = (props: React.ComponentProps<typeof Collapsible>) => (
  <Collapsible {...props}>
    <Collapsible.Button>{BUTTON_TEXT}</Collapsible.Button>
    <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
  </Collapsible>
);

describe('given a default Collapsible', () => {
  let rendered: RenderResult;
  let button: HTMLElement;
  let content: HTMLElement | null;
  let collapsible: Node | null;

  beforeEach(() => {
    rendered = render(<CollapsibleTest />);
    button = rendered.getByText(BUTTON_TEXT);
    content = rendered.queryByText(CONTENT_TEXT);
    collapsible = rendered.container.firstChild;
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have an interop attribute on the container', () => {
    const partDataAttr = getPartDataAttr('Collapsible');
    expect(collapsible).toHaveAttribute(partDataAttr);
  });

  it('should have a data-state attribute on the container set to `closed`', () => {
    expect(collapsible).toHaveAttribute('data-state', 'closed');
  });

  it('should render a button', () => {
    expect(button).toBeVisible();
  });

  it('should have a data-state attribute on the button set to `closed`', () => {
    expect(button).toHaveAttribute('data-state', 'closed');
  });

  it('should have an interop attribute on the button', () => {
    const partDataAttr = getPartDataAttr('CollapsibleButton');
    expect(button).toHaveAttribute(partDataAttr);
  });

  it('should not render content', () => {
    expect(content).toBe(null);
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      fireEvent.click(button);
      content = rendered.getByText(CONTENT_TEXT);
      button = rendered.getByText(BUTTON_TEXT);
      collapsible = rendered.container.firstChild;
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    it('should have an interop attribute on the content', () => {
      const partDataAttr = getPartDataAttr('CollapsibleContent');
      expect(content).toHaveAttribute(partDataAttr);
    });

    it('should have a data-state attribute on the container set to `open`', () => {
      expect(collapsible).toHaveAttribute('data-state', 'open');
    });

    it('should have a data-state attribute on the button set to `open`', () => {
      expect(button).toHaveAttribute('data-state', 'open');
    });

    describe('and clicking the button again', () => {
      beforeEach(() => {
        fireEvent.click(button);
      });

      it('should close the content', () => {
        expect(content).not.toBeVisible();
      });

      it('should have a data-state attribute on the container set to `closed`', () => {
        expect(collapsible).toHaveAttribute('data-state', 'closed');
      });

      it('should have a data-state attribute on the button set to `closed`', () => {
        expect(button).toHaveAttribute('data-state', 'closed');
      });
    });
  });
});

describe('given a disabled Collapsible', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<CollapsibleTest disabled />);
  });

  it('should render a disabled button', () => {
    const button = rendered.getByText(BUTTON_TEXT);
    expect(button).toBeDisabled();
  });
});

describe('given an open uncontrolled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  const onToggle = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest defaultIsOpen={true} onToggle={onToggle} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  it('should render with open content', () => {
    expect(content).toBeVisible();
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
    });

    it('should call `onToggle` prop with `false` value', () => {
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should close the content', () => {
      expect(content).not.toBeVisible();
    });
  });
});

describe('given an open controlled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  const onToggle = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest isOpen={true} onToggle={onToggle} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  it('should render with open content', () => {
    expect(content).toBeVisible();
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
    });

    it('should call `onToggle` prop with `false` value', () => {
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should not close the content', () => {
      expect(content).toBeVisible();
    });
  });
});

describe('given styled parts', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <Collapsible className="container-class" isOpen={true}>
        <Collapsible.Button className="button-class">{BUTTON_TEXT}</Collapsible.Button>
        <Collapsible.Content className="content-class">{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible>
    );
  });

  it('should pass the className to the container', () => {
    const container = rendered.container.firstChild;
    expect(container).toHaveClass('container-class');
  });

  it('should pass the className to the button', () => {
    const button = rendered.getByText(BUTTON_TEXT);
    expect(button).toHaveClass('button-class');
  });

  it('should pass the className to the content', () => {
    const content = rendered.getByText(CONTENT_TEXT);
    expect(content).toHaveClass('content-class');
  });
});
