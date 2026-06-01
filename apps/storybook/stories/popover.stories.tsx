import * as React from 'react';
import { Popover } from 'radix-ui';
import { Popper } from 'radix-ui/internal';
import styles from './popover.stories.module.css';

const { SIDE_OPTIONS, ALIGN_OPTIONS } = Popper;

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover.Root>
        <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.content} sideOffset={5}>
            <Popover.Close className={styles.close}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input />
    </div>
  );
};

// Original issue: https://github.com/radix-ui/primitives/issues/2128
export const Boundary = () => {
  const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        border: '3px dashed red',
        width: '200px',
        height: '200px',
      }}
      ref={setBoundary}
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <button>open</button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            style={{
              boxSizing: 'border-box',
              borderRadius: '8px',
              padding: '8px',
              color: 'white',
              backgroundColor: 'black',
              width: 'var(--radix-popper-available-width)',
              height: 'var(--radix-popper-available-height)',
            }}
            sideOffset={5}
            collisionBoundary={boundary}
          >
            out of bound out of bound out of bound out of bound out of bound out of bound out of
            bound out of bound out of bound
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
            <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className={styles.content} sideOffset={5}>
                <Popover.Close className={styles.close}>close</Popover.Close>
                <Popover.Arrow className={styles.arrow} width={20} height={10} offset={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Modal</h1>
          <Popover.Root modal>
            <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className={styles.content} sideOffset={5}>
                <Popover.Close className={styles.close}>close</Popover.Close>
                <Popover.Arrow className={styles.arrow} width={20} height={10} offset={10} />
              </Popover.Content>
            </Popover.Portal>
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
        <Popover.Trigger className={styles.trigger}>{open ? 'close' : 'open'}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.content}>
            <Popover.Close className={styles.close}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
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
        <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={[styles.content, styles.animatedContent].join(' ')}
            sideOffset={10}
          >
            <Popover.Close className={styles.close}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
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
        <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
        <Popover.Portal forceMount>
          <Popover.Content className={styles.content} sideOffset={10}>
            <Popover.Close className={styles.close}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
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
        <Popover.Trigger className={styles.trigger} ref={buttonRef}>
          Open popover
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={styles.content}
            sideOffset={5}
            style={{ backgroundColor: 'crimson' }}
          >
            <Popover.Root>
              <Popover.Trigger className={styles.trigger}>Open nested popover</Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className={styles.content}
                  side="top"
                  align="center"
                  sideOffset={5}
                  style={{ backgroundColor: 'green' }}
                >
                  <Popover.Close className={styles.close}>close</Popover.Close>
                  <Popover.Arrow
                    className={styles.arrow}
                    width={20}
                    height={10}
                    offset={20}
                    style={{ fill: 'green' }}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Close className={styles.close} style={{ marginLeft: 10 }}>
              close
            </Popover.Close>
            <Popover.Arrow
              className={styles.arrow}
              width={20}
              height={10}
              offset={20}
              style={{ fill: 'crimson' }}
            />
          </Popover.Content>
        </Popover.Portal>
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
      Item <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
    </Popover.Anchor>
    <Popover.Portal>
      <Popover.Content
        className={styles.content}
        side="right"
        sideOffset={1}
        align="start"
        style={{ borderRadius: 0, width: 200, height: 100 }}
      >
        <Popover.Close>close</Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export const CustomAnchorSibling = () => (
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
      Item
    </Popover.Anchor>
    <Popover.Trigger className={styles.trigger} style={{ margin: '0 100px' }}>
      open
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className={styles.content}
        side="right"
        sideOffset={1}
        align="start"
        style={{ borderRadius: 0, width: 200, height: 100 }}
      >
        <Popover.Close>close</Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export const WithSlottedTrigger = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.trigger} onClick={() => console.log('StyledTrigger click')}>
          open
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} offset={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// change order slightly for more pleasing visual
const SIDES = [...SIDE_OPTIONS.filter((side) => side !== 'bottom'), 'bottom' as const];

export const Chromatic = () => (
  <div style={{ padding: 200, paddingBottom: 500 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Popover.Root>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root defaultOpen>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          sideOffset={5}
          onFocusOutside={(event) => event.preventDefault()}
        >
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
    <Popover.Root defaultOpen>
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          sideOffset={5}
          onFocusOutside={(event) => event.preventDefault()}
        >
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <Popover.Root open={false}>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root open>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
    <Popover.Root open>
      <Popover.Content className={styles.content} sideOffset={5}>
        <Popover.Close className={styles.close}>close</Popover.Close>
        <Popover.Arrow className={styles.arrow} width={20} height={10} />
      </Popover.Content>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Force mounted content</h1>
    <Popover.Root>
      <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      <Popover.Portal forceMount>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Anchor</h1>
    <h2>Controlled</h2>
    <Popover.Root open>
      <Popover.Anchor style={{ padding: 20, background: 'gainsboro' }}>
        <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content className={styles.content}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2>Uncontrolled</h2>
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ padding: 20, background: 'gainsboro' }}>
        <Popover.Trigger className={styles.trigger}>open</Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          onFocusOutside={(event) => event.preventDefault()}
        >
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={styles.chromaticTrigger} />
            <Popover.Portal>
              <Popover.Content
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
                <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )),
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={styles.chromaticTrigger} />
            <Popover.Portal>
              <Popover.Content
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
                <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )),
      )}
    </div>
    <h4>Negative</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={styles.chromaticTrigger} />
            <Popover.Portal>
              <Popover.Content
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
                <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )),
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={styles.chromaticTrigger} />
            <Popover.Portal>
              <Popover.Content
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
                <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )),
      )}
    </div>
    <h4>Negative</h4>
    <div className={styles.grid}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Popover.Root key={`${side}-${align}`} open>
            <Popover.Trigger className={styles.chromaticTrigger} />
            <Popover.Portal>
              <Popover.Content
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
                <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )),
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <Popover.Root key={`${side}-${align}`} open>
          <Popover.Trigger
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
          <Popover.Portal>
            <Popover.Content className={styles.chromaticContent} side={side} align={align}>
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <Popover.Arrow className={styles.chromaticArrow} width={20} height={10} />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )),
    )}

    <h2>Relative parent (non-portalled)</h2>
    <div style={{ position: 'relative' }}>
      <Popover.Root open>
        <Popover.Trigger asChild>
          <button className={styles.trigger}>open</button>
        </Popover.Trigger>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} offset={10} />
        </Popover.Content>
      </Popover.Root>
    </div>

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <Popover.Root open>
      <Popover.Trigger asChild>
        <button className={styles.trigger}>open</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={5}>
          <Popover.Close className={styles.close}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow} width={20} height={10} offset={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h1 style={{ marginTop: 100 }}>State attributes</h1>
    <h2>Closed</h2>
    <Popover.Root open={false}>
      <Popover.Trigger className={styles.triggerAttr}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.contentAttr} sideOffset={5} avoidCollisions={false}>
          <Popover.Close className={styles.closeAttr}>close</Popover.Close>
          <Popover.Arrow className={styles.arrowAttr} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <h2>Open</h2>
    <Popover.Root open>
      <Popover.Trigger className={styles.triggerAttr}>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.contentAttr}
          side="right"
          sideOffset={5}
          avoidCollisions={false}
        >
          <Popover.Close className={styles.closeAttr}>close</Popover.Close>
          <Popover.Arrow className={styles.arrowAttr} width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };
