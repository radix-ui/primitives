import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  composeEventHandlers,
  forwardRef,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = 'Switch';
const SWITCH_DEFAULT_TAG = 'input';

type SwitchDOMProps = React.ComponentPropsWithoutRef<typeof SWITCH_DEFAULT_TAG>;
type SwitchOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: SwitchDOMProps['onChange'];
};
type SwitchProps = SwitchOwnProps & Omit<SwitchDOMProps, keyof SwitchOwnProps | 'onChange'>;

const [SwitchContext, useSwitchContext] = createContext<boolean>(
  SWITCH_NAME + 'Context',
  SWITCH_NAME
);

const Switch = forwardRef<typeof SWITCH_DEFAULT_TAG, SwitchProps, SwitchStaticProps>(
  function Switch(props, forwardedRef) {
    const {
      as: Comp = SWITCH_DEFAULT_TAG,
      children,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      ...switchProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const ref = useComposedRefs(forwardedRef, inputRef);
    const [checked = false, setChecked] = useControlledState({
      prop: checkedProp,
      defaultProp: defaultChecked,
    });

    return (
      <span
        {...interopDataAttrObj('wrapper')}
        // Uses `inline-flex` to prevent extraneous whitespace below input
        style={{ display: 'inline-flex', verticalAlign: 'middle', position: 'relative' }}
      >
        <Comp
          {...switchProps}
          {...interopDataAttrObj('root')}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          data-state={getState(checked)}
          checked={checked}
          ref={ref}
          onChange={composeEventHandlers(onCheckedChange, (event) =>
            setChecked(event.target.checked)
          )}
        />
        <SwitchContext.Provider value={checked}>{children}</SwitchContext.Provider>
      </span>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'Switch.Thumb';
const THUMB_DEFAULT_TAG = 'span';

type SwitchThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type SwitchThumbOwnProps = {};
type SwitchThumbProps = SwitchThumbDOMProps & SwitchThumbOwnProps;

const SwitchThumb = forwardRef<typeof THUMB_DEFAULT_TAG, SwitchThumbProps>(function SwitchThumb(
  props,
  forwardedRef
) {
  const checked = useSwitchContext(THUMB_NAME);
  const { as: Comp = THUMB_DEFAULT_TAG, ...thumbProps } = props;
  return (
    <Comp
      {...thumbProps}
      {...interopDataAttrObj('thumb')}
      data-state={getState(checked)}
      ref={forwardedRef}
    />
  );
});

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

Switch.Thumb = SwitchThumb;

Switch.displayName = SWITCH_NAME;
Switch.Thumb.displayName = THUMB_NAME;

interface SwitchStaticProps {
  Thumb: typeof SwitchThumb;
}

const [styles, interopDataAttrObj] = createStyleObj(SWITCH_NAME, {
  wrapper: {},
  root: {
    ...cssReset(SWITCH_DEFAULT_TAG),
    appearance: 'none',
  },
  thumb: {
    ...cssReset(THUMB_DEFAULT_TAG),
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});

export type { SwitchProps, SwitchThumbProps };
export { Switch, styles };
