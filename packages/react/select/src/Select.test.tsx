import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import * as Select from './Select';

describe('given a Select with defaultValue', () => {
  it('should set defaultValue as selected option', () => {
    const defaultValue = 'fr';
    let result;

    function handleSubmit(e: any) {
      e.preventDefault();
      result = e.target.elements.country.value;
    }

    render(
      <form onSubmit={handleSubmit}>
        <Select.Root name="country" autoComplete="country" defaultValue={defaultValue}>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="uk">
                <Select.ItemText>United Kingdom</Select.ItemText>
              </Select.Item>
              <Select.Item value="fr">
                <Select.ItemText>France</Select.ItemText>
              </Select.Item>
              <Select.Item value="es">
                <Select.ItemText>Spain</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
        <button type="submit">Submit</button>
      </form>
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(result).toBe(defaultValue);
  });

  it('should not be used when a value is passed', () => {
    const defaultValue = 'fr';
    const value = 'es';
    let result;

    function handleSubmit(e: any) {
      e.preventDefault();
      result = e.target.elements.country.value;
    }

    render(
      <form onSubmit={handleSubmit}>
        <Select.Root
          name="country"
          autoComplete="country"
          value={value}
          defaultValue={defaultValue}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="uk">
                <Select.ItemText>United Kingdom</Select.ItemText>
              </Select.Item>
              <Select.Item value="fr">
                <Select.ItemText>France</Select.ItemText>
              </Select.Item>
              <Select.Item value="es">
                <Select.ItemText>Spain</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
        <button type="submit">Submit</button>
      </form>
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(result).toBe('es');
  });
});
