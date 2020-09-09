import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr } from '@interop-ui/utils';
import {
  forwardRef,
  createStyleObj,
  useIsomorphicLayoutEffect as useLayoutEffect,
} from '@interop-ui/react-utils';

type RegionType = 'polite' | 'assertive';
type RegionRole = 'status' | 'alert' | 'log';
type AriaRelevantOptions = 'additions' | 'removals' | 'text';

const ROLES: { [key in RegionType]: RegionRole } = {
  polite: 'status',
  assertive: 'alert',
};

const interopAttr = interopDataAttr('LiveRegionRegion');

const useLiveRegion = ({
  ariaAtomic,
  ariaRelevant,
  type = 'polite',
  role = ROLES[type],
}: {
  ariaAtomic?: boolean;
  // Generally use of aria-relevant is discouraged, but we want to provide support for it in
  // specific cases. We should provide guidance for this via documentation.
  ariaRelevant?: string | AriaRelevantOptions[];
  role?: RegionRole;
  type?: RegionType;
}) => {
  const [region, setRegion] = React.useState<HTMLElement>();
  const relevant = ariaRelevant
    ? Array.isArray(ariaRelevant)
      ? ariaRelevant.join(' ')
      : ariaRelevant
    : undefined;

  useLayoutEffect(() => {
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
    element.setAttribute('aria-atomic', String(ariaAtomic || false));
    element.setAttribute('role', role);
    if (relevant) {
      element.setAttribute('aria-relevant', relevant);
    }

    const regionElement = element as HTMLElement;
    setRegion(regionElement);
  }, [relevant, type, role, ariaAtomic]);

  return region;
};

/* -------------------------------------------------------------------------------------------------
 * LiveRegion
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'LiveRegion';
const DEFAULT_TAG = 'div';

type LiveRegionDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type LiveRegionOwnProps = { type?: RegionType; role?: RegionRole };
type LiveRegionProps = LiveRegionDOMProps & LiveRegionOwnProps;

const LiveRegion = forwardRef<typeof DEFAULT_TAG, LiveRegionProps>(function LiveRegion(
  props,
  forwardedRef
) {
  const {
    as: Comp = DEFAULT_TAG,
    type = 'polite',
    'aria-relevant': ariaRelevant,
    role,
    children,
    ...regionProps
  } = props;

  const ariaAtomic = ['true', true].includes(regionProps['aria-atomic'] as any);
  const region = useLiveRegion({ type, ariaAtomic, role, ariaRelevant });
  const [space, setSpace] = React.useState(false);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    // Skip on first render
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setSpace((s) => !s);
  }, [children]);

  // const childrenArray = React.Children.toArray(children);
  // const lastChild = childrenArray.length > 0 ? childrenArray[childrenArray.length - 1] : null;

  return (
    <>
      <Comp {...regionProps} {...interopDataAttrObj('root')} ref={forwardedRef}>
        {children}
      </Comp>

      {/* portal into live region for screen reader announcements */}
      {region &&
        ReactDOM.createPortal(
          <div>
            {children}
            {space && ' '}
          </div>,
          region
        )}
    </>
  );
});

LiveRegion.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
  },
});

export { LiveRegion, styles, useLiveRegion };
export type { LiveRegionProps };

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
