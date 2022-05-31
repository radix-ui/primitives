import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as Dialog from '@radix-ui/react-dialog';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import * as HoverCard from '@radix-ui/react-hover-card';

export default { title: 'Components/HoverCard' };

export const Basic = () => {
  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={contentClass()} sideOffset={5}>
            <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
            <CardContentPlaceholder />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const AsyncUpdate = () => {
  const [open, setOpen] = React.useState(false);
  const [contentLoaded, setContentLoaded] = React.useState(false);
  const timerRef = React.useRef(0);

  const handleOpenChange = React.useCallback((open: boolean) => {
    clearTimeout(timerRef.current);

    if (open) {
      timerRef.current = window.setTimeout(() => {
        setContentLoaded(true);
      }, 500);
    } else {
      setContentLoaded(false);
    }

    setOpen(open);
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root open={open} onOpenChange={handleOpenChange}>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={contentClass()} sideOffset={5}>
            <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
            {contentLoaded ? <CardContentPlaceholder /> : 'Loading...'}
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const CustomDurations = () => (
  <div>
    <h1>Delay duration</h1>
    <h2>Default (700ms open, 300ms close)</h2>

    <HoverCard.Root>
      <HoverCard.Trigger href="/" className={triggerClass()}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()}>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Custom (instant, 0ms open, 0ms close)</h2>
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger href="/" className={triggerClass()}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()}>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Custom (300ms open, 100ms close)</h2>

    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger href="/" className={triggerClass()}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()}>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  </div>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root open={open} onOpenChange={setOpen}>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={contentClass()}>
            <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
            <CardContentPlaceholder />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const Layerable = () => (
  <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '1px solid',
          borderRadius: 4,
          padding: 20,
        }}
      >
        <Dialog.Title>Some dialog title</Dialog.Title>
        Some dialog content with a{' '}
        <HoverCard.Root>
          <HoverCard.Trigger href="/" className={triggerClass()}>
            trigger
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content className={contentClass()} sideOffset={5}>
              <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
              <CardContentPlaceholder />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>{' '}
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  </div>
);

export const Animated = () => {
  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={animatedContentClass()} sideOffset={10}>
            <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
            <CardContentPlaceholder />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const ForcedMount = () => {
  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal forceMount>
          <HoverCard.Content className={contentClass()} sideOffset={10}>
            <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
            <CardContentPlaceholder />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const Nested = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger href="/" className={triggerClass()}>
        trigger level 1
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className={contentClass()}
          sideOffset={5}
          style={{ backgroundColor: 'crimson' }}
        >
          <HoverCard.Root>
            <HoverCard.Trigger href="/" className={triggerClass()}>
              trigger level 2
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content
                className={contentClass()}
                side="top"
                align="center"
                sideOffset={5}
                style={{ backgroundColor: 'green' }}
              >
                <HoverCard.Arrow
                  className={arrowClass()}
                  width={20}
                  height={10}
                  offset={20}
                  style={{ fill: 'green' }}
                />
                <HoverCard.Root>
                  <HoverCard.Trigger href="/" className={triggerClass()}>
                    trigger level 3
                  </HoverCard.Trigger>
                  <HoverCard.Portal>
                    <HoverCard.Content
                      className={contentClass()}
                      side="bottom"
                      align="start"
                      sideOffset={5}
                      style={{ backgroundColor: 'purple' }}
                    >
                      <HoverCard.Arrow
                        className={arrowClass()}
                        width={20}
                        height={10}
                        offset={20}
                        style={{ fill: 'purple' }}
                      />
                      level 3
                    </HoverCard.Content>
                  </HoverCard.Portal>
                </HoverCard.Root>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>

          <HoverCard.Arrow
            className={arrowClass()}
            width={20}
            height={10}
            offset={20}
            style={{ fill: 'crimson' }}
          />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export const NonPortal = () => {
  return (
    <div>
      <button>button</button>
      <HoverCard.Root>
        <HoverCard.Trigger href="/" className={triggerClass()}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} offset={10} />
          <a href="#link">Should not be able to focus me</a>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Root>
      <button>button</button>
    </div>
  );
};

export const WithSlottedTrigger = () => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <button className={triggerClass()} onClick={() => console.log('StyledTrigger click')}>
          trigger
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} offset={10} />
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export const WithSlottedContent = () => (
  <HoverCard.Root>
    <HoverCard.Trigger href="/" className={triggerClass()}>
      trigger
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content asChild sideOffset={5}>
        <div className={contentClass()}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} offset={10} />
          <CardContentPlaceholder />
        </div>
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => (
  <div style={{ padding: 200 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <HoverCard.Root>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root defaultOpen>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <HoverCard.Root defaultOpen>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          Some content
          <HoverCard.Arrow className={arrowClass()} offset={10} />
        </HoverCard.Content>
      </HoverCard.Portal>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <HoverCard.Root open={false}>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root open>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <HoverCard.Root open>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          Some content
          <HoverCard.Arrow className={arrowClass()} offset={10} />
        </HoverCard.Content>
      </HoverCard.Portal>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <HoverCard.Root>
      <HoverCard.Trigger className={triggerClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal forceMount>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h3>Arrow offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow
                  className={chromaticArrowClass()}
                  width={20}
                  height={10}
                  offset={5}
                />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow
                  className={chromaticArrowClass()}
                  width={20}
                  height={10}
                  offset={-10}
                />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass()}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={chromaticTriggerClass()} />
            <HoverCard.Portal>
              <HoverCard.Content
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
                <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <HoverCard.Root key={`${side}-${align}`} open>
          <HoverCard.Trigger
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
          <HoverCard.Portal>
            <HoverCard.Content className={chromaticContentClass()} side={side} align={align}>
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCard.Arrow className={chromaticArrowClass()} width={20} height={10} />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      ))
    )}

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <HoverCard.Root open>
      <HoverCard.Trigger asChild>
        <button className={triggerClass()}>open</button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowClass()} width={20} height={10} offset={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>State attributes</h1>
    <h2>Closed</h2>
    <HoverCard.Root open={false}>
      <HoverCard.Trigger className={triggerAttrClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentAttrClass()} sideOffset={5}>
          <HoverCard.Arrow className={arrowAttrClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root open>
      <HoverCard.Trigger className={triggerAttrClass()}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={contentAttrClass()} side="right" sideOffset={5}>
          <HoverCard.Arrow className={arrowAttrClass()} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

function CardContentPlaceholder() {
  return (
    <div style={{ maxWidth: 400, display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 60, height: 60, backgroundColor: 'white', borderRadius: 100 }} />
      <div style={{ marginLeft: 14 }}>
        <div style={{ width: 200, backgroundColor: 'white', height: 14, borderRadius: 100 }} />
        <div
          style={{
            width: 150,
            backgroundColor: 'white',
            height: 14,
            borderRadius: 100,
            marginTop: 10,
          }}
        />
      </div>
    </div>
  );
}

const RECOMMENDED_CSS__HOVERCARD__CONTENT = {
  transformOrigin: 'var(--radix-hover-card-content-transform-origin)',
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

const fadeIn = keyframes({
  from: { transform: 'scale(0.9)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const fadeOut = keyframes({
  from: { transform: 'scale(1)', opacity: 1 },
  to: { transform: 'scale(0.9)', opacity: 0 },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease`,
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
