import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverArrow } from './Popover';
import { Slot } from '@radix-ui/react-slot';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
        <PopoverContent className={contentClass} sideOffset={5}>
          <PopoverClose className={closeClass}>close</PopoverClose>
          <PopoverArrow className={arrowClass} width={20} height={10} />
        </PopoverContent>
      </Popover>
      <input />
    </div>
  );
};

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={triggerClass}>{open ? 'close' : 'open'}</PopoverTrigger>
        <PopoverContent className={contentClass}>
          <PopoverClose className={closeClass}>close</PopoverClose>
          <PopoverArrow className={arrowClass} width={20} height={10} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const Animated = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
        <PopoverContent className={animatedContentClass} sideOffset={10}>
          <PopoverClose className={closeClass}>close</PopoverClose>
          <PopoverArrow className={arrowClass} width={20} height={10} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ForcedMount = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
        <PopoverContent className={contentClass} sideOffset={10} forceMount>
          <PopoverClose className={closeClass}>close</PopoverClose>
          <PopoverArrow className={arrowClass} width={20} height={10} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const Nested = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

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
      <button
        type="button"
        style={{ position: 'fixed', top: 10, left: 10 }}
        onClick={() => buttonRef.current?.focus()}
      >
        Focus popover button
      </button>

      <Popover>
        <PopoverTrigger className={triggerClass} ref={buttonRef}>
          Open popover
        </PopoverTrigger>

        <PopoverContent
          className={contentClass}
          sideOffset={5}
          style={{ backgroundColor: 'crimson' }}
        >
          <Popover>
            <PopoverTrigger className={triggerClass}>Open nested popover</PopoverTrigger>
            <PopoverContent
              className={contentClass}
              side="top"
              align="center"
              sideOffset={5}
              style={{ backgroundColor: 'green' }}
            >
              <PopoverClose className={closeClass}>close</PopoverClose>
              <PopoverArrow
                className={arrowClass}
                width={20}
                height={10}
                offset={20}
                style={{ fill: 'green' }}
              />
            </PopoverContent>
          </Popover>

          <PopoverClose className={closeClass} style={{ marginLeft: 10 }}>
            close
          </PopoverClose>
          <PopoverArrow
            className={arrowClass}
            width={20}
            height={10}
            offset={20}
            style={{ fill: 'crimson' }}
          />
        </PopoverContent>
      </Popover>
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
      <Popover>
        <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
        <PopoverContent
          className={contentClass}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
          style={{ borderRadius: 0, width: 200, height: 100 }}
        >
          <PopoverClose>close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const NonModal = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
        <PopoverContent className={contentClass} sideOffset={5} trapFocus={false}>
          <PopoverClose className={closeClass}>close</PopoverClose>
          <PopoverArrow className={arrowClass} width={20} height={10} offset={10} />
        </PopoverContent>
      </Popover>
      <input style={{ marginLeft: 10 }} />
    </>
  );
};

export const WithSlottedTrigger = () => {
  return (
    <Popover>
      <PopoverTrigger as={Slot}>
        <button className={triggerClass} onClick={() => console.log('StyledTrigger click')}>
          open
        </button>
      </PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} offset={10} />
      </PopoverContent>
    </Popover>
  );
};

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => (
  <div style={{ padding: 200 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Popover>
      <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h2>Open</h2>
    <Popover defaultOpen>
      <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <Popover open={false}>
      <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h2>Open</h2>
    <Popover open>
      <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <Popover>
      <PopoverTrigger className={triggerClass}>open</PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5} forceMount>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>

    <h3>Arrow offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} offset={5} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} offset={-10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover key={`${side}-${align}`} open>
            <PopoverTrigger className={chromaticTriggerClass} />
            <PopoverContent
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
              <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
            </PopoverContent>
          </Popover>
        ))
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <Popover key={`${side}-${align}`} open>
          <PopoverTrigger
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
          <PopoverContent className={chromaticContentClass} side={side} align={align}>
            <p style={{ textAlign: 'center' }}>
              {side}
              <br />
              {align}
            </p>
            <PopoverArrow className={chromaticArrowClass} width={20} height={10} />
          </PopoverContent>
        </Popover>
      ))
    )}

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <Popover open>
      <PopoverTrigger as={Slot}>
        <button className={triggerClass}>open</button>
      </PopoverTrigger>
      <PopoverContent className={contentClass} sideOffset={5}>
        <PopoverClose className={closeClass}>close</PopoverClose>
        <PopoverArrow className={arrowClass} width={20} height={10} offset={10} />
      </PopoverContent>
    </Popover>

    <h1 style={{ marginTop: 100 }}>Data attribute selectors</h1>
    <h2>Closed</h2>
    <Popover open={false}>
      <PopoverTrigger className={triggerAttrClass}>open</PopoverTrigger>
      <PopoverContent className={contentAttrClass} sideOffset={5}>
        <PopoverClose className={closeAttrClass}>close</PopoverClose>
        <PopoverArrow className={arrowAttrClass} width={20} height={10} />
      </PopoverContent>
    </Popover>

    <h2>Open</h2>
    <Popover open>
      <PopoverTrigger className={triggerAttrClass}>open</PopoverTrigger>
      <PopoverContent className={contentAttrClass} side="right" sideOffset={5}>
        <PopoverClose className={closeAttrClass}>close</PopoverClose>
        <PopoverArrow className={arrowAttrClass} width={20} height={10} />
      </PopoverContent>
    </Popover>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__POPOVER__CONTENT = {
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
};

const contentClass = css({
  ...RECOMMENDED_CSS__POPOVER__CONTENT,
  backgroundColor: '$gray300',
  padding: 20,
  borderRadius: 5,
});

const closeClass = css({});

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
const triggerAttrClass = css({ '&[data-radix-popover-trigger]': styles });
const contentAttrClass = css(chromaticContentClass, { '&[data-radix-popover-content]': styles });
const arrowAttrClass = css({ '&[data-radix-popover-arrow]': styles });
const closeAttrClass = css({ '&[data-radix-popover-close]': styles });
