'use client';
import * as React from 'react';
import { composeEventHandlers, RovingFocus } from 'radix-ui/internal';

type Direction = 'ltr' | 'rtl';

const RovingFocusContext = React.createContext<{
  dir: 'ltr' | 'rtl';
  setDir: React.Dispatch<React.SetStateAction<Direction>>;
}>({
  dir: 'ltr',
  setDir: () => void 0,
});
RovingFocusContext.displayName = 'RovingFocusContext';

export function RovingFocusProvider({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<Direction>('ltr');
  return (
    <div dir={dir}>
      <RovingFocusContext value={{ dir, setDir }}>{children}</RovingFocusContext>
    </div>
  );
}

export function RovingFocusToggle() {
  const { dir, setDir } = React.use(RovingFocusContext);
  return (
    <button type="button" onClick={() => setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'))}>
      Toggle to {dir === 'ltr' ? 'rtl' : 'ltr'}
    </button>
  );
}

const ButtonGroupContext = React.createContext<{
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({} as any);

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue'> &
  RovingFocus.RovingFocusGroupProps & { defaultValue?: string };

export function ButtonGroup({ defaultValue, ...props }: ButtonGroupProps) {
  const [value, setValue] = React.useState(defaultValue);
  const { dir } = React.use(RovingFocusContext);
  return (
    <ButtonGroupContext value={{ value, setValue }}>
      <RovingFocus.Root
        dir={dir}
        {...props}
        style={{
          ...props.style,
          display: 'inline-flex',
          flexDirection: props.orientation === 'vertical' ? 'column' : 'row',
          gap: 10,
        }}
      />
    </ButtonGroupContext>
  );
}

type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & { value?: string };

export function Button(props: ButtonProps) {
  const { value: contextValue, setValue } = React.use(ButtonGroupContext);
  const isSelected =
    contextValue !== undefined && props.value !== undefined && contextValue === props.value;

  return (
    <RovingFocus.Item asChild active={isSelected}>
      <button
        {...props}
        style={{
          ...props.style,
          border: '1px solid',
          borderColor: '#ccc',
          padding: '5px 10px',
          borderRadius: 5,
          ...(isSelected
            ? {
                borderColor: 'black',
                backgroundColor: 'black',
                color: 'white',
              }
            : {}),
        }}
        onClick={props.disabled ? undefined : () => setValue(props.value)}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          if (contextValue !== undefined) {
            event.target.click();
          }
        })}
      />
    </RovingFocus.Item>
  );
}
