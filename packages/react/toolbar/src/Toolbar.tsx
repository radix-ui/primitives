import * as React from 'react';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const ToolbarContext = React.createContext<{
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({} as any);

const Toolbar = React.forwardRef((props: any, forwardedRef) => {
  const {
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-controls': ariaControls,
    orientation = 'horizontal',
    direction: dir,
    loop,
    defaultValue,
    ...ToolbarProps
  } = props;

  const [value, setValue] = React.useState(defaultValue);

  return (
    <ToolbarContext.Provider value={{ value, setValue }}>
      <RovingFocusGroup orientation={orientation} dir={dir} loop={loop}>
        <div
          ref={forwardedRef}
          role="toolbar"
          aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
          aria-label={ariaLabel || undefined}
          aria-controls={ariaControls}
          aria-orientation={orientation}
          {...ToolbarProps}
        >
          {children}
        </div>
      </RovingFocusGroup>
    </ToolbarContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ToolbarItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToolbarItem';

const ToolbarItem = ({ disabled, tabIndex, value, ...props }: any) => {
  const rovingFocusProps = useRovingFocus({ disabled, active: false });

  return (
    <Primitive
      role="toolbaritem"
      selector={getSelector(ITEM_NAME)}
      aria-disabled={disabled || undefined}
      {...props}
      {...rovingFocusProps}
    />
  );
};

const Root = Toolbar;
const Item = ToolbarItem;

export {
  Toolbar,
  ToolbarItem,
  //
  Root,
  Item,
};
