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
import { useLabelContext } from '@interop-ui/react-label';

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = 'Switch';
const SWITCH_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type SwitchDOMProps = React.ComponentPropsWithoutRef<typeof SWITCH_DEFAULT_TAG>;
type SwitchOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
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
      'aria-labelledby': ariaLabelledby,
      children,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      readOnly,
      value = 'on',
      onCheckedChange,
      ...switchProps
    } = props;
    const labelId = useLabelContext();
    const labelledBy = ariaLabelledby || labelId;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const ref = useComposedRefs(forwardedRef, buttonRef);
    const [checked = false, setChecked] = useControlledState({
      prop: checkedProp,
      defaultProp: defaultChecked,
    });

    return (
      /**
       * The `input` is hidden from non-SR and SR users as it only exists to
       * ensure form events fire when the value changes and that the value
       * updates when clicking an associated label.
       */
      <>
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          checked={checked}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          hidden
          onChange={composeEventHandlers(onCheckedChange, (event) => {
            setChecked(event.target.checked);
            /**
             * When this component is wrapped in a label, clicking the label
             * will not focus the button (but it will correctly trigger the input)
             * so we manually focus it.
             */
            if (buttonRef.current?.ownerDocument.activeElement !== buttonRef.current) {
              buttonRef.current?.focus();
            }
          })}
        />
        <Comp
          {...switchProps}
          {...interopDataAttrObj('root')}
          ref={ref}
          type={Comp === SWITCH_DEFAULT_TAG ? 'button' : undefined}
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelledBy}
          aria-required={required}
          data-state={getState(checked)}
          data-readonly={readOnly}
          disabled={disabled}
          value={value}
          /**
           * The `input` is hidden, so when the button is clicked we trigger
           * the input manually
           */
          onClick={() => inputRef.current?.click()}
        >
          <SwitchContext.Provider value={checked}>{children}</SwitchContext.Provider>
        </Comp>
      </>
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
  root: {
    ...cssReset(SWITCH_DEFAULT_TAG),
    verticalAlign: 'middle',
    textAlign: 'left',
  },
  thumb: {
    ...cssReset(THUMB_DEFAULT_TAG),
    display: 'inline-block',
    verticalAlign: 'middle',
  },
});

export type { SwitchProps, SwitchThumbProps };
export { Switch, styles };
