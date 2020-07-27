import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

type RegionType = 'polite' | 'assertive';

const ROLES: { [key in RegionType]: string } = {
  polite: 'status',
  assertive: 'alert',
};

const useLiveRegion = ({ type, isAtomic }: { type: RegionType; isAtomic: boolean }) => {
  const [region, setRegion] = React.useState<HTMLElement>();

  React.useLayoutEffect(() => {
    const interopAttr = interopDataAttr('AlertRegion');
    let element = document.querySelector(`[${interopAttr}][aria-live=${type}]`);

    if (!element) {
      element = document.createElement('div');
      element.setAttribute(interopAttr, '');
      element.setAttribute('aria-live', type);
      element.setAttribute('aria-atomic', String(isAtomic));
      element.setAttribute('role', ROLES[type]);

      element.setAttribute(
        'style',
        'position: absolute; top: -1px; width: 1px; height: 1px; overflow: hidden;'
      );

      document.body.appendChild(element);
    }

    const regionElement = element as HTMLElement;
    setRegion(regionElement);
  }, [type, isAtomic]);

  return region;
};

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
    <>
      <div {...alertProps} {...interopDataAttrObj('Alert')} ref={forwardedRef}>
        {children}
      </div>

      {/* portal into live region for screen reader announcements */}
      {region &&
        ReactDOM.createPortal(<div {...interopDataAttrObj('AlertMirror')}>{children}</div>, region)}
    </>
  );
});

Alert.displayName = 'Alert';

const styles = {
  alert: {
    ...cssReset(ALERT_DEFAULT_TAG),
  },
};

export { Alert, styles };
export type { AlertProps };
