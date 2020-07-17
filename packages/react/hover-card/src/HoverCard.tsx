import * as React from 'react';

type HoverCardDOMProps = React.ComponentProps<'div'>;
type HoverCardOwnProps = {};
type HoverCardProps = HoverCardDOMProps & HoverCardOwnProps;

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

HoverCard.displayName = 'HoverCard';

export { HoverCard };
export type { HoverCardProps };
