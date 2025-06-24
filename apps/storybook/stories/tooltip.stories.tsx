import * as React from 'react';
import { Popper } from 'radix-ui/internal';
import { Dialog, Tooltip } from 'radix-ui';
import styles from './tooltip.stories.module.css';

const { SIDE_OPTIONS, ALIGN_OPTIONS } = Popper;

export default { title: 'Components/Tooltip' };

export const Styled = () => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.content} sideOffset={5}>
          Nicely done!
          <Tooltip.Arrow className={styles.arrow} offset={10} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Tooltip.Provider>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger style={{ margin: 100 }}>
          I'm controlled, look I'm {open ? 'open' : 'closed'}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const CustomDurations = () => (
  <Tooltip.Provider>
    <h1>Delay duration</h1>
    <h2>Default (700ms)</h2>

    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>

    <h2>Custom (0ms = instant open)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <h2>Custom (2s)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider delayDuration={2000}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <h1>Skip delay duration</h1>
    <h2>Default (300ms to move from one to another tooltip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>

    <h2>Custom (0ms to move from one to another tooltip = never skip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider skipDelayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <h2>Custom (5s to move from one to another tooltip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider skipDelayDuration={5000}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </Tooltip.Provider>
);

export const CustomContent = () => (
  <Tooltip.Provider>
    <div style={{ display: 'flex', gap: 20, padding: 100 }}>
      <Tooltip.Root>
        <Tooltip.Trigger>Heading</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <h1>Some heading</h1>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Paragraph</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <p>Some paragraph</p>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>List</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <ul>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
            </ul>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Article</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <article>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum, quae qui. Magnam
              delectus ex totam repellat amet distinctio unde, porro architecto voluptatibus nemo et
              nisi, voluptatem eligendi earum autem fugit.
            </article>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Figure</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <figure style={{ margin: 0 }}>
              <img
                src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
                alt=""
                width={100}
              />
              <figcaption>Colm Tuite</figcaption>
            </figure>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Time</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            {/* @ts-ignore */}
            <time datetime="2017-10-31T11:21:00+02:00">Tuesday, 31 October 2017</time>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Link</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            View in <a href="https://workos.com">WorkOS</a>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Form</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <form>
              <label htmlFor="fname">First name:</label>
              <br />
              <input type="text" id="fname" name="fname" />
              <br />
              <label htmlFor="lname">Last name:</label>
              <br />
              <input type="text" id="lname" name="lname" />
            </form>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Mini layout</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
                fontSize: 14,
              }}
            >
              Start video call
              <span style={{ display: 'block', color: '#999' }}>
                press{' '}
                <kbd
                  style={{
                    fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                  aria-label="c key"
                >
                  c
                </kbd>
              </span>
            </p>
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  </Tooltip.Provider>
);

export const Positions = () => (
  <Tooltip.Provider>
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(5, 50px)',
        }}
      >
        <SimpleTooltip label="Top start" side="top" align="start">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '2', gridRow: '1' }}
          >
            Top start
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Top center" side="top" align="center">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '3', gridRow: '1' }}
          >
            Top center
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Top end" side="top" align="end">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '4', gridRow: '1' }}
          >
            Top end
          </Tooltip.Trigger>
        </SimpleTooltip>

        <SimpleTooltip label="Right start" side="right" align="start">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '5', gridRow: '2' }}
            tabIndex={0}
          >
            Right start
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Right center" side="right" align="center">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '5', gridRow: '3' }}
            tabIndex={0}
          >
            Right center
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Right end" side="right" align="end">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '5', gridRow: '4' }}
            tabIndex={0}
          >
            Right end
          </Tooltip.Trigger>
        </SimpleTooltip>

        <SimpleTooltip label="Bottom end" side="bottom" align="end">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '4', gridRow: '5' }}
          >
            Bottom end
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Bottom center" side="bottom" align="center">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '3', gridRow: '5' }}
          >
            Bottom center
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Bottom start" side="bottom" align="start">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '2', gridRow: '5' }}
          >
            Bottom start
          </Tooltip.Trigger>
        </SimpleTooltip>

        <SimpleTooltip label="Left end" side="left" align="end">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '1', gridRow: '4' }}
          >
            Left end
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Left center" side="left" align="center">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '1', gridRow: '3' }}
          >
            Left center
          </Tooltip.Trigger>
        </SimpleTooltip>
        <SimpleTooltip label="Left start" side="left" align="start">
          <Tooltip.Trigger
            className={styles.positionButton}
            style={{ gridColumn: '1', gridRow: '2' }}
          >
            Left start
          </Tooltip.Trigger>
        </SimpleTooltip>
      </div>
    </div>
  </Tooltip.Provider>
);

export const AriaLabel = () => (
  <Tooltip.Provider>
    <p>The first button will display AND enunciate the label.</p>
    <p>The second button will display the label, but enunciate the aria label.</p>
    <div style={{ display: 'flex' }}>
      <SimpleTooltip label="Notifications">
        <Tooltip.Trigger style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </Tooltip.Trigger>
      </SimpleTooltip>

      <SimpleTooltip label="Notifications" aria-label="3 notifications">
        <Tooltip.Trigger style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </Tooltip.Trigger>
      </SimpleTooltip>
    </div>
  </Tooltip.Provider>
);

export const WithText = () => (
  <Tooltip.Provider>
    <p>
      Hello this is a test with{' '}
      <SimpleTooltip label="This is a tooltip">
        <Tooltip.Trigger asChild>
          <a href="https://workos.com">Tooltip.Root</a>
        </Tooltip.Trigger>
      </SimpleTooltip>{' '}
      inside a Text Component{' '}
      <SimpleTooltip label="This is a tooltip" side="top">
        <Tooltip.Trigger asChild>
          <a href="https://workos.com">Tooltip.Root</a>
        </Tooltip.Trigger>
      </SimpleTooltip>{' '}
      some more text{' '}
      <SimpleTooltip label="This is a tooltip" side="right" align="center">
        <Tooltip.Trigger asChild>
          <a href="https://workos.com">Tooltip.Root</a>
        </Tooltip.Trigger>
      </SimpleTooltip>{' '}
    </p>
  </Tooltip.Provider>
);

export const WithExternalRef = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.boxShadow = '0 0 0 2px red';
    }
  });

  return (
    <Tooltip.Provider>
      <SimpleTooltip label="Save document" side="bottom" align="end">
        <Tooltip.Trigger ref={buttonRef} type="button" style={{ margin: 100 }}>
          Save
        </Tooltip.Trigger>
      </SimpleTooltip>
    </Tooltip.Provider>
  );
};

export const Unmount = () => {
  const [isMounted, setIsMounted] = React.useState(true);
  return (
    <Tooltip.Provider>
      <ul>
        <li>Focus the first button (tooltip 1 shows)</li>
        <li>Focus the second button (tooltip 2 shows)</li>
        <li>Press escape (second button unmounts)</li>
        <li>Focus the first button (tooltip 1 should still show)</li>
      </ul>
      <SimpleTooltip label="tooltip 1">
        <Tooltip.Trigger style={{ alignSelf: 'flex-start', margin: '0vmin' }}>
          Tool 1
        </Tooltip.Trigger>
      </SimpleTooltip>

      {isMounted && (
        <SimpleTooltip label="tooltip 2">
          <Tooltip.Trigger
            style={{ alignSelf: 'flex-start', margin: '0vmin' }}
            onKeyDown={(event) => event.key === 'Escape' && setIsMounted(false)}
          >
            Tool 2
          </Tooltip.Trigger>
        </SimpleTooltip>
      )}
    </Tooltip.Provider>
  );
};

export const Animated = () => {
  const contentClass = [styles.content, styles.animatedContent].join(' ');
  return (
    <Tooltip.Provider>
      <div style={{ padding: 100 }}>
        <SimpleTooltip className={contentClass} label="Hello world 1">
          <Tooltip.Trigger style={{ marginRight: 10 }}>Hello 1</Tooltip.Trigger>
        </SimpleTooltip>

        <SimpleTooltip className={contentClass} label="Hello world 2" side="top">
          <Tooltip.Trigger>Hello 2</Tooltip.Trigger>
        </SimpleTooltip>
      </div>
    </Tooltip.Provider>
  );
};

export const SlottableContent = () => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content asChild sideOffset={5}>
          <div className={styles.content}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </div>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const WithinDialog = () => (
  <Tooltip.Provider>
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Dialog title</Dialog.Title>
        <Dialog.Description>Dialog description</Dialog.Description>
        <Dialog.Close>Close dialog</Dialog.Close>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Dialog.Content>
    </Dialog.Root>
  </Tooltip.Provider>
);

export const KeepOpenOnActivation = () => {
  const triggerRef = React.useRef(null);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          ref={triggerRef}
          className={styles.trigger}
          onClick={(event) => event.preventDefault()}
        >
          Hover or Focus me
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={styles.content}
            sideOffset={5}
            onPointerDownOutside={(event) => {
              if (event.target === triggerRef.current) event.preventDefault();
            }}
          >
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const WithinScrollable = () => (
  <Tooltip.Provider>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 500,
        width: 300,
        border: '1px solid black',
        overflow: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 600 }}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </div>
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150vh' }}
    >
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Nicely done!
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  </Tooltip.Provider>
);

export const DisableHoverableContent = () => (
  <>
    <h1>Hoverable content (Default)</h1>
    <p>Content remains open while moving pointer to it</p>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider skipDelayDuration={1000}>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <h1>Disable hoverable content</h1>
    <p>Tooltip closes when pointer leaves the trigger</p>
    <h2>Inherited from provider</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider delayDuration={0} disableHoverableContent>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
    <h2>Inherited value overridden by prop on tooltip</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip.Provider delayDuration={0} disableHoverableContent>
        <Tooltip.Root>
          <Tooltip.Trigger className={styles.trigger}>Disabled hoverable content</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root disableHoverableContent={false}>
          <Tooltip.Trigger className={styles.trigger}>Hoverable content</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </>
);

// change order slightly for more pleasing visual
const SIDES = [...SIDE_OPTIONS.filter((side) => side !== 'bottom'), 'bottom' as const];

export const Chromatic = () => (
  <Tooltip.Provider>
    <div style={{ padding: 200 }}>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <h2 style={{ marginBottom: 60 }}>Open</h2>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <h2 style={{ marginTop: 60, marginBottom: 60 }}>Open with reordered parts</h2>
      <Tooltip.Root defaultOpen>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
      </Tooltip.Root>

      <h1 style={{ marginTop: 100 }}>Controlled</h1>
      <h2>Closed</h2>
      <Tooltip.Root open={false}>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <h2 style={{ marginBottom: 60 }}>Open</h2>
      <Tooltip.Root open>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <h2 style={{ marginTop: 60, marginBottom: 60 }}>Open with reordered parts</h2>
      <Tooltip.Root open>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
        <Tooltip.Trigger className={styles.trigger}>open</Tooltip.Trigger>
      </Tooltip.Root>

      <h1 style={{ marginTop: 100 }}>Positioning</h1>
      <h2>No collisions</h2>
      <h3>Side & Align</h3>
      <div className={styles.grid}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <Tooltip.Root key={`${side}-${align}`} open>
              <Tooltip.Trigger className={styles.chromaticTrigger} />
              <Tooltip.Portal>
                <Tooltip.Content
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
                  <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))
        )}
      </div>

      <h3>Side offset</h3>
      <h4>Positive</h4>
      <div className={styles.grid}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <Tooltip.Root key={`${side}-${align}`} open>
              <Tooltip.Trigger className={styles.chromaticTrigger} />
              <Tooltip.Portal>
                <Tooltip.Content
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
                  <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={styles.grid}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <Tooltip.Root key={`${side}-${align}`} open>
              <Tooltip.Trigger className={styles.chromaticTrigger} />
              <Tooltip.Portal>
                <Tooltip.Content
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
                  <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))
        )}
      </div>

      <h3>Align offset</h3>
      <h4>Positive</h4>
      <div className={styles.grid}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <Tooltip.Root key={`${side}-${align}`} open>
              <Tooltip.Trigger className={styles.chromaticTrigger} />
              <Tooltip.Portal>
                <Tooltip.Content
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
                  <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={styles.grid}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <Tooltip.Root key={`${side}-${align}`} open>
              <Tooltip.Trigger className={styles.chromaticTrigger} />
              <Tooltip.Portal>
                <Tooltip.Content
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
                  <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))
        )}
      </div>

      <h2>Collisions</h2>
      <p>See instances on the periphery of the page.</p>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip.Root key={`${side}-${align}`} open>
            <Tooltip.Trigger
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
            <Tooltip.Portal>
              <Tooltip.Content className={styles.chromaticContent} side={side} align={align}>
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <Tooltip.Arrow className={styles.chromaticArrow} width={20} height={10} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))
      )}

      <h2 style={{ marginTop: 50, marginBottom: 60 }}>Relative parent (non-portalled)</h2>
      <div style={{ position: 'relative' }}>
        <Tooltip.Provider>
          <Tooltip.Root open>
            <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
            <Tooltip.Content className={styles.content} sideOffset={5}>
              Nicely done!
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      <h1 style={{ marginTop: 100, marginBottom: 60 }}>With slotted trigger</h1>
      <Tooltip.Root open>
        <Tooltip.Trigger asChild>
          <button className={styles.trigger}>open</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            Some content
            <Tooltip.Arrow className={styles.arrow} width={20} height={10} offset={10} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <h1 style={{ marginTop: 100, marginBottom: 60 }}>With slotted content</h1>
      <Tooltip.Root open>
        <Tooltip.Trigger className={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content asChild sideOffset={5}>
            <div className={styles.content}>
              Some content
              <Tooltip.Arrow className={styles.arrow} offset={10} />
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  </Tooltip.Provider>
);
Chromatic.parameters = { chromatic: { disable: false } };

function SimpleTooltip({
  children,
  label,
  'aria-label': ariaLabel,
  open,
  onOpenChange,
  ...props
}: any) {
  return (
    <Tooltip.Root open={open} onOpenChange={onOpenChange}>
      {children}
      <Tooltip.Portal>
        <Tooltip.Content
          className={styles.content}
          sideOffset={5}
          aria-label={ariaLabel}
          {...props}
        >
          {label}
          <Tooltip.Arrow className={styles.arrow} offset={10} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
