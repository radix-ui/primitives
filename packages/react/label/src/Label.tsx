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

const useLabelContext = (onClick?: (event: MouseEvent) => void) => {
  const context = React.useContext(LabelContext);
  const hasClickHandler = Boolean(onClick);
  const handleClick = useCallbackRef(onClick);

  React.useEffect(() => {
    const label = context?.ref.current;
    if (hasClickHandler && label) {
      label.addEventListener('click', handleClick);
      return () => label.removeEventListener('click', handleClick);
    }
  }, [hasClickHandler, handleClick, context]);

  return context?.id;
};

const Label = forwardRef<typeof LABEL_DEFAULT_TAG, LabelProps>(function Label(props, forwardedRef) {
  const {
    htmlFor,
    as: Comp = (htmlFor ? 'label' : LABEL_DEFAULT_TAG) as any,
    id: idProp,
    children,
    ...spanProps
  } = props;
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const ref = useComposedRefs(forwardedRef, spanRef);
  const generatedId = `label-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    // prevent text selection when double clicking span
    spanRef.current?.addEventListener('mousedown', (event) => {
      if (event.detail > 1) event.preventDefault();
    });
  }, [spanRef]);

  return (
    <Comp
      {...spanProps}
      {...interopDataAttrObj('root')}
      id={id}
      ref={ref}
      role="label"
      htmlFor={htmlFor}
    >
      <LabelContext.Provider value={React.useMemo(() => ({ id, ref: spanRef }), [id])}>
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
  },
});

export type { LabelProps };
export { Label, styles, useLabelContext };
