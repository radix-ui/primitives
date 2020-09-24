import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { createStyleObj, forwardRef, useId, useComposedRefs } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'Label';
const LABEL_DEFAULT_TAG = 'label';

type LabelDOMProps = React.ComponentPropsWithoutRef<typeof LABEL_DEFAULT_TAG>;
type LabelOwnProps = {};
type LabelProps = LabelOwnProps & LabelDOMProps;

const LabelContext = React.createContext<string | undefined>(undefined);
const useLabelContext = () => React.useContext(LabelContext);

const Label = forwardRef<typeof LABEL_DEFAULT_TAG, LabelProps>(function Label(props, forwardedRef) {
  const { as: Comp = LABEL_DEFAULT_TAG, id: idProp, children, ...labelProps } = props;
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const ref = useComposedRefs(forwardedRef, labelRef);
  const generatedId = `label-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    // prevent text selection when double clicking label
    labelRef.current?.addEventListener('mousedown', (event) => {
      if (event.detail > 1) event.preventDefault();
    });
  }, [labelRef]);

  return (
    <Comp {...labelProps} {...interopDataAttrObj('root')} id={id} ref={ref}>
      <LabelContext.Provider value={id}>{children}</LabelContext.Provider>
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
