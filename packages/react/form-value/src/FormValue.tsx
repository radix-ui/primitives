import React from 'react';
import { forwardRef, useComposedRefs } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * FormValue
 * -----------------------------------------------------------------------------------------------*/

/* This is a utility component to be used within custom form controls */

const FORM_VALUE_NAME = 'FormValue';
const FORM_VALUE_DEFAULT_TAG = 'input';

type FormValueDOMProps = React.ComponentPropsWithoutRef<typeof FORM_VALUE_DEFAULT_TAG>;
type FormValueOwnProps = {};
type FormValueProps = FormValueDOMProps & FormValueOwnProps;

const FormValue = forwardRef<typeof FORM_VALUE_DEFAULT_TAG, FormValueProps>(function FormValue(
  props,
  forwardedRef
) {
  const { name, value, ...inputProps } = props;
  const Comp = FORM_VALUE_DEFAULT_TAG;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const ref = useComposedRefs(inputRef, forwardedRef);

  /**
   * Triggers `onChange` event on forms when the `value` prop changes:
   * https://hustle.bizongo.in/simulate-react-on-change-on-controlled-components-baa336920e04
   */
  React.useEffect(() => {
    const input = inputRef.current;

    if (!name || !input || input.value === value) return;

    const inputProto = window.HTMLInputElement.prototype;
    const setValue = Object.getOwnPropertyDescriptor(inputProto, 'value')!.set!;
    const event = new Event('input', { bubbles: true });

    setValue.call(input, value);
    input.dispatchEvent(event);
  }, [name, value]);

  return name ? <Comp hidden {...inputProps} name={name} defaultValue={value} ref={ref} /> : null;
});

FormValue.displayName = FORM_VALUE_NAME;

export type { FormValueProps };
export { FormValue };
