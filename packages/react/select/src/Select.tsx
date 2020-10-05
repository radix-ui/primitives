import * as React from 'react';
import { cssReset, isFunction } from '@interop-ui/utils';
import {
  forwardRef,
  createStyleObj,
  createContext,
  useComposedRefs,
  composeEventHandlers,
} from '@interop-ui/react-utils';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { Lock } from '@interop-ui/react-lock';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { RemoveScroll } from 'react-remove-scroll';
import { Portal } from '@interop-ui/react-portal';
import { createCollection } from '@interop-ui/react-collection';

import type { PopperProps, PopperArrowProps } from '@interop-ui/react-popper';
import type { LockProps } from '@interop-ui/react-lock';
import type { Optional } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level contexts
 * -----------------------------------------------------------------------------------------------*/

type SelectContextValue = {
  buttonRef: React.RefObject<HTMLButtonElement>;
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const [SelectContext, useSelectContext] = createContext<SelectContextValue>(
  'SelectContext',
  'Select'
);

const [createSelectCollection, useSelectItem, useSelectItems] = createCollection<
  HTMLDivElement,
  {
    value: string;
    label: string;
    disabled: boolean;
  }
>('Select');

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

const SELECT_NAME = 'Select';

interface SelectStaticProps {
  Button: typeof SelectButton;
  Position: typeof SelectPosition;
  Options: typeof SelectOptions;
  Option: typeof SelectOption;
  Arrow: typeof SelectArrow;
}

type SelectProps = {
  id?: string;
  defaultValue?: string;
};

const Select = createSelectCollection(function Select(props) {
  const { children, defaultValue } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const context = React.useMemo(() => ({ buttonRef, value, setValue, open, setOpen }), [
    value,
    open,
    setOpen,
  ]);

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>;
}) as React.FC<SelectProps> & SelectStaticProps;

/* -------------------------------------------------------------------------------------------------
 * SelectButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'Select.Button';
const BUTTON_DEFAULT_TAG = 'button';

type SelectButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type SelectButtonOwnProps = {};
type SelectButtonProps = SelectButtonOwnProps & SelectButtonDOMProps;

const SelectButton = forwardRef<typeof BUTTON_DEFAULT_TAG, SelectButtonProps>(function SelectButton(
  props,
  forwardedRef
) {
  const { as: Comp = BUTTON_DEFAULT_TAG, onMouseDown, ...buttonProps } = props;
  const context = useSelectContext(BUTTON_NAME);
  const composedButtonRef = useComposedRefs(forwardedRef, context.buttonRef);
  const selectItems = useSelectItems();
  const selectedOptionLabel = selectItems.find((item) => item.value === context.value)?.label ?? '';

  return (
    <Comp
      {...interopDataAttrObj('button')}
      ref={composedButtonRef}
      type={Comp === BUTTON_DEFAULT_TAG ? 'button' : undefined}
      onMouseDown={composeEventHandlers(onMouseDown, () => context.setOpen(true))}
      {...buttonProps}
    >
      {selectedOptionLabel}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SelectPosition
 * -----------------------------------------------------------------------------------------------*/

const POSITION_NAME = 'Select.Position';
const POSITION_DEFAULT_TAG = 'div';

type SelectPositionDOMProps = React.ComponentPropsWithoutRef<typeof POSITION_DEFAULT_TAG>;
type SelectPositionOwnProps = {
  /**
   * A ref to an element to focus on inside the Select after it is opened.
   * (default: first focusable element inside the Select)
   * (fallback: first focusable element inside the Select, then the Select's content container)
   */
  refToFocusOnOpen?: LockProps['refToFocusOnActivation'];

  /**
   * A ref to an element to focus on outside the Select after it is closed.
   * (default: last focused element before the Select was opened)
   * (fallback: none)
   */
  refToFocusOnClose?: LockProps['refToFocusOnDeactivation'];

  /**
   * Whether pressing the `Escape` key should close the Select
   * (default: `true`)
   */
  shouldCloseOnEscape?: LockProps['shouldDeactivateOnEscape'];

  /**
   * Whether clicking outside the Select should close it
   * (default: `true`)
   */
  shouldCloseOnOutsideClick?: LockProps['shouldDeactivateOnOutsideClick'];

  /**
   * Whether pointer events happening outside the Select should be prevented
   * (default: `true`)
   */
  shouldPreventOutsideClick?: LockProps['shouldPreventOutsideClick'];

  /**
   * Whether scrolling outside the Select should be prevented
   * (default: `true`)
   */
  shouldPreventOutsideScroll?: boolean;

  /**
   * Whether the Select should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;
};
type SelectPositionProps = Optional<PopperProps, 'anchorRef'> &
  SelectPositionDOMProps &
  SelectPositionOwnProps;

const SelectPosition = forwardRef<typeof POSITION_DEFAULT_TAG, SelectPositionProps>(
  function SelectPosition(props, forwardedRef) {
    const context = useSelectContext(POSITION_NAME);
    return context.open ? (
      <SelectPositionImpl ref={forwardedRef} {...props} />
    ) : (
      <>{props.children}</>
    );
  }
);

const SelectPositionImpl = forwardRef<typeof POSITION_DEFAULT_TAG, SelectPositionProps>(
  function SelectPositionImpl(props, forwardedRef) {
    const {
      children,
      anchorRef,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape = true,
      shouldCloseOnOutsideClick = true,
      shouldPreventOutsideClick = true,
      shouldPreventOutsideScroll = true,
      shouldPortal = true,
      ...popoverProps
    } = props;
    const context = useSelectContext(POSITION_NAME);
    const debugContext = useDebugContext();

    const ScrollLockWrapper =
      shouldPreventOutsideScroll && !debugContext.disableLock ? RemoveScroll : React.Fragment;
    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <Lock
            onDeactivate={() => context.setOpen(false)}
            refToFocusOnActivation={refToFocusOnOpen}
            refToFocusOnDeactivation={refToFocusOnClose ?? context.buttonRef}
            shouldDeactivateOnEscape={shouldCloseOnEscape}
            shouldDeactivateOnOutsideClick={(event) => {
              if (event.target === context.buttonRef.current) {
                return false;
              }
              if (isFunction(shouldCloseOnOutsideClick)) {
                return shouldCloseOnOutsideClick(event);
              } else return shouldCloseOnOutsideClick;
            }}
            shouldPreventOutsideClick={shouldPreventOutsideClick}
          >
            <Popper
              {...interopDataAttrObj('position')}
              anchorRef={anchorRef || context.buttonRef}
              ref={forwardedRef}
              {...popoverProps}
              style={{
                ...props.style,
                pointerEvents: 'auto',
              }}
            >
              {children}
            </Popper>
          </Lock>
        </ScrollLockWrapper>
      </PortalWrapper>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectOptions
 * -----------------------------------------------------------------------------------------------*/

const OPTIONS_NAME = 'Select.Options';
const OPTIONS_DEFAULT_TAG = 'div';

type SelectOptionsDOMProps = React.ComponentPropsWithoutRef<typeof OPTIONS_DEFAULT_TAG>;
type SelectOptionsOwnProps = {};
type SelectOptionsProps = SelectOptionsDOMProps & SelectOptionsOwnProps;

const SelectOptions = forwardRef<typeof OPTIONS_DEFAULT_TAG, SelectOptionsProps>(
  function SelectOptions(props, forwardedRef) {
    const context = useSelectContext(OPTIONS_NAME);
    return context.open ? (
      <Popper.Content {...interopDataAttrObj('options')} {...props} ref={forwardedRef} />
    ) : (
      <div hidden>{props.children}</div>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectOption
 * -----------------------------------------------------------------------------------------------*/

const OPTION_NAME = 'Select.Option';
const OPTION_DEFAULT_TAG = 'div';

type SelectOptionDOMProps = React.ComponentPropsWithoutRef<typeof OPTION_DEFAULT_TAG>;
type SelectOptionOwnProps = {
  value: string;
  label: string;
  disabled?: boolean;
};
type SelectOptionProps = SelectOptionDOMProps & SelectOptionOwnProps;

const SelectOption = forwardRef<typeof OPTION_DEFAULT_TAG, SelectOptionProps>(function SelectOption(
  props,
  forwardedRef
) {
  const {
    as: Comp = OPTION_DEFAULT_TAG,
    value,
    label,
    disabled = false,
    onClick,
    ...optionProps
  } = props;
  const context = useSelectContext(OPTION_NAME);
  const { ref, index } = useSelectItem({ value, label, disabled });
  const composedOptionRef = useComposedRefs(forwardedRef, ref);

  return context.open ? (
    <Comp
      {...interopDataAttrObj('option')}
      ref={composedOptionRef}
      {...optionProps}
      tabIndex={context.value === value ? 0 : -1}
      onClick={composeEventHandlers(onClick, () => {
        context.setValue(value);
        context.setOpen(false);
      })}
    >
      {label}
    </Comp>
  ) : (
    <div ref={composedOptionRef} />
  );
});

/* -------------------------------------------------------------------------------------------------
 * SelectArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'Select.Arrow';
const ARROW_DEFAULT_TAG = 'svg';

type SelectArrowOwnProps = {};
type SelectArrowProps = PopperArrowProps & SelectArrowOwnProps;

const SelectArrow = forwardRef<typeof ARROW_DEFAULT_TAG, SelectArrowProps>(function SelectArrow(
  props,
  forwardedRef
) {
  const context = useSelectContext(ARROW_NAME);
  return context.open ? (
    <Popper.Arrow {...interopDataAttrObj('arrow')} {...props} ref={forwardedRef} />
  ) : null;
});

/* -----------------------------------------------------------------------------------------------*/

Select.Button = SelectButton;
Select.Position = SelectPosition;
Select.Options = SelectOptions;
Select.Option = SelectOption;
Select.Arrow = SelectArrow;

// Select.displayName = SELECT_NAME;
Select.Button.displayName = BUTTON_NAME;
Select.Position.displayName = POSITION_NAME;
Select.Options.displayName = OPTIONS_NAME;
Select.Option.displayName = OPTION_NAME;
Select.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(SELECT_NAME, {
  root: {},
  button: {
    ...cssReset(BUTTON_DEFAULT_TAG),
  },
  position: {
    ...cssReset(POSITION_DEFAULT_TAG),
    ...popperStyles.root,
  },
  options: {
    ...cssReset(OPTIONS_DEFAULT_TAG),
    ...popperStyles.content,
  },
  option: {
    ...cssReset(OPTION_DEFAULT_TAG),
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1',
    cursor: 'default',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export { Select, styles };
export type {
  SelectProps,
  SelectButtonProps,
  SelectPositionProps,
  SelectOptionsProps,
  SelectOptionProps,
  SelectArrowProps,
};
