import * as React from 'react';
import { axe } from 'vitest-axe';
import { cleanup, render, fireEvent, screen, act } from '@testing-library/react';
import * as Form from '.';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

afterEach(cleanup);

describe('Form', () => {
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
