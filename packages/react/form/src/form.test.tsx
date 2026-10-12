import * as React from 'react';
import { axe } from 'vitest-axe';
import { cleanup, render, fireEvent, screen, act } from '@testing-library/react';
import * as Form from '.';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

describe('Form', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.spyOn(console, 'error').mockRestore();
  });

  describe('given components used within `Form.Field`', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Form.Root>
          <Form.Field name="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required />
            <Form.Message match="valueMissing">Email is required</Form.Message>
          </Form.Field>
        </Form.Root>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('should wire up the label, control and message via context', () => {
      render(
        <Form.Root>
          <Form.Field name="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required />
          </Form.Field>
        </Form.Root>,
      );

      const control = screen.getByLabelText('Email');
      expect(control).toHaveAttribute('name', 'email');
      // the control gets an auto-generated id that the label points at
      expect(control.id).toBeTruthy();
    });
  });

  describe('given components used outside `Form.Field` (explicit wiring)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Form.Root>
          <Form.Label name="email" htmlFor="email">
            Email
          </Form.Label>
          <Form.Control name="email" id="email" type="email" required />
          <Form.Message match="valueMissing" name="email">
            Email is required
          </Form.Message>
        </Form.Root>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('should associate a `Form.Label` with a `Form.Control` via `name`/`htmlFor`/`id`', () => {
      render(
        <Form.Root>
          <Form.Label name="email" htmlFor="email">
            Email
          </Form.Label>
          <Form.Control name="email" id="email" type="email" />
        </Form.Root>,
      );

      const control = screen.getByLabelText('Email');
      expect(control).toHaveAttribute('id', 'email');
      expect(control).toHaveAttribute('name', 'email');
    });

    // https://github.com/radix-ui/primitives/issues/2279
    it('should render a `Form.Message` outside `Form.Field` and toggle it based on validity', async () => {
      render(
        <Form.Root>
          <Form.Message match="valueMissing" name="email">
            Please enter your email address.
          </Form.Message>
          <Form.Field name="email">
            <Form.Control type="email" required />
          </Form.Field>
        </Form.Root>,
      );

      // the message is hidden until the control reports an error
      expect(screen.queryByText('Please enter your email address.')).not.toBeInTheDocument();

      const control = screen.getByRole('textbox');
      await act(async () => {
        fireEvent.invalid(control);
      });

      expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
    });

    it('should describe the control via `aria-describedby` when a message matches', async () => {
      render(
        <Form.Root>
          <Form.Control name="email" id="email" type="email" required />
          <Form.Message match="valueMissing" name="email">
            Please enter your email address.
          </Form.Message>
        </Form.Root>,
      );

      const control = screen.getByRole('textbox');
      await act(async () => {
        fireEvent.invalid(control);
      });

      const message = screen.getByText('Please enter your email address.');
      expect(control.getAttribute('aria-describedby')).toContain(message.id);
    });

    // Regression test for https://github.com/radix-ui/primitives/issues/2598
    it('should normalize existing aria-describedby ids and append a matching message id', async () => {
      render(
        <Form.Root>
          <Form.Control
            aria-describedby={' existing-description\texisting-description shared-description '}
            name="email"
            id="email"
            type="email"
            required
          />
          <Form.Message match="valueMissing" name="email">
            Please enter your email address.
          </Form.Message>
          <span id="existing-description">Existing description</span>
          <span id="shared-description">Shared description</span>
        </Form.Root>,
      );

      const control = screen.getByRole('textbox');
      expect(control).toHaveAttribute(
        'aria-describedby',
        'existing-description shared-description',
      );

      await act(async () => {
        fireEvent.invalid(control);
      });

      const message = screen.getByText('Please enter your email address.');
      expect(control).toHaveAttribute(
        'aria-describedby',
        `existing-description shared-description ${message.id}`,
      );
    });

    it('should expose validity through `Form.ValidityState` via `name`', async () => {
      render(
        <Form.Root>
          <Form.Control name="email" id="email" type="email" required />
          <Form.ValidityState name="email">
            {(validity) => (
              <span data-testid="validity">{validity?.valueMissing ? 'missing' : 'ok'}</span>
            )}
          </Form.ValidityState>
        </Form.Root>,
      );

      expect(screen.getByTestId('validity')).toHaveTextContent('ok');

      const control = screen.getByRole('textbox');
      await act(async () => {
        fireEvent.invalid(control);
      });

      expect(screen.getByTestId('validity')).toHaveTextContent('missing');
    });
  });

  describe('given a required prop is missing', () => {
    it('should throw when `Form.Control` has no `name`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.Control id="email" />
          </Form.Root>,
        ),
      ).toThrow(/`FormControl` must be used within `FormField` or specify the `name` prop/);
    });

    it('should throw when `Form.Control` has a `name` but no `id`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.Control name="email" />
          </Form.Root>,
        ),
      ).toThrow(/`FormControl` must be used within `FormField` or specify the `id` prop/);
    });

    it('should throw when `Form.Label` has no `name`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.Label htmlFor="email">Email</Form.Label>
          </Form.Root>,
        ),
      ).toThrow(/`FormLabel` must be used within `FormField` or specify the `name` prop/);
    });

    it('should throw when `Form.Label` has a `name` but no `htmlFor`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.Label name="email">Email</Form.Label>
          </Form.Root>,
        ),
      ).toThrow(/`FormLabel` must be used within `FormField` or specify the `htmlFor` prop/);
    });

    it('should throw when `Form.Message` has no `name`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.Message match="valueMissing">Required</Form.Message>
          </Form.Root>,
        ),
      ).toThrow(/`FormMessage` must be used within `FormField` or specify the `name` prop/);
    });

    it('should throw when `Form.ValidityState` has no `name`', () => {
      expect(() =>
        render(
          <Form.Root>
            <Form.ValidityState>{() => null}</Form.ValidityState>
          </Form.Root>,
        ),
      ).toThrow(/`FormValidityState` must be used within `FormField` or specify the `name` prop/);
    });
  });
});

describe('Form.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLFormElement>();
    const onClick = vi.fn();

    render(
      <Form.Root
        ref={ref}
        data-testid="form"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Form
      </Form.Root>,
    );

    const form = screen.getByTestId('form');
    expect(form.tagName).toBe('FORM');
    expect(form).toHaveClass('custom-class');
    expect(form.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(form);

    fireEvent.click(form);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLFormElement>();
    const onClick = vi.fn();

    render(
      <Form.Root
        asChild
        ref={ref}
        data-testid="form"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Form</article>
      </Form.Root>,
    );

    const form = screen.getByTestId('form');
    expect(form.tagName).toBe('ARTICLE');
    expect(form).toHaveClass('custom-class');
    expect(form.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(form);

    fireEvent.click(form);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Field', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field
          name="email"
          ref={ref}
          data-testid="field"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Field
        </Form.Field>
      </Form.Root>,
    );

    const field = screen.getByTestId('field');
    expect(field.tagName).toBe('DIV');
    expect(field).toHaveClass('custom-class');
    expect(field.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(field);

    fireEvent.click(field);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field
          name="email"
          serverInvalid
          asChild
          ref={ref}
          data-testid="field"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Field</article>
        </Form.Field>
      </Form.Root>,
    );

    const field = screen.getByTestId('field');
    expect(field.tagName).toBe('ARTICLE');
    expect(field).toHaveAttribute('data-invalid', 'true');
    expect(field).toHaveClass('custom-class');
    expect(field.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(field);

    fireEvent.click(field);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Label', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLLabelElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Label
            ref={ref}
            data-testid="label"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Email
          </Form.Label>
        </Form.Field>
      </Form.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLLabelElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Label
            asChild
            ref={ref}
            data-testid="label"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Email</article>
          </Form.Label>
        </Form.Field>
      </Form.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('ARTICLE');
    expect(label).toHaveAttribute('for');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Control', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control
            ref={ref}
            data-testid="control"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </Form.Field>
      </Form.Root>,
    );

    const control = screen.getByTestId('control');
    expect(control.tagName).toBe('INPUT');
    expect(control).toHaveClass('custom-class');
    expect(control.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(control);

    fireEvent.click(control);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control
            asChild
            ref={ref}
            data-testid="control"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <input />
          </Form.Control>
        </Form.Field>
      </Form.Root>,
    );

    const control = screen.getByTestId('control');
    expect(control.tagName).toBe('INPUT');
    expect(control).toHaveAttribute('name', 'email');
    expect(control).toHaveAttribute('id');
    expect(control).toHaveClass('custom-class');
    expect(control.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(control);

    fireEvent.click(control);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Message', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control />
          <Form.Message
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Message
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('SPAN');
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control />
          <Form.Message
            asChild
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Message</article>
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('ARTICLE');
    expect(message).toHaveAttribute('id');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', message.id);
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Message with a built-in `match`', () => {
  afterEach(cleanup);

  // A built-in `match` goes through a separate implementation that renders
  // nothing until the field is invalid, so `forceMatch` is used to bring it
  // into the DOM without running validation first.
  const FORCE_MATCH = true;

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control required />
          <Form.Message
            match="valueMissing"
            forceMatch={FORCE_MATCH}
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Email is required
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('SPAN');
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control required />
          <Form.Message
            match="valueMissing"
            forceMatch={FORCE_MATCH}
            asChild
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Email is required</article>
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('ARTICLE');
    expect(message).toHaveAttribute('id');
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Message with a custom `match`', () => {
  afterEach(cleanup);

  // A function `match` goes through yet another implementation, which registers
  // a custom matcher and is gated on the same `forceMatch`.
  const FORCE_MATCH = true;

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control />
          <Form.Message
            match={(value) => value === ''}
            forceMatch={FORCE_MATCH}
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Message
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('SPAN');
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Control />
          <Form.Message
            match={(value) => value === ''}
            forceMatch={FORCE_MATCH}
            asChild
            ref={ref}
            data-testid="message"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Message</article>
          </Form.Message>
        </Form.Field>
      </Form.Root>,
    );

    const message = screen.getByTestId('message');
    expect(message.tagName).toBe('ARTICLE');
    expect(message).toHaveAttribute('id');
    expect(message).toHaveClass('custom-class');
    expect(message.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(message);

    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Form.Submit', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      // jsdom cannot submit a form, so the submission the click triggers is
      // prevented.
      <Form.Root onSubmit={(event) => event.preventDefault()}>
        <Form.Submit
          ref={ref}
          data-testid="submit"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Submit
        </Form.Submit>
      </Form.Root>,
    );

    const submit = screen.getByTestId('submit');
    expect(submit.tagName).toBe('BUTTON');
    expect(submit).toHaveClass('custom-class');
    expect(submit.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(submit);

    fireEvent.click(submit);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Form.Root onSubmit={(event) => event.preventDefault()}>
        <Form.Submit
          asChild
          ref={ref}
          data-testid="submit"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button>Submit</button>
        </Form.Submit>
      </Form.Root>,
    );

    const submit = screen.getByTestId('submit');
    expect(submit.tagName).toBe('BUTTON');
    expect(submit).toHaveAttribute('type', 'submit');
    expect(submit).toHaveClass('custom-class');
    expect(submit.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(submit);

    fireEvent.click(submit);
    expect(onClick).toHaveBeenCalled();
  });
});
