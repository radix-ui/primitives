import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

const ROLES: { [key in RegionType]: string } = {
  polite: 'status',
  assertive: 'alert',
};

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type AlertContextValue = {};
const [AlertContext] = createContext<AlertContextValue>('AlertContext', 'Alert');

/* -------------------------------------------------------------------------------------------------
 * Alert
 * -----------------------------------------------------------------------------------------------*/

const ALERT_DEFAULT_TAG = 'div';

type AlertDOMProps = React.ComponentPropsWithoutRef<typeof ALERT_DEFAULT_TAG>;
type AlertOwnProps = { type?: RegionType; isAtomic?: boolean };
type AlertProps = AlertDOMProps & AlertOwnProps;

const Alert = forwardRef<typeof ALERT_DEFAULT_TAG, AlertProps>(function Alert(props, forwardedRef) {
  const { type = 'polite', isAtomic = false, children, ...alertProps } = props;
  const region = useLiveRegion({ type, isAtomic });

  return (
    <AlertContext.Provider value={React.useMemo(() => ({}), [])}>
      <div {...alertProps} {...interopDataAttrObj('Alert')} ref={forwardedRef}>
        {children}
      </div>

      {/* portal into live region for screen reader announcements */}
      {region &&
        ReactDOM.createPortal(<div {...interopDataAttrObj('AlertMirror')}>{children}</div>, region)}
    </AlertContext.Provider>
  );
});

Alert.displayName = 'Alert';

/* ---------------------------------------------------------------------------------------------- */

const useHasAlertContext = () => useHasContext(AlertContext);

const styles: PrimitiveStyles = {
  alert: {
    ...cssReset(ALERT_DEFAULT_TAG),
  },
};

export { Alert, styles, useHasAlertContext };
export type { AlertProps };

type RegionType = 'polite' | 'assertive';

function useLiveRegion({ type, isAtomic }: { type: RegionType; isAtomic: boolean }) {
  const [region, setRegion] = React.useState<HTMLElement>();

  React.useLayoutEffect(() => {
    const interopAttr = interopDataAttr('AlertRegion');
    let element = document.querySelector(`[${interopAttr}][aria-live=${type}]`);

    if (!element) {
      element = document.createElement('div');
      element.setAttribute(interopAttr, '');
      element.setAttribute(
        'style',
        'position: absolute; top: -1px; width: 1px; height: 1px; overflow: hidden;'
      );
      document.body.appendChild(element);
    }

    element.setAttribute('aria-live', type);
    element.setAttribute('aria-atomic', String(isAtomic));
    element.setAttribute('role', ROLES[type]);

    const regionElement = element as HTMLElement;
    setRegion(regionElement);
  }, [type, isAtomic]);

  return region;
}
