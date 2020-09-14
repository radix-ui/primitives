import * as React from 'react';
import ReactDOM from 'react-dom';
import { cssReset, interopDataAttr } from '@interop-ui/utils';
import {
  forwardRef,
  createStyleObj,
  useIsomorphicLayoutEffect as useLayoutEffect,
} from '@interop-ui/react-utils';

type RegionType = 'polite' | 'assertive' | 'off';
type RegionRole = 'status' | 'alert' | 'log' | 'none';
type AriaRelevantOptions = 'additions' | 'removals' | 'text';

const ROLES: { [key in RegionType]: RegionRole } = {
  polite: 'status',
  assertive: 'alert',
  off: 'none',
};

function useAnnouncer({
  'aria-atomic': ariaAtomic,
  'aria-relevant': ariaRelevant,
  type = 'polite',
  role = ROLES[type],
  ownerDocument = document,
  children,
  id,
}: AnnouncerHookProps) {
  const [region, setRegion] = React.useState<HTMLElement>();
  const relevant = ariaRelevant
    ? Array.isArray(ariaRelevant)
      ? ariaRelevant.join(' ')
      : ariaRelevant
    : undefined;

  const getLiveRegionElement = React.useCallback(() => {
    let element = ownerDocument.querySelector(buildSelector({ type, role, relevant, id }));
    if (!element) {
      element = buildLiveRegionElement(ownerDocument, {
        type,
        relevant,
        role,
        atomic: ariaAtomic || false,
        id,
      });
    }
    return element;
  }, [ariaAtomic, ownerDocument, relevant, role, type, id]);

  useLayoutEffect(() => {
    setRegion(getLiveRegionElement() as HTMLElement);
  }, [getLiveRegionElement]);

  // In some screen reader/browser combinations, alerts coming from an inactive browser tab may be
  // announced, which is a confusing experience for a user interacting with a completely different
  // page. When the page visibility changes we'll update the `role` and `aria-live` attributes of
  // our region element to prevent that.
  // https://inclusive-components.design/notifications/#restrictingmessagestocontexts
  React.useEffect(() => {
    const liveRegionElement = getLiveRegionElement();

    // I'm pretty sure this is fine. We don't need this listener for more than once per live region
    // type. YOLO...
    const yoloGlobalVar = `__INTEROP_LIVE_REGION_LISTENER_ATTACHED_${
      type.toUpperCase() + id ? `_${id}` : ''
    }`;
    if (!(window as any)[yoloGlobalVar]) {
      ownerDocument.addEventListener('visibilitychange', updateAttributesOnVisibilityChange);
      Object.assign(window, { [yoloGlobalVar]: true });
      return function () {
        Object.assign(window, { [yoloGlobalVar]: false });
        ownerDocument.removeEventListener('visibilitychange', updateAttributesOnVisibilityChange);
      };
    }

    return;

    function updateAttributesOnVisibilityChange() {
      liveRegionElement.setAttribute('role', ownerDocument.hidden ? 'none' : role);
      liveRegionElement.setAttribute('aria-live', ownerDocument.hidden ? 'off' : type);
    }
  }, [getLiveRegionElement, ownerDocument, role, type, id]);

  if (region) {
    // Portal into live region for screen reader announcements
    ReactDOM.createPortal(<div>{children}</div>, region);
  }

  return region;
}

/* -------------------------------------------------------------------------------------------------
 * Announcer
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Announcer';
const DEFAULT_TAG = 'div';

type AnnouncerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AnnouncerOwnProps = Omit<AnnouncerHookProps, 'ownerDocument'> & {
  regionIdentifier?: string;
};
type AnnouncerProps = AnnouncerDOMProps & AnnouncerOwnProps;

const Announcer = forwardRef<typeof DEFAULT_TAG, AnnouncerProps>(function Announcer(
  props,
  forwardedRef
) {
  const {
    as: Comp = DEFAULT_TAG,
    type = 'polite',
    'aria-relevant': ariaRelevant,
    role,
    children,
    regionIdentifier,
    ...regionProps
  } = props;

  const ariaAtomic = ['true', true].includes(regionProps['aria-atomic'] as any);
  useAnnouncer({
    'aria-atomic': ariaAtomic,
    'aria-relevant': ariaRelevant,
    children,
    id: regionIdentifier,
    role,
    type,
  });

  return (
    <Comp {...regionProps} {...interopDataAttrObj('root')} ref={forwardedRef}>
      {children}
    </Comp>
  );
});

Announcer.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
  },
});

export { Announcer, styles, useAnnouncer };
export type { AnnouncerProps, AnnouncerHookProps };

type AnnouncerOptions = {
  type: string;
  relevant?: string;
  role: string;
  atomic?: boolean;
  id?: string;
};

type AnnouncerHookProps = {
  /**
   * Mirrors the `aria-atomic` DOM attribute for live regions. It is an optional attribute that
   * indicates whether assistive technologies will present all, or only parts of, the changed region
   * based on the change notifications defined by the `aria-relevant` attribute.
   *
   * @see WAI-ARIA https://www.w3.org/TR/wai-aria-1.2/#aria-atomic
   * @see Demo     http://pauljadam.com/demos/aria-atomic-relevant.html
   */
  'aria-atomic'?: boolean;
  /**
   * Mirrors the `aria-relevant` DOM attribute for live regions. It is an optional attribute used to
   * describe what types of changes have occurred to the region, and which changes are relevant and
   * should be announced. Any change that is not relevant acts in the same manner it would if the
   * `aria-live` attribute were set to off.
   *
   * Unfortunately, `aria-relevant` doesn't behave as expected across all device/screen reader
   * combinations. It's important to test its implementation before relying on it to work for your
   * users. The attribute is omitted by default.
   *
   * @see WAI-ARIA https://www.w3.org/TR/wai-aria-1.2/#aria-relevant
   * @see MDN      https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-relevant_attribute
   * @see Opinion  https://medium.com/dev-channel/why-authors-should-avoid-aria-relevant-5d3164fab1e3
   * @see Demo     http://pauljadam.com/demos/aria-atomic-relevant.html
   */
  'aria-relevant'?: string | AriaRelevantOptions[];
  /**
   * React children of your component. Children can be mirrored directly or modified to optimize for
   * screen reader user experience.
   */
  children: React.ReactNode;
  /**
   * An optional unique identifier for the live region.
   *
   * By default, `Announcer` components and the `useAnnouncer` hook create, at most, two unique
   * `aria-live` regions in the document (one for all `polite` notifications, one for all
   * `assertive` notifications). In some cases you may wish to append additional `aria-live` regions
   * for distinct purposes (for example, simple status updates may need to be separated from a stack
   * of toast-style notifications). By passing an id, you indicate that any content rendered by
   * components with the same identifier should be mirrored in a separate `aria-live` region.
   */
  id?: string;
  /**
   * Optional prop to declare the Document to which the live region is appended. Useful for contexts
   * outside of the browser window. Defaults to the global `document`.
   */
  ownerDocument?: Document;
  /**
   * Mirrors the `role` DOM attribute. This is optional and may be useful as an override in some
   * cases. By default, the role is determined by the `type` prop.
   *
   * @see MDN https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_specialized_live_region_roles
   */
  role?: RegionRole;
  /**
   * Mirrors the `aria-live` DOM attribute. The `aria-live=POLITENESS_SETTING` is used to set the
   * priority with which screen reader should treat updates to live regions. Its possible settings
   * are: off, polite or assertive. Defaults to `polite`.
   *
   * @see MDN https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
   */
  type?: RegionType;
};

function buildLiveRegionElement(
  ownerDocument: Document,
  { type, relevant, role, atomic, id }: AnnouncerOptions
) {
  const element = ownerDocument.createElement('div');
  element.setAttribute(getInteropAttr(id), '');
  element.setAttribute(
    'style',
    'position: absolute; top: -1px; width: 1px; height: 1px; overflow: hidden;'
  );
  ownerDocument.body.appendChild(element);

  element.setAttribute('aria-live', type);
  element.setAttribute('aria-atomic', String(atomic || false));
  element.setAttribute('role', role);
  if (relevant) {
    element.setAttribute('aria-relevant', relevant);
  }

  return element;
}

function buildSelector({ type, relevant, role, id }: AnnouncerOptions) {
  return `[${getInteropAttr(id)}]${[
    ['aria-live', type],
    ['aria-relevant', relevant],
    ['role', role],
  ]
    .filter(([, val]) => !!val)
    .map(([attr, val]) => `[${attr}=${val}]`)
    .join('')}`;
}

function getInteropAttr(id?: string) {
  return interopDataAttr('AnnouncerRegion' + (id ? `-${id}` : ''));
}
