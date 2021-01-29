import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { useId, useComposedRefs } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Label';
const DEFAULT_TAG = 'span';

type LabelOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>, { htmlFor?: string }>;
type LabelPrimitive = Polymorphic.ForwardRefComponent<typeof DEFAULT_TAG, LabelOwnProps>;

type LabelContextValue = { id: string; ref: React.RefObject<HTMLSpanElement> };
const LabelContext = React.createContext<LabelContextValue | undefined>(undefined);

const Label = React.forwardRef((props, forwardedRef) => {
  const {
    as = DEFAULT_TAG,
    selector = getSelector(NAME),
    htmlFor,
    id: idProp,
    ...labelProps
  } = props;
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
    <LabelContext.Provider value={React.useMemo(() => ({ id, ref: labelRef }), [id])}>
      <Primitive {...labelProps} as={as} selector={selector} ref={ref} id={id} role="label" />
    </LabelContext.Provider>
  );
}) as LabelPrimitive;

Label.displayName = 'Label';

/* -----------------------------------------------------------------------------------------------*/

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

const Root = Label;

export {
  Label,
  //
  Root,
  //
  useLabelContext,
};
