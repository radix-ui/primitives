import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  createStyleObj,
  forwardRef,
  useId,
  useComposedRefs,
  useCallbackRef,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'Label';
const LABEL_DEFAULT_TAG = 'span';

type LabelDOMProps = React.ComponentPropsWithoutRef<typeof LABEL_DEFAULT_TAG>;
type LabelOwnProps = { htmlFor?: string };
type LabelProps = LabelOwnProps & LabelDOMProps;

type LabelContextValue = { id: string; ref: React.RefObject<HTMLSpanElement> };
const LabelContext = React.createContext<LabelContextValue | undefined>(undefined);

const useLabelContext = <E extends HTMLElement>(ref?: React.RefObject<E>) => {
  const context = React.useContext(LabelContext);

  React.useEffect(() => {
    const label = context?.ref.current;
    const element = ref?.current;

    if (label && element) {
      const handleClick = (event: MouseEvent) => {
        /**
         * When a label is wrapped around the element it labels, we make sure we manually trigger
         * the element events only when clicking the label and not when clicking the element
         * inside it.
         */
        if (!element.contains(event.target as Node)) {
          element.click();
          element.focus();
        }
      };

      label.addEventListener('click', handleClick);
      return () => label.removeEventListener('click', handleClick);
    }
  }, [context, ref]);

  return context?.id;
};

const Label = forwardRef<typeof LABEL_DEFAULT_TAG, LabelProps>(function Label(props, forwardedRef) {
  const {
    htmlFor,
    as: Comp = htmlFor ? 'label' : LABEL_DEFAULT_TAG,
    id: idProp,
    children,
    ...labelProps
  } = props;
  // Using `any` because it could be a span or a label and
  // we don't need to rely on a particular type internally
  const labelRef = React.useRef<any>(null);
  const ref = useComposedRefs(forwardedRef, labelRef);
  const generatedId = `label-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    const label = labelRef.current;

    if (label) {
      const handleMouseDown = (event: MouseEvent) => {
        if (event.detail > 1) event.preventDefault();
      };

      // prevent text selection when double clicking label
      label.addEventListener('mousedown', handleMouseDown);
      return () => label.removeEventListener('mousedown', handleMouseDown);
    }
  }, [labelRef]);

  return (
    <Comp
      {...labelProps}
      {...interopDataAttrObj('root')}
      id={id}
      ref={ref}
      role="label"
      htmlFor={htmlFor}
    >
      <LabelContext.Provider value={React.useMemo(() => ({ id, ref: labelRef }), [id])}>
        {children}
      </LabelContext.Provider>
    </Comp>
  );
});

/* ---------------------------------------------------------------------------------------------- */

Label.displayName = LABEL_NAME;

const [styles, interopDataAttrObj] = createStyleObj(LABEL_NAME, {
  root: {
    ...cssReset(LABEL_DEFAULT_TAG),
    // allow vertical margins
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'default',
  },
});

export type { LabelProps };
export { Label, styles, useLabelContext };
