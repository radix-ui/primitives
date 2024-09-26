import * as React from 'react';
import ReactDOM from 'react-dom';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Primitive } from '@radix-ui/react-primitive';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

type RegionType = 'polite' | 'assertive' | 'off';
type RegionRole = 'status' | 'alert' | 'log' | 'none';

const ROLES: { [key in RegionType]: RegionRole } = {
  polite: 'status',
  assertive: 'alert',
  off: 'none',
};

const listenerMap = new Map<Element, number>();

/* -------------------------------------------------------------------------------------------------
 * Announce
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Announce';

type AnnounceElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface AnnounceProps extends PrimitiveDivProps {
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
  'aria-relevant'?: PrimitiveDivProps['aria-relevant'];
  /**
   * React children of your component. Children can be mirrored directly or modified to optimize for
   * screen reader user experience.
   */
  children: React.ReactNode;
  /**
   * An optional unique identifier for the live region.
   *
   * By default, `Announce` components create, at most, two unique `aria-live` regions in the
   * document (one for all `polite` notifications, one for all `assertive` notifications). In some
   * cases you may wish to append additional `aria-live` regions for distinct purposes (for example,
   * simple status updates may need to be separated from a stack of toast-style notifications). By
   * passing an id, you indicate that any content rendered by components with the same identifier
   * should be mirrored in a separate `aria-live` region.
   */
  regionIdentifier?: string;
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
}

const Announce = React.forwardRef<AnnounceElement, AnnounceProps>((props, forwardedRef) => {
  const {
    'aria-relevant': ariaRelevant,
    children,
    type = 'polite',
    role = ROLES[type],
    regionIdentifier,
    ...regionProps
  } = props;

  const ariaAtomic = ['true', true].includes(regionProps['aria-atomic'] as any);

  // The region is appended to the root document node, which is usually the global `document` but in
  // some contexts may be another node. After the Announce element ref is attached, we set the
  // ownerDocumentRef to make sure we have the right root node. We should only need to do this once.
  const ownerDocumentRef = React.useRef(document);
  const setOwnerDocumentFromRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      ownerDocumentRef.current = node.ownerDocument;
    }
  }, []);
  const ownRef = React.useRef<HTMLDivElement | null>(null);
  const ref = useComposedRefs(forwardedRef, ownRef, setOwnerDocumentFromRef);

  const [region, setRegion] = React.useState<HTMLElement>();
  const relevant = ariaRelevant
    ? Array.isArray(ariaRelevant)
      ? ariaRelevant.join(' ')
      : ariaRelevant
    : undefined;

  const getLiveRegionElement = React.useCallback(() => {
    const ownerDocument = ownerDocumentRef.current;
    const regionConfig = { type, role, relevant, id: regionIdentifier, atomic: ariaAtomic };
    const regionSelector = buildSelector(regionConfig);
    const element = ownerDocument.querySelector(regionSelector);

    return element || buildLiveRegionElement(ownerDocument, regionConfig);
  }, [ariaAtomic, relevant, role, type, regionIdentifier]);

  useLayoutEffect(() => {
    setRegion(getLiveRegionElement() as HTMLElement);
  }, [getLiveRegionElement]);

  // In some screen reader/browser combinations, alerts coming from an inactive browser tab may be
  // announced, which is a confusing experience for a user interacting with a completely different
  // page. When the page visibility changes we'll update the `role` and `aria-live` attributes of
  // our region element to prevent that.
  // https://inclusive-components.design/notifications/#restrictingmessagestocontexts
  React.useEffect(() => {
    const ownerDocument = ownerDocumentRef.current;
    function updateAttributesOnVisibilityChange() {
      regionElement.setAttribute('role', ownerDocument.hidden ? 'none' : role);
      regionElement.setAttribute('aria-live', ownerDocument.hidden ? 'off' : type);
    }

    // Ok, so this might look a little weird and confusing, but here's what's going on:
    //   - We need to hide `aria-live` regions via a global event listener, as noted in the comment
    //     above.
    //   - We only need one listener per region. Keep in mind that each `Announce` does not
    //     necessarily generate a unique live region element.
    //   - We track whether or not a listener has already been attached for a given region in a map
    //     so we can skip these effects after `Announce` is used again with a shared live region.
    const regionElement = getLiveRegionElement();

    if (!listenerMap.get(regionElement)) {
      ownerDocument.addEventListener('visibilitychange', updateAttributesOnVisibilityChange);
      listenerMap.set(regionElement, 1);
    } else {
      const announceCount = listenerMap.get(regionElement)!;
      listenerMap.set(regionElement, announceCount + 1);
    }

    return function () {
      const announceCount = listenerMap.get(regionElement)!;
      listenerMap.set(regionElement, announceCount - 1);
      if (announceCount === 1) {
        ownerDocument.removeEventListener('visibilitychange', updateAttributesOnVisibilityChange);
      }
    };
  }, [getLiveRegionElement, role, type]);

  return (
    <React.Fragment>
      <Primitive.div {...regionProps} ref={ref}>
        {children}
      </Primitive.div>

      {/* portal into live region for screen reader announcements */}
      {region && ReactDOM.createPortal(<div>{children}</div>, region)}
    </React.Fragment>
  );
});

Announce.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

type LiveRegionOptions = {
  type: string;
  relevant?: string;
  role: string;
  atomic?: boolean;
  id?: string;
};

function buildLiveRegionElement(
  ownerDocument: Document,
  { type, relevant, role, atomic, id }: LiveRegionOptions
) {
  const element = ownerDocument.createElement('div');
  element.setAttribute(getLiveRegionPartDataAttr(id), '');
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

function buildSelector({ type, relevant, role, atomic, id }: LiveRegionOptions) {
  return `[${getLiveRegionPartDataAttr(id)}]${[
    ['aria-live', type],
    ['aria-atomic', atomic],
    ['aria-relevant', relevant],
    ['role', role],
  ]
    .filter(([, val]) => !!val)
    .map(([attr, val]) => `[${attr}=${val}]`)
    .join('')}`;
}

function getLiveRegionPartDataAttr(id?: string) {
  return 'data-radix-announce-region' + (id ? `-${id}` : '');
}

const Root = Announce;

export {
  Announce,
  //
  Root,
};
export type { AnnounceProps };
