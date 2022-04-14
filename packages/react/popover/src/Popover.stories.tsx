import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import * as Popover from '@radix-ui/react-popover';

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover.Root>
        <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
        <Popover.Content className={contentClass()} sideOffset={5}>
          <Popover.Close className={closeClass()}>close</Popover.Close>
          <Popover.Arrow className={arrowClass()} width={20} height={10} />
        </Popover.Content>
      </Popover.Root>
      <input />
    </div>
  );
};

export const Modality = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110vh' }}
    >
      <div style={{ display: 'grid', gap: 50 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Non modal (default)</h1>
          <Popover.Root>
            <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
            <Popover.Content className={contentClass()} sideOffset={5}>
              <Popover.Close className={closeClass()}>close</Popover.Close>
              <Popover.Arrow className={arrowClass()} width={20} height={10} offset={10} />
            </Popover.Content>
          </Popover.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Modal</h1>
          <Popover.Root modal>
            <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
            <Popover.Content className={contentClass()} sideOffset={5}>
              <Popover.Close className={closeClass()}>close</Popover.Close>
              <Popover.Arrow className={arrowClass()} width={20} height={10} offset={10} />
            </Popover.Content>
          </Popover.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
      </div>
    </div>
  );
};

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={triggerClass()}>{open ? 'close' : 'open'}</Popover.Trigger>
        <Popover.Content className={contentClass()}>
          <Popover.Close className={closeClass()}>close</Popover.Close>
          <Popover.Arrow className={arrowClass()} width={20} height={10} />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const Animated = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover.Root>
        <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
        <Popover.Content className={animatedContentClass()} sideOffset={10}>
          <Popover.Close className={closeClass()}>close</Popover.Close>
          <Popover.Arrow className={arrowClass()} width={20} height={10} />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const ForcedMount = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover.Root>
        <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
        <Popover.Content className={contentClass()} sideOffset={10} forceMount>
          <Popover.Close className={closeClass()}>close</Popover.Close>
          <Popover.Arrow className={arrowClass()} width={20} height={10} />
        </Popover.Content>
      </Popover.Root>
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

      <Popover.Root>
        <Popover.Trigger className={triggerClass()} ref={buttonRef}>
          Open popover
        </Popover.Trigger>

        <Popover.Content
          className={contentClass()}
          sideOffset={5}
          style={{ backgroundColor: 'crimson' }}
        >
          <Popover.Root>
            <Popover.Trigger className={triggerClass()}>Open nested popover</Popover.Trigger>
            <Popover.Content
              className={contentClass()}
              side="top"
              align="center"
              sideOffset={5}
              style={{ backgroundColor: 'green' }}
            >
              <Popover.Close className={closeClass()}>close</Popover.Close>
              <Popover.Arrow
                className={arrowClass()}
                width={20}
                height={10}
                offset={20}
                style={{ fill: 'green' }}
              />
            </Popover.Content>
          </Popover.Root>

          <Popover.Close className={closeClass()} style={{ marginLeft: 10 }}>
            close
          </Popover.Close>
          <Popover.Arrow
            className={arrowClass()}
            width={20}
            height={10}
            offset={20}
            style={{ fill: 'crimson' }}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const CustomAnchor = () => (
  <Popover.Root>
    <Popover.Anchor
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
      Item <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
    </Popover.Anchor>
    <Popover.Content
      className={contentClass()}
      side="right"
      sideOffset={1}
      align="start"
      style={{ borderRadius: 0, width: 200, height: 100 }}
    >
      <Popover.Close>close</Popover.Close>
    </Popover.Content>
  </Popover.Root>
);

export const WithSlottedTrigger = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={triggerClass()} onClick={() => console.log('StyledTrigger click')}>
          open
        </button>
      </Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} offset={10} />
      </Popover.Content>
    </Popover.Root>
  );
};

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => (
  <div style={{ padding: 200 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Popover.Root>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root defaultOpen>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      <Popover.Content
        className={contentClass()}
        sideOffset={5}
        onFocusOutside={(event) => event.preventDefault()}
      >
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
    <Popover.Root defaultOpen>
      <Popover.Content
        className={contentClass()}
        sideOffset={5}
        onFocusOutside={(event) => event.preventDefault()}
      >
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <Popover.Root open={false}>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root open>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
    <Popover.Root open>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <Popover.Root>
      <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5} forceMount>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Anchor</h1>
    <h2>Controlled</h2>
    <Popover.Root open>
      <Popover.Anchor style={{ padding: 20, background: 'gainsboro' }}>
        <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      </Popover.Anchor>
      <Popover.Content className={contentClass()}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2>Uncontrolled</h2>
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ padding: 20, background: 'gainsboro' }}>
        <Popover.Trigger className={triggerClass()}>open</Popover.Trigger>
      </Popover.Anchor>
      <Popover.Content
        className={contentClass()}
        onFocusOutside={(event) => event.preventDefault()}
      >
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>

    <h3>Arrow offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} offset={5} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <Popover.Arrow
                className={chromaticArrowClass()}
                width={20}
                height={10}
                offset={-10}
              />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
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
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
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
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
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
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={chromaticTriggerClass()} />
            <Popover.Content
              className={chromaticContentClass()}
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
              <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </Popover.Content>
          </Popover.Root>
        ))
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <Popover.Root key={`${side}-${align}`} open>
          <Popover.Trigger
            className={chromaticTriggerClass()}
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
          <Popover.Content className={chromaticContentClass()} side={side} align={align}>
            <p style={{ textAlign: 'center' }}>
              {side}
              <br />
              {align}
            </p>
            <Popover.Arrow className={chromaticArrowClass()} width={20} height={10} />
          </Popover.Content>
        </Popover.Root>
      ))
    )}

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <Popover.Root open>
      <Popover.Trigger asChild>
        <button className={triggerClass()}>open</button>
      </Popover.Trigger>
      <Popover.Content className={contentClass()} sideOffset={5}>
        <Popover.Close className={closeClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowClass()} width={20} height={10} offset={10} />
      </Popover.Content>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>State attributes</h1>
    <h2>Closed</h2>
    <Popover.Root open={false}>
      <Popover.Trigger className={triggerAttrClass()}>open</Popover.Trigger>
      <Popover.Content className={contentAttrClass()} sideOffset={5}>
        <Popover.Close className={closeAttrClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowAttrClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root open>
      <Popover.Trigger className={triggerAttrClass()}>open</Popover.Trigger>
      <Popover.Content className={contentAttrClass()} side="right" sideOffset={5}>
        <Popover.Close className={closeAttrClass()}>close</Popover.Close>
        <Popover.Arrow className={arrowAttrClass()} width={20} height={10} />
      </Popover.Content>
    </Popover.Root>
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

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
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
const closeAttrClass = css(styles);
