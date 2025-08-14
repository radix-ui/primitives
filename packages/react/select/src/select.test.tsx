import React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import * as Select from './select';
import type { Mock } from 'vitest';
import { afterEach, describe, it, beforeEach, expect, vi } from 'vitest';
import { Label } from '@radix-ui/react-label';

Element.prototype.scrollIntoView = vi.fn();

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M2 20 L12 28 30 4" />
  </svg>
);

const LABEL_TEXT = 'Choose';
const SELECT_NAME = 'select_input';
const OPTION_ONE_TEXT = 'One';
const OPTION_ONE_VALUE = 'one';
const OPTION_TWO_TEXT = 'Two';
const OPTION_TWO_VALUE = 'two';
const OPTION_THREE_TEXT = 'Three';
const OPTION_THREE_VALUE = 'three';

const SelectTest = (props: React.ComponentProps<typeof Select.Root>) => (
  <Label>
    {LABEL_TEXT}
    <Select.Root {...props}>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value={OPTION_ONE_VALUE}>
              <Select.ItemText>{OPTION_ONE_TEXT}</Select.ItemText>
              <Select.ItemIndicator>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value={OPTION_TWO_VALUE}>
              <Select.ItemText>{OPTION_TWO_TEXT}</Select.ItemText>
              <Select.ItemIndicator>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value={OPTION_THREE_VALUE}>
              <Select.ItemText>{OPTION_THREE_TEXT}</Select.ItemText>
              <Select.ItemIndicator>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </Label>
);

describe('given a single isolated Select', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let trigger: HTMLElement;

  afterEach(cleanup);

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(<SelectTest onValueChange={handleValueChange} />);
    trigger = rendered.getByRole('combobox', { name: LABEL_TEXT });
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    it('should propagate the selected value', async () => {
      fireEvent.click(trigger);
      fireEvent.click(rendered.getByRole('option', { name: OPTION_ONE_TEXT }));
      expect(handleValueChange).toHaveBeenCalledWith(OPTION_ONE_VALUE);
    });
  });
});

describe('given a single Select in a form', () => {
  let handleFormChange: Mock;
  let rendered: RenderResult;
  let trigger: HTMLElement;

  afterEach(cleanup);

  beforeEach(() => {
    handleFormChange = vi.fn();
    rendered = render(
      <form
        onChange={(event) => {
          const formData = new FormData(event.currentTarget);
          const formDataEntries = Array.from(formData.entries()).reduce(
            (acc, [key, value]) => {
              const existing = Array.isArray(acc[key]) ? acc[key] : acc[key] ? [acc[key]] : [];
              acc[key] = [value, ...existing];
              return acc;
            },
            {} as Record<string, string | File | (string | File)[]>
          );
          handleFormChange(formDataEntries);
        }}
      >
        <SelectTest name={SELECT_NAME} />
      </form>
    );
    trigger = rendered.getByRole('combobox', { name: LABEL_TEXT });
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    it('should propagate the selected value', () => {
      fireEvent.click(trigger);
      fireEvent.click(rendered.getByRole('option', { name: OPTION_ONE_TEXT }));
      expect(handleFormChange).toHaveBeenCalledWith({
        [SELECT_NAME]: [OPTION_ONE_VALUE],
      });
    });
  });
});

describe('given a multiple isolated Select', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let trigger: HTMLElement;

  afterEach(cleanup);

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(<SelectTest multiple onValueChange={handleValueChange} />);
    trigger = rendered.getByRole('combobox', { name: LABEL_TEXT });
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    it('should propagate the selected value', () => {
      fireEvent.click(trigger);
      fireEvent.click(rendered.getByRole('option', { name: OPTION_ONE_TEXT }));
      fireEvent.click(rendered.getByRole('option', { name: OPTION_TWO_TEXT }));

      expect(handleValueChange).toHaveBeenCalledWith(
        expect.arrayContaining([OPTION_ONE_VALUE, OPTION_TWO_VALUE])
      );
    });
  });
});

describe('given a multi Select in a form', () => {
  let handleFormChange: Mock;
  let rendered: RenderResult;
  let trigger: HTMLElement;

  afterEach(cleanup);

  beforeEach(() => {
    handleFormChange = vi.fn();
    rendered = render(
      <form
        onChange={(event) => {
          const formData = new FormData(event.currentTarget);
          const formDataEntries = Array.from(formData.entries()).reduce(
            (acc, [key, value]) => {
              const existing = Array.isArray(acc[key]) ? acc[key] : acc[key] ? [acc[key]] : [];
              acc[key] = [value, ...existing];
              return acc;
            },
            {} as Record<string, string | File | (string | File)[]>
          );
          handleFormChange(formDataEntries);
        }}
      >
        <SelectTest multiple name={SELECT_NAME} />
      </form>
    );
    trigger = rendered.getByRole('combobox', { name: LABEL_TEXT });
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    it('should propagate the selected value', () => {
      fireEvent.click(trigger);
      fireEvent.click(rendered.getByRole('option', { name: OPTION_ONE_TEXT }));
      fireEvent.click(rendered.getByRole('option', { name: OPTION_TWO_TEXT }));
      expect(handleFormChange).toHaveBeenCalledWith({
        [SELECT_NAME]: expect.arrayContaining([OPTION_ONE_VALUE, OPTION_TWO_VALUE]),
      });
    });
  });
});
