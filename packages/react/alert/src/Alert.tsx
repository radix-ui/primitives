import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

type RegionType = 'polite' | 'assertive';
type RegionRole = 'status' | 'alert' | 'log';
type AriaRelevantOptions = 'additions' | 'removals' | 'text';
type AriaRelevantCombinedOptions =
  | 'additions removals'
  | 'additions text'
  | 'removals additions'
  | 'removals text'
  | 'text additions'
  | 'text removals';

const ROLES: { [key in RegionType]: RegionRole } = {
  polite: 'status',
  assertive: 'alert',
};

const interopAttr = interopDataAttr('AlertRegion');

const useLiveRegion = ({
  type,
  isAtomic,
  role: roleProp,
  'aria-relevant': ariaRelevant,
}: {
  type: RegionType;
  isAtomic?: boolean;
  role?: RegionRole;
  // Generally use of aria-relevant is discouraged, but we want to provide support for it in
  // specific cases. We should provide guidance for this via documentation.
  'aria-relevant'?:
    | AriaRelevantOptions
    | AriaRelevantCombinedOptions
    | AriaRelevantOptions[]
    | 'all';
}) => {
  const [region, setRegion] = React.useState<HTMLElement>();

  // Supports an explicit role prop. If none is set, fallback to role based on the alert type.
  const role = roleProp || ROLES[type];

  const relevant = ariaRelevant
    ? Array.isArray(ariaRelevant)
      ? ariaRelevant.join(' ')
      : ariaRelevant
    : undefined;

  React.useLayoutEffect(() => {
    let element = document.querySelector(buildSelector({ type, role, relevant }));

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
    element.setAttribute('aria-atomic', String(isAtomic || false));
    element.setAttribute('role', role);
    if (relevant) {
      element.setAttribute('aria-relevant', relevant);
    }

    const regionElement = element as HTMLElement;
    setRegion(regionElement);
  }, [relevant, type, role, isAtomic]);

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

const styles: PrimitiveStyles = {
  alert: {
    ...cssReset(ALERT_DEFAULT_TAG),
  },
};

export { Alert, styles, useLiveRegion };
export type { AlertProps };

function buildSelector({
  type,
  relevant,
  role,
}: {
  type: string;
  relevant?: string;
  role: string;
}) {
  return `[${interopAttr}]${[
    ['aria-live', type],
    ['aria-relevant', relevant],
    ['role', role],
  ]
    .filter(([, val]) => !!val)
    .map(([attr, val]) => `[${attr}=${val}]`)
    .join('')}`;
}
