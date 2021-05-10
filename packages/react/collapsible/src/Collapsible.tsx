import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';

type CollapsibleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open?: boolean): void;
  }
>;

type CollapsiblePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  CollapsibleOwnProps
>;

type CollapsibleContextValue = {
  contentId: string;
  disabled?: boolean;
  open: boolean;
  onOpenToggle(): void;
};

const [CollapsibleProvider, useCollapsibleContext] = createContext<CollapsibleContextValue>(
  COLLAPSIBLE_NAME
);

const Collapsible = React.forwardRef((props, forwardedRef) => {
  const { open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props;

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <CollapsibleProvider
      disabled={disabled}
      contentId={useId()}
      open={open}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      <Primitive
        data-state={getState(open)}
        data-disabled={disabled ? '' : undefined}
        {...collapsibleProps}
        ref={forwardedRef}
      />
    </CollapsibleProvider>
  );
}) as CollapsiblePrimitive;

Collapsible.displayName = COLLAPSIBLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'CollapsibleButton';
const BUTTON_DEFAULT_TAG = 'button';

type CollapsibleButtonOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type CollapsibleButtonPrimitive = Polymorphic.ForwardRefComponent<
  typeof BUTTON_DEFAULT_TAG,
  CollapsibleButtonOwnProps
>;

const CollapsibleButton = React.forwardRef((props, forwardedRef) => {
  const { as = BUTTON_DEFAULT_TAG, onClick, ...buttonProps } = props;
  const context = useCollapsibleContext(BUTTON_NAME);

  return (
    <Primitive
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      data-disabled={context.disabled ? '' : undefined}
      disabled={context.disabled}
      {...buttonProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, context.onOpenToggle)}
    />
  );
}) as CollapsibleButtonPrimitive;

CollapsibleButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'CollapsibleContent';

type CollapsibleContentOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof CollapsibleContentImpl>, 'present'>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type CollapsibleContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof CollapsibleContentImpl>,
  CollapsibleContentOwnProps
>;

const CollapsibleContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME);
  return (
    <Presence present={forceMount || context.open}>
      {({ present }) => (
        <CollapsibleContentImpl {...contentProps} ref={forwardedRef} present={present} />
      )}
    </Presence>
  );
}) as CollapsibleContentPrimitive;

CollapsibleContent.displayName = CONTENT_NAME;

type CollapsibleContentImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { present: boolean }
>;

type CollapsibleContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  CollapsibleContentImplOwnProps
>;

const CollapsibleContentImpl = React.forwardRef((props, forwardedRef) => {
  const { present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME);
  const [isPresent, setIsPresent] = React.useState(present);
  const ref = React.useRef<React.ElementRef<typeof Primitive>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = React.useRef<number | undefined>(0);
  const height = heightRef.current;
  // when opening we want it to immediately open to retrieve dimensions
  // when closing we delay `present` to retreive dimensions before closing
  const isOpen = context.open || isPresent;

  useLayoutEffect(() => {
    const node = ref.current;
    if (node) {
      const originalTransition = node.style.transition;
      const originalAnimation = node.style.animation;
      // block any animations/transitions so the element renders at its full dimensions
      node.style.transition = 'none';
      node.style.animation = 'none';

      // set height to height from full dimensions
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;

      // kick off any animations/transitions that were originally set up
      node.style.transition = originalTransition;
      node.style.animation = originalAnimation;
      setIsPresent(present);
    }
    /**
     * depends on `context.open` because it will change to `false`
     * when a close is triggered but `present` will be `false` on
     * animation end (so when close finishes). This allows us to
     * retrieve the dimensions *before* closing.
     */
  }, [context.open, present]);

  return (
    <Primitive
      data-state={getState(context.open)}
      data-disabled={context.disabled ? '' : undefined}
      id={context.contentId}
      hidden={!isOpen}
      {...contentProps}
      ref={composedRefs}
      style={{
        [`--radix-collapsible-content-height` as any]: height ? `${height}px` : undefined,
        ...props.style,
      }}
    >
      {isOpen && children}
    </Primitive>
  );
}) as CollapsibleContentImplPrimitive;

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? 'open' : 'closed';
}

const Root = Collapsible;
const Button = CollapsibleButton;
const Content = CollapsibleContent;

export {
  Collapsible,
  CollapsibleButton,
  CollapsibleContent,
  //
  Root,
  Button,
  Content,
};
