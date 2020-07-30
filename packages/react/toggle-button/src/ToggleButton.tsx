import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  PrimitiveStyles,
  useControlledState,
  useHasContext,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type ToggleButtonContextValue = {};
const [ToggleButtonContext] = createContext<ToggleButtonContextValue>(
  'ToggleButtonContext',
  'ToggleButton'
);

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'button';

type ToggleButtonDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ToggleButtonOwnProps = {
  /** Whether the button is toggled or not, if controlled */
  isToggled?: boolean;
  /**
   * Whether the button is toggled by default, if uncontrolled
   * (default: false)
   */
  defaultIsToggled?: boolean;
  /** A function called when the button is toggled */
  onToggle?(isToggled?: boolean): void;
};
type ToggleButtonProps = ToggleButtonDOMProps & ToggleButtonOwnProps;

const ToggleButton = forwardRef<typeof DEFAULT_TAG, ToggleButtonProps>(function ToggleButton(
  props,
  forwardedRef
) {
  const {
    as: Comp = DEFAULT_TAG,
    isToggled: isToggledProp,
    defaultIsToggled = false,
    onClick,
    onToggle,
    ...buttonProps
  } = props;

  const [isToggled, setIsToggled] = useControlledState({
    prop: isToggledProp,
    onChange: onToggle,
    defaultProp: defaultIsToggled,
  });

  return (
    <ToggleButtonContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp
        {...interopDataAttrObj('ToggleButton')}
        type="button"
        aria-pressed={Boolean(isToggled)}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => setIsToggled(!isToggled))}
        {...buttonProps}
      />
    </ToggleButtonContext.Provider>
  );
});

ToggleButton.displayName = 'ToggleButton';

/* ---------------------------------------------------------------------------------------------- */

const useHasToggleButtonContext = () => useHasContext(ToggleButtonContext);

const styles: PrimitiveStyles = {
  toggleButton: {
    ...cssReset(DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: 0,
    flexGrow: 1,
    lineHeight: '1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    // enable overlapping adjacent buttons via z-index
    position: 'relative',
  },
  'toggleButton.state.disabled': {
    pointerEvents: 'none',
  },
};

export { ToggleButton, styles, useHasToggleButtonContext };
export type { ToggleButtonProps };
