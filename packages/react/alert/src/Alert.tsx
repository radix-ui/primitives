import * as React from 'react';
import ReactDOM from 'react-dom';
import { forwardRef } from '@interop-ui/react-utils';

type RegionType = 'polite' | 'assertive';

const ROLES: { [key in RegionType]: string } = {
  polite: 'status',
  assertive: 'alert',
};

const useLiveRegion = (type: RegionType) => {
  const [region, setRegion] = React.useState<HTMLElement>();

  React.useLayoutEffect(() => {
    let element = document.querySelector(`[aria-live=${type}]`);

    if (!element) {
      element = document.createElement('div');
      element.setAttribute('aria-live', type);
      element.setAttribute('aria-atomic', 'false');
      element.setAttribute('role', ROLES[type]);
      element.setAttribute(
        'style',
        'position: absolute; top: -1px; width: 1px; height: 1px; overflow: hidden;'
      );

      document.body.appendChild(element);
    }

    const regionElement = element as HTMLElement;
    setRegion(regionElement);

    return () => {
      if (regionElement.childElementCount <= 1) {
        document.body.removeChild(regionElement);
      }
    };
  }, [type]);

  return region;
};

/* -------------------------------------------------------------------------------------------------
 * Alert
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'div';

type AlertDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AlertOwnProps = { type?: RegionType };
type AlertProps = AlertDOMProps & AlertOwnProps;

const Alert = forwardRef<typeof DEFAULT_TAG, AlertProps>(function Alert(props, forwardedRef) {
  const { type = 'polite', children, ...alertProps } = props;
  const region = useLiveRegion(type);

  return (
    <>
      <div {...alertProps} ref={forwardedRef}>
        {children}
      </div>

      {/* portal into live region for screen reader announcements */}
      {region &&
        ReactDOM.createPortal(
          <div>
            {/* remove elements from tab order */}
            {React.Children.map(children, (child) => {
              return React.isValidElement(child)
                ? React.cloneElement(child, { tabIndex: -1 })
                : child;
            })}
          </div>,
          region
        )}
    </>
  );
});

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };
