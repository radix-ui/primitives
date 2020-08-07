import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

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
  role: roleProp,
  type,
}: {
  ariaAtomic?: boolean;
  // Generally use of aria-relevant is discouraged, but we want to provide support for it in
  // specific cases. We should provide guidance for this via documentation.
  ariaRelevant?: string | AriaRelevantOptions[];
  role?: RegionRole;
  type: RegionType;
}) => {
  const [region, setRegion] = React.useState<HTMLElement>();

  // Supports an explicit role prop. If none is set, fallback to role based on the region type.
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

const REGION_NAME = 'LiveRegion';
const REGION_DEFAULT_TAG = 'div';

type LiveRegionDOMProps = React.ComponentPropsWithoutRef<typeof REGION_DEFAULT_TAG>;
type LiveRegionOwnProps = { type?: RegionType; role?: RegionRole };
type LiveRegionProps = LiveRegionDOMProps & LiveRegionOwnProps;

const LiveRegion = forwardRef<typeof REGION_DEFAULT_TAG, LiveRegionProps>(function LiveRegion(
  props,
  forwardedRef
) {
  const { type = 'polite', 'aria-relevant': ariaRelevant, role, children, ...regionProps } = props;

  const ariaAtomic = ['true', true].includes(regionProps['aria-atomic'] as any);
  const region = useLiveRegion({ type, ariaAtomic, role, ariaRelevant });

  return (
    <>
      <div {...regionProps} {...interopDataAttrObj(REGION_NAME)} ref={forwardedRef}>
        {children}
      </div>

      {/* portal into live region for screen reader announcements */}
      {region &&
        ReactDOM.createPortal(
          <div {...interopDataAttrObj(`LiveRegion.Mirror`)}>{children}</div>,
          region
        )}
    </>
  );
});

LiveRegion.displayName = REGION_NAME;

const styles: PrimitiveStyles = {
  [interopSelector(REGION_NAME)]: {
    ...cssReset(REGION_DEFAULT_TAG),
  },
};

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
