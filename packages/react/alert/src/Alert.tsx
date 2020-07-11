import * as React from 'react';
import { forwardRef } from '@interop-ui/react-utils';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { Portal } from '@interop-ui/react-portal';

// TODO: This needs testing

let elements: ElementTypes = {
  polite: {},
  assertive: {},
};

/* -------------------------------------------------------------------------------------------------
 * App root contexts and AlertProvider
 * -----------------------------------------------------------------------------------------------*/

interface AlertActionsContextValue {
  addAlert(
    alertType: 'assertive' | 'polite',
    key: string | number,
    element: React.ReactElement
  ): any;
  removeAlert(alertType: 'assertive' | 'polite', key: string | number): any;
}

interface AlertStateContextValue {
  alerts: ElementTypes;
  keysRef: React.MutableRefObject<RegionKeys>;
}

const AlertActionsContext = React.createContext<AlertActionsContextValue>(null as any);
const AlertStateContext = React.createContext<AlertStateContextValue>(null as any);

function useAlertState() {
  let alertState = React.useContext(AlertStateContext);
  let alertActions = React.useContext(AlertActionsContext);
  if (alertState == null || alertActions == null) {
    throw Error('Must call useAlertState inside of an alert provider');
  }
  return [React.useContext(AlertStateContext), React.useContext(AlertActionsContext)] as const;
}

const AlertProvider: React.FC<{ rootDocument?: Document }> = ({ children }) => {
  let [alertsByRegion, setAlertsByRegion] = React.useState(elements);
  let actionsCtx: AlertActionsContextValue = React.useMemo(() => {
    return {
      addAlert(alertType, key, element) {
        setAlertsByRegion((alerts) => {
          return {
            ...alerts,
            [alertType]: {
              ...alerts[alertType],
              [key]: element,
            },
          };
        });
      },
      removeAlert(alertType, key) {
        setAlertsByRegion((alerts) => {
          let copy = alerts;
          delete copy[alertType][key];
          return copy;
        });
      },
    };
  }, []);

  let keysRef = React.useRef<RegionKeys>({
    polite: -1,
    assertive: -1,
  });
  let stateCtx: AlertStateContextValue = { alerts: alertsByRegion, keysRef };

  return (
    <AlertActionsContext.Provider value={actionsCtx}>
      <AlertStateContext.Provider value={stateCtx}>
        {children}
        {Object.keys(alertsByRegion).map((r) => {
          let regionType = r as RegionTypes;
          let elementKeys = Object.keys(alertsByRegion[regionType]);
          if (elementKeys.length > 0) {
            return (
              <Portal key={`${regionType}`}>
                <VisuallyHidden>
                  <div
                    // The status role is a type of live region and a container whose
                    // content is advisory information for the user that is not
                    // important enough to justify an alert, and is often presented as
                    // a status bar. When the role is added to an element, the browser
                    // will send out an accessible status event to assistive
                    // technology products which can then notify the user about it.
                    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_status_role
                    role={regionType === 'assertive' ? 'alert' : 'status'}
                    aria-live={regionType}
                  >
                    {elementKeys.map((key) => {
                      return React.cloneElement(alertsByRegion[regionType][key], {
                        ref: null,
                        key,
                      });
                    })}
                  </div>
                </VisuallyHidden>
              </Portal>
            );
          }
          return null;
        })}
      </AlertStateContext.Provider>
    </AlertActionsContext.Provider>
  );
};

AlertProvider.displayName = 'AlertProvider';

/* -------------------------------------------------------------------------------------------------
 * Alert
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'div';

type AlertDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AlertOwnProps = {
  type?: 'assertive' | 'polite';
  children: React.ReactNode;
};
type AlertProps = AlertDOMProps & AlertOwnProps;

const Alert = forwardRef<typeof DEFAULT_TAG, AlertProps>(function Alert(
  { children, type: regionType = 'polite', ...props },
  forwardedRef
) {
  let [alertState, alertActions] = useAlertState();
  let childrenRef = React.useRef(children);

  React.useEffect(() => {
    let key = alertState.keysRef.current[regionType] + 1;
    alertState.keysRef.current = {
      ...alertState.keysRef.current,
      [regionType]: key,
    };
    alertActions.addAlert(regionType, key, <div>{childrenRef.current}</div>);
    return () => {
      alertActions.removeAlert(regionType, key);
    };
  }, [regionType, alertActions, alertState.keysRef]);

  return (
    <React.Fragment>
      <div {...props} ref={forwardedRef}>
        {children}
      </div>
    </React.Fragment>
  );
});

Alert.displayName = 'Alert';

export { Alert, AlertProvider, useAlertState };
export type { AlertProps };

type RegionTypes = 'polite' | 'assertive';

type ElementTypes = {
  [key in RegionTypes]: {
    [key: string]: React.ReactElement;
  };
};

type RegionKeys = {
  [key in RegionTypes]: number;
};
