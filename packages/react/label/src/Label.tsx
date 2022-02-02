import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Primitive } from '@radix-ui/react-primitive';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Label';

type LabelContextValue = { id?: string; controlRef: React.MutableRefObject<HTMLElement | null> };
const [LabelProvider, useLabelContextImpl] = createContext<LabelContextValue>(NAME, {
  id: undefined,
  controlRef: { current: null },
});

type LabelElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface LabelProps extends PrimitiveSpanProps {
  htmlFor?: string;
}

const Label = React.forwardRef<LabelElement, LabelProps>((props, forwardedRef) => {
  const { htmlFor, id: idProp, ...labelProps } = props;
  const controlRef = React.useRef<HTMLElement | null>(null);
  const ref = React.useRef<HTMLSpanElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const id = useId(idProp);

  React.useEffect(() => {
    if (htmlFor) {
      const element = document.getElementById(htmlFor);
      const label = ref.current;
      if (label && element) {
        const getAriaLabel = () => element.getAttribute('aria-labelledby');
        const ariaLabelledBy = [id, getAriaLabel()].filter(Boolean).join(' ');
        element.setAttribute('aria-labelledby', ariaLabelledBy);
        controlRef.current = element;
        return () => {
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
    <LabelProvider id={id} controlRef={controlRef}>
      <Primitive.span
        role="label"
        id={id}
        {...labelProps}
        ref={composedRefs}
        onMouseDown={(event) => {
          props.onMouseDown?.(event);
          // prevent text selection when double clicking label
          if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }}
        onClick={(event) => {
          props.onClick?.(event);
          if (!controlRef.current || event.defaultPrevented) return;
          const isClickingControl = controlRef.current.contains(event.target as Node);
          // Ensure event was generated by a user action
          // https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted
          const isUserClick = event.isTrusted === true;
          /**
           * When a label is wrapped around the control it labels, we trigger the appropriate events
           * on the control when the label is clicked. We do nothing if the user is already clicking the
           * control inside the label.
           */
          if (!isClickingControl && isUserClick) {
            controlRef.current.click();
            controlRef.current.focus();
          }
        }}
      />
    </LabelProvider>
  );
});

Label.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const useLabelContext = (element?: HTMLElement | null) => {
  const context = useLabelContextImpl('LabelConsumer');
  const { controlRef } = context;

  React.useEffect(() => {
    if (element) controlRef.current = element;
  }, [element, controlRef]);

  return context.id;
};

const Root = Label;

export {
  Label,
  //
  Root,
  //
  useLabelContext,
};
export type { LabelProps };
