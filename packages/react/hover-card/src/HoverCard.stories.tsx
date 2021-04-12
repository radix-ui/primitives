import * as React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from './HoverCard';
import { Slot } from '@radix-ui/react-slot';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import { css } from '../../../../stitches.config';

export default { title: 'Components/HoverCard' };

export const HoverInteractionTest = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150vh' }}
    >
      <HoverCard>
        <HoverCardTrigger className={triggerClass}>Trigger</HoverCardTrigger>
        <HoverCardContent className={contentClass} sideOffset={5}>
          <HoverCardArrow className={arrowClass} width={20} height={10} />
          Lorem ipsum dolor sit amet
          <br />
          Lorem ipsum dolor sit amet
          <br />
          Lorem ipsum dolor sit amet
          <br />
          Lorem ipsum dolor sit amet
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <HoverCard>
        <HoverCardTrigger className={triggerClass}>Trigger</HoverCardTrigger>
        <HoverCardContent className={contentClass} sideOffset={5}>
          <HoverCardArrow className={arrowClass} width={20} height={10} />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <HoverCard open={open} onOpenChange={setOpen}>
        <HoverCardTrigger
          className={triggerClass}
          style={{ backgroundColor: 'red', padding: 50, display: 'block' }}
        >
          trigger
        </HoverCardTrigger>
        <HoverCardContent className={contentClass}>
          <HoverCardArrow className={arrowClass} width={20} height={10} />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const Animated = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <HoverCard>
        <HoverCardTrigger className={triggerClass}>Trigger</HoverCardTrigger>
        <HoverCardContent className={animatedContentClass} sideOffset={10}>
          <HoverCardArrow className={arrowClass} width={20} height={10} />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const ForcedMount = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <HoverCard>
        <HoverCardTrigger className={triggerClass}>Trigger</HoverCardTrigger>
        <HoverCardContent className={contentClass} sideOffset={10} forceMount>
          <HoverCardArrow className={arrowClass} width={20} height={10} />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const Nested = () => {
  const anchorRef = React.useRef<HTMLAnchorElement>(null);

  return (
    <div
      style={{
        height: '300vh',
        width: '300vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <a
        href="/"
        style={{ position: 'fixed', top: 10, left: 10 }}
        onClick={() => anchorRef.current?.focus()}
      >
        Focus HoverCard button
      </a>

      <HoverCard>
        <HoverCardTrigger className={triggerClass} ref={anchorRef}>
          Open HoverCard
        </HoverCardTrigger>

        <HoverCardContent
          className={contentClass}
          sideOffset={5}
          style={{ backgroundColor: 'crimson' }}
        >
          <HoverCard>
            <HoverCardTrigger className={triggerClass}>Open nested HoverCard</HoverCardTrigger>
            <HoverCardContent
              className={contentClass}
              side="top"
              align="center"
              sideOffset={5}
              style={{ backgroundColor: 'green' }}
            >
              <HoverCardArrow
                className={arrowClass}
                width={20}
                height={10}
                offset={20}
                style={{ fill: 'green' }}
              />
            </HoverCardContent>
          </HoverCard>
          dfsdf
          <HoverCardArrow
            className={arrowClass}
            width={20}
            height={10}
            offset={20}
            style={{ fill: 'crimson' }}
          />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const CustomAnchor = () => {
  const itemBoxRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemBoxRef}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 250,
        padding: 20,
        margin: 100,
        backgroundColor: '#eee',
      }}
    >
      Item
      <HoverCard>
        <HoverCardTrigger className={triggerClass}>hover</HoverCardTrigger>
        <HoverCardContent
          className={contentClass}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
          style={{ borderRadius: 0, width: 200, height: 100 }}
        ></HoverCardContent>
      </HoverCard>
    </div>
  );
};

export const NonPortal = () => {
  return (
    <HoverCard>
      <HoverCardTrigger className={triggerClass}>hover</HoverCardTrigger>
      <HoverCardContent portalled={false} className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} offset={10} />
      </HoverCardContent>
    </HoverCard>
  );
};

export const WithSlottedTrigger = () => {
  return (
    <HoverCard>
      <HoverCardTrigger as={Slot}>
        <button className={triggerClass} onClick={() => console.log('StyledTrigger click')}>
          hover
        </button>
      </HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} offset={10} />
      </HoverCardContent>
    </HoverCard>
  );
};

export const WithSlottedContent = () => (
  <HoverCard>
    <HoverCardTrigger className={triggerClass}>Hover or Focus me</HoverCardTrigger>
    <HoverCardContent as={Slot} sideOffset={5}>
      <div className={contentClass}>
        Nicely done!
        <HoverCardArrow className={arrowClass} offset={10} />
      </div>
    </HoverCardContent>
  </HoverCard>
);

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => (
  <div style={{ padding: 200 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <HoverCard>
      <HoverCardTrigger className={triggerClass}>trigger</HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h2>Open</h2>
    <HoverCard defaultOpen>
      <HoverCardTrigger className={triggerClass}>trigger</HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <HoverCard open={false}>
      <HoverCardTrigger className={triggerClass}>open</HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h2>Open</h2>
    <HoverCard open>
      <HoverCardTrigger className={triggerClass}>open</HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <HoverCard>
      <HoverCardTrigger className={triggerClass}>open</HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5} forceMount>
        <HoverCardArrow className={arrowClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>

    <h3>Arrow offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} offset={5} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} offset={-10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              sideOffset={5}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              sideOffset={-10}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              align={align}
              alignOffset={20}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard key={`${side}-${align}`} open>
            <HoverCardTrigger className={chromaticTriggerClass} />
            <HoverCardContent
              className={chromaticContentClass}
              side={side}
              align={align}
              alignOffset={-10}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
            </HoverCardContent>
          </HoverCard>
        ))
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <HoverCard key={`${side}-${align}`} open>
          <HoverCardTrigger
            className={chromaticTriggerClass}
            style={{
              position: 'absolute',
              [side]: 10,
              ...((side === 'right' || side === 'left') &&
                (align === 'start'
                  ? { bottom: 10 }
                  : align === 'center'
                  ? { top: 'calc(50% - 15px)' }
                  : { top: 10 })),
              ...((side === 'top' || side === 'bottom') &&
                (align === 'start'
                  ? { right: 10 }
                  : align === 'center'
                  ? { left: 'calc(50% - 15px)' }
                  : { left: 10 })),
            }}
          />
          <HoverCardContent className={chromaticContentClass} side={side} align={align}>
            <p style={{ textAlign: 'center' }}>
              {side}
              <br />
              {align}
            </p>
            <HoverCardArrow className={chromaticArrowClass} width={20} height={10} />
          </HoverCardContent>
        </HoverCard>
      ))
    )}

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <HoverCard open>
      <HoverCardTrigger as={Slot}>
        <button className={triggerClass}>open</button>
      </HoverCardTrigger>
      <HoverCardContent className={contentClass} sideOffset={5}>
        <HoverCardArrow className={arrowClass} width={20} height={10} offset={10} />
      </HoverCardContent>
    </HoverCard>

    <h1 style={{ marginTop: 100 }}>State attributes</h1>
    <h2>Closed</h2>
    <HoverCard open={false}>
      <HoverCardTrigger className={triggerAttrClass}>open</HoverCardTrigger>
      <HoverCardContent className={contentAttrClass} sideOffset={5}>
        <HoverCardArrow className={arrowAttrClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>

    <h2>Open</h2>
    <HoverCard open>
      <HoverCardTrigger className={triggerAttrClass}>open</HoverCardTrigger>
      <HoverCardContent className={contentAttrClass} side="right" sideOffset={5}>
        <HoverCardArrow className={arrowAttrClass} width={20} height={10} />
      </HoverCardContent>
    </HoverCard>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__HOVERCARD__CONTENT = {
  transformOrigin: 'var(--radix-hovercard-content-transform-origin)',
};

const contentClass = css({
  ...RECOMMENDED_CSS__HOVERCARD__CONTENT,
  backgroundColor: '$gray300',
  padding: 20,
  borderRadius: 5,
});

const arrowClass = css({
  fill: '$gray300',
});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const gridClass = css({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(3, 50px)',
  columnGap: 150,
  rowGap: 100,
  padding: 100,
  border: '1px solid black',
});

const chromaticTriggerClass = css({
  boxSizing: 'border-box',
  width: 30,
  height: 30,
  backgroundColor: 'tomato',
  border: '1px solid rgba(0, 0, 0, 0.3)',
});

const chromaticContentClass = css({
  boxSizing: 'border-box',
  display: 'grid',
  placeContent: 'center',
  width: 60,
  height: 60,
  backgroundColor: 'royalblue',
  color: 'white',
  fontSize: 10,
  border: '1px solid rgba(0, 0, 0, 0.3)',
});

const chromaticArrowClass = css({
  fill: 'black',
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
};
const triggerAttrClass = css(styles);
const contentAttrClass = css(chromaticContentClass, styles);
const arrowAttrClass = css(styles);
