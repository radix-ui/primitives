import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { createStyleObj, forwardRef, useId, useComposedRefs } from '@interop-ui/react-utils';

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
      return addLabelClickEventListener(label, element);
    }
  }, [context, ref]);

  return context?.id;
};

const Label = forwardRef<typeof LABEL_DEFAULT_TAG, LabelProps>(function Label(props, forwardedRef) {
  const { htmlFor, as: Comp = LABEL_DEFAULT_TAG, id: idProp, children, ...labelProps } = props;
  const labelRef = React.useRef<HTMLSpanElement>(null);
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

  React.useEffect(() => {
    if (htmlFor) {
      const element = document.getElementById(htmlFor);
      const label = labelRef.current;

      if (label && element) {
        const removeLabelClickEventListener = addLabelClickEventListener(label, element);
        const getAriaLabel = () => element.getAttribute('aria-labelledby');
        const ariaLabelledBy = [getAriaLabel(), id].filter(Boolean).join(' ');
        element.setAttribute('aria-labelledby', ariaLabelledBy);

        return () => {
          removeLabelClickEventListener();
          /**
           * We get the latest attribute value because at the time that this cleanup fires,
           * the values from the closure may have changed.
           */
          const ariaLabelledBy = getAriaLabel()?.replace(id, '');
          if (ariaLabelledBy === '') {
            element.removeAttribute('aria-labelledby');
          } else if (ariaLabelledBy) {
            element.setAttribute('aria-labelledby', ariaLabelledBy);
          }
        };
      }
    }
  }, [id, htmlFor]);

  return (
    <Comp {...labelProps} {...interopDataAttrObj('root')} id={id} ref={ref} role="label">
      <LabelContext.Provider value={React.useMemo(() => ({ id, ref: labelRef }), [id])}>
        {children}
      </LabelContext.Provider>
    </Comp>
  );
});

function addLabelClickEventListener(label: HTMLSpanElement, element: HTMLElement) {
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
