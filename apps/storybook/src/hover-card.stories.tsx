import * as React from 'react';
import { Dialog, HoverCard } from 'radix-ui';
import { Popper } from 'radix-ui/internal';
import styles from './hover-card.stories.module.css';

const { SIDE_OPTIONS, ALIGN_OPTIONS } = Popper;

export default { title: 'Components/HoverCard' };

const contentClass = ({ animated }: { animated?: boolean }) =>
  [
    styles.content, ///
    animated && styles.animatedContent,
  ]
    .filter(Boolean)
    .join(' ');

export const Basic = () => {
  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <HoverCard.Root>
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={styles.content} sideOffset={5}>
            <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
            <CardContentPlaceholder />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
};

export const ContainTextSelection = () => {
  return (
    <div
      style={{
        padding: 50,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 30 }}>
        <HoverCard.Root>
          <HoverCard.Trigger href="/" className={styles.trigger}>
            single
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content className={contentClass({ animated: true })} sideOffset={5}>
              <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
              <div style={{ maxWidth: 400 }}>
                Text selections will be contained within the content. While a selection is active
                the content will not dismiss unless the selection is cleared or an outside
                interaction is performed.
              </div>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>

        <HoverCard.Root>
          <HoverCard.Trigger href="/" className={styles.trigger}>
            nested
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content className={contentClass({ animated: true })} sideOffset={5}>
              <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
              <div style={{ maxWidth: 400 }}>
                Text selections will be contained within the content. While a selection is active
                the content will not dismiss unless the selection is cleared or an outside
                interaction is performed.
              </div>

              <HoverCard.Root>
                <HoverCard.Trigger href="/" className={styles.trigger}>
                  nested trigger
                </HoverCard.Trigger>
                <HoverCard.Portal>
                  <HoverCard.Content
                    className={contentClass({ animated: true })}
                    sideOffset={5}
                    style={{ backgroundColor: 'crimson' }}
                  >
                    <HoverCard.Arrow
                      className={styles.arrow}
                      width={20}
                      height={10}
                      style={{ fill: 'crimson' }}
                    />
                    <div style={{ maxWidth: 400 }}>
                      Text selections will be contained within the content. While a selection is
                      active the content will not dismiss unless the selection is cleared or an
                      outside interaction is performed.
                    </div>

                    <HoverCard.Root>
                      <HoverCard.Trigger href="/" className={styles.trigger}>
                        nested trigger
                      </HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          className={contentClass({ animated: true })}
                          sideOffset={5}
                          style={{ backgroundColor: 'green' }}
                        >
                          <HoverCard.Arrow
                            className={styles.arrow}
                            width={20}
                            height={10}
                            style={{ fill: 'green' }}
                          />
                          <div style={{ maxWidth: 400 }}>
                            Text selections will be contained within the content. While a selection
                            is active the content will not dismiss unless the selection is cleared
                            or an outside interaction is performed.
                          </div>
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </div>
      <div style={{ maxWidth: 800 }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat mattis malesuada.
          Fusce elementum vulputate aliquet. Integer fringilla porta eros. Ut ultricies mattis nisi.
          Sed et tempor massa. Sed non arcu ut velit scelerisque bibendum tempor sed mi. In non
          consequat sapien. Donec sollicitudin eget tellus ut venenatis. Donec posuere sem ante, nec
          iaculis arcu varius sit amet. Praesent non tortor quam. Curabitur dapibus justo a commodo
          ornare.
        </p>
        <p>
          Suspendisse eleifend consequat iaculis. Nunc bibendum velit felis, nec vulputate purus
          egestas quis. Integer mauris dui, pulvinar non metus id, tristique dignissim elit. Vivamus
          massa tellus, porttitor id lorem non, molestie aliquam dolor. Pellentesque erat quam,
          pellentesque non metus id, tempus sagittis massa.
        </p>
        <p>
          Sed at elementum sem, non venenatis leo. Ut vulputate consectetur finibus. Sed nunc
          lectus, accumsan in nisl et, vehicula pretium nisi. Vivamus vestibulum ante quis urna
          consequat, ultrices condimentum sem commodo. Pellentesque eget orci laoreet, feugiat purus
          sed, maximus nisi. Suspendisse commodo venenatis facilisis.
        </p>
      </div>
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
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={styles.content} sideOffset={5}>
            <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
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
      <HoverCard.Trigger href="/" className={styles.trigger}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content}>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Custom (instant, 0ms open, 0ms close)</h2>
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger href="/" className={styles.trigger}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content}>
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Custom (300ms open, 100ms close)</h2>

    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger href="/" className={styles.trigger}>
        trigger
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content}>
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
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={styles.content}>
            <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
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
          <HoverCard.Trigger href="/" className={styles.trigger}>
            trigger
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content className={styles.content} sideOffset={5}>
              <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
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
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={contentClass({ animated: true })} sideOffset={10}>
            <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
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
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Portal forceMount>
          <HoverCard.Content className={styles.content} sideOffset={10}>
            <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
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
      <HoverCard.Trigger href="/" className={styles.trigger}>
        trigger level 1
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className={styles.content}
          sideOffset={5}
          style={{ backgroundColor: 'crimson' }}
        >
          <HoverCard.Root>
            <HoverCard.Trigger href="/" className={styles.trigger}>
              trigger level 2
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.content}
                side="top"
                align="center"
                sideOffset={5}
                style={{ backgroundColor: 'green' }}
              >
                <HoverCard.Arrow
                  className={styles.arrow}
                  width={20}
                  height={10}
                  offset={20}
                  style={{ fill: 'green' }}
                />
                <HoverCard.Root>
                  <HoverCard.Trigger href="/" className={styles.trigger}>
                    trigger level 3
                  </HoverCard.Trigger>
                  <HoverCard.Portal>
                    <HoverCard.Content
                      className={styles.content}
                      side="bottom"
                      align="start"
                      sideOffset={5}
                      style={{ backgroundColor: 'purple' }}
                    >
                      <HoverCard.Arrow
                        className={styles.arrow}
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
            className={styles.arrow}
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
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} offset={10} />
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
        <button className={styles.trigger} onClick={() => console.log('StyledTrigger click')}>
          trigger
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} offset={10} />
          <CardContentPlaceholder />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export const WithSlottedContent = () => (
  <HoverCard.Root>
    <HoverCard.Trigger href="/" className={styles.trigger}>
      trigger
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content asChild sideOffset={5}>
        <div className={styles.content}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} offset={10} />
          <CardContentPlaceholder />
        </div>
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

// change order slightly for more pleasing visual
const SIDES = [...SIDE_OPTIONS.filter((side) => side !== 'bottom'), 'bottom' as const];

export const Chromatic = () => (
  <div style={{ padding: 200, paddingBottom: 500 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <HoverCard.Root>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root defaultOpen>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <HoverCard.Root defaultOpen>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          Some content
          <HoverCard.Arrow className={styles.arrow} offset={10} />
        </HoverCard.Content>
      </HoverCard.Portal>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <HoverCard.Root open={false}>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root open>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <HoverCard.Root open>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          Some content
          <HoverCard.Arrow className={styles.arrow} offset={10} />
        </HoverCard.Content>
      </HoverCard.Portal>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <HoverCard.Root>
      <HoverCard.Trigger className={styles.trigger}>open</HoverCard.Trigger>
      <HoverCard.Portal forceMount>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={styles.chromaticTrigger} />
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.chromaticContent}
                side={side}
                align={align}
                avoidCollisions={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={styles.chromaticTrigger} />
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.chromaticContent}
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
                <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={styles.chromaticTrigger} />
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.chromaticContent}
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
                <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={styles.chromaticTrigger} />
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.chromaticContent}
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
                <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <HoverCard.Root key={`${side}-${align}`} open>
            <HoverCard.Trigger className={styles.chromaticTrigger} />
            <HoverCard.Portal>
              <HoverCard.Content
                className={styles.chromaticContent}
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
                <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
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
            className={styles.chromaticTrigger}
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
            <HoverCard.Content className={styles.chromaticContent} side={side} align={align}>
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <HoverCard.Arrow className={styles.chromaticArrow} width={20} height={10} />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      ))
    )}

    <h2>Relative parent (non-portalled)</h2>
    <div style={{ position: 'relative' }}>
      <HoverCard.Root open>
        <HoverCard.Trigger href="/" className={styles.trigger}>
          trigger
        </HoverCard.Trigger>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Root>
    </div>

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <HoverCard.Root open>
      <HoverCard.Trigger asChild>
        <button className={styles.trigger}>open</button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.content} sideOffset={5}>
          <HoverCard.Arrow className={styles.arrow} width={20} height={10} offset={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h1 style={{ marginTop: 100 }}>State attributes</h1>
    <h2>Closed</h2>
    <HoverCard.Root open={false}>
      <HoverCard.Trigger className={styles.triggerAttr}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={styles.contentAttr} sideOffset={5} avoidCollisions={false}>
          <HoverCard.Arrow className={styles.arrowAttr} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>

    <h2>Open</h2>
    <HoverCard.Root open>
      <HoverCard.Trigger className={styles.triggerAttr}>open</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={styles.contentAttr}
          side="right"
          sideOffset={5}
          avoidCollisions={false}
        >
          <HoverCard.Arrow className={styles.arrowAttr} width={20} height={10} />
          Some content
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

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
