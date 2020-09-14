import * as React from 'react';
import { Tooltip, styles } from './Tooltip';

export default { title: 'Tooltip' };

export const Basic = () => (
  <Tooltip>
    <Tooltip.Target style={{ margin: 100 }}>Hover or Focus me</Tooltip.Target>
    <Tooltip.Position sideOffset={5}>
      <Tooltip.Content as={Content} aria-label="Even better done this way!">
        Nicely done!
      </Tooltip.Content>
      <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
    </Tooltip.Position>
  </Tooltip>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Tooltip isOpen={isOpen} onIsOpenChange={setIsOpen}>
      <Tooltip.Target style={{ margin: 100 }}>
        I'm controlled, look I'm {isOpen ? 'open' : 'closed'}
      </Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>Nicely done!</Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>
  );
};

export const CustomContent = () => (
  <div style={{ display: 'flex', gap: 20, padding: 100 }}>
    <Tooltip>
      <Tooltip.Target>Heading</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <h1>Some heading</h1>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Paragraph</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <p>Some paragraph</p>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>List</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Article</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <article>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum, quae qui. Magnam
            delectus ex totam repellat amet distinctio unde, porro architecto voluptatibus nemo et
            nisi, voluptatem eligendi earum autem fugit.
          </article>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Figure</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <figure style={{ margin: 0 }}>
            <img
              src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
              alt=""
              width={100}
            />
            <figcaption>Colm Tuite</figcaption>
          </figure>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Time</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          {/* @ts-ignore */}
          <time datetime="2017-10-31T11:21:00+02:00">Tuesday, 31 October 2017</time>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Link</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          View in <a href="https://modulz.app">Modulz</a>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Form</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
          <form>
            <label htmlFor="fname">First name:</label>
            <br />
            <input type="text" id="fname" name="fname" />
            <br />
            <label htmlFor="lname">Last name:</label>
            <br />
            <input type="text" id="lname" name="lname" />
          </form>
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>

    <Tooltip>
      <Tooltip.Target>Mini layout</Tooltip.Target>
      <Tooltip.Position sideOffset={5}>
        <Tooltip.Content as={Content}>
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
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>
  </div>
);

export const Positions = () => (
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
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '2', gridRow: '1' }}>
          Top start
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Top center" side="top" align="center">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '3', gridRow: '1' }}>
          Top center
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Top end" side="top" align="end">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '4', gridRow: '1' }}>
          Top end
        </Tooltip.Target>
      </SimpleTooltip>

      <SimpleTooltip label="Right start" side="right" align="start">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '5', gridRow: '2' }} tabIndex={0}>
          Right start
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Right center" side="right" align="center">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '5', gridRow: '3' }} tabIndex={0}>
          Right center
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Right end" side="right" align="end">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '5', gridRow: '4' }} tabIndex={0}>
          Right end
        </Tooltip.Target>
      </SimpleTooltip>

      <SimpleTooltip label="Bottom end" side="bottom" align="end">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '4', gridRow: '5' }}>
          Bottom end
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Bottom center" side="bottom" align="center">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '3', gridRow: '5' }}>
          Bottom center
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Bottom start" side="bottom" align="start">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '2', gridRow: '5' }}>
          Bottom start
        </Tooltip.Target>
      </SimpleTooltip>

      <SimpleTooltip label="Left end" side="left" align="end">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '1', gridRow: '4' }}>
          Left end
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Left center" side="left" align="center">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '1', gridRow: '3' }}>
          Left center
        </Tooltip.Target>
      </SimpleTooltip>
      <SimpleTooltip label="Left start" side="left" align="start">
        <Tooltip.Target as={PositionButton} style={{ gridColumn: '1', gridRow: '2' }}>
          Left start
        </Tooltip.Target>
      </SimpleTooltip>
    </div>
  </div>
);

export const AriaLabel = () => (
  <>
    <p>The first button will display AND enunciate the label.</p>
    <p>The second button will display the label, but enunciate the aria label.</p>
    <div style={{ display: 'flex' }}>
      <SimpleTooltip label="Notifications">
        <Tooltip.Target style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </Tooltip.Target>
      </SimpleTooltip>

      <SimpleTooltip label="Notifications" aria-label="3 notifications">
        <Tooltip.Target style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </Tooltip.Target>
      </SimpleTooltip>
    </div>
  </>
);

export const WithText = () => (
  <p>
    Hello this is a test with{' '}
    <SimpleTooltip label="This is a tooltip">
      <Tooltip.Target as="a" href="https://modulz.app">
        Tooltip
      </Tooltip.Target>
    </SimpleTooltip>{' '}
    inside a Text Component{' '}
    <SimpleTooltip label="This is a tooltip" side="top">
      <Tooltip.Target as="a" href="https://modulz.app">
        Tooltip
      </Tooltip.Target>
    </SimpleTooltip>{' '}
    some more text{' '}
    <SimpleTooltip label="This is a tooltip" side="right" align="center">
      <Tooltip.Target as="a" href="https://modulz.app">
        Tooltip
      </Tooltip.Target>
    </SimpleTooltip>{' '}
  </p>
);

export const WithExternalRef = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.boxShadow = '0 0 0 2px red';
    }
  });

  return (
    <SimpleTooltip label="Save document" side="bottom" align="end">
      <Tooltip.Target ref={buttonRef} type="button" style={{ margin: 100 }}>
        Save
      </Tooltip.Target>
    </SimpleTooltip>
  );
};

export const Unmount = () => {
  const [isMounted, setIsMounted] = React.useState(true);
  return (
    <>
      <ul>
        <li>Focus the first button (tooltip 1 shows)</li>
        <li>Focus the second button (tooltip 2 shows)</li>
        <li>Press escape (second button unmounts)</li>
        <li>Focus the first button (tooltip 1 should still show)</li>
      </ul>
      <SimpleTooltip label="tooltip 1">
        <Tooltip.Target style={{ alignSelf: 'flex-start', margin: '0vmin' }}>Tool 1</Tooltip.Target>
      </SimpleTooltip>

      {isMounted && (
        <SimpleTooltip label="tooltip 2">
          <Tooltip.Target
            style={{ alignSelf: 'flex-start', margin: '0vmin' }}
            onKeyDown={(event) => event.key === 'Escape' && setIsMounted(false)}
          >
            Tool 2
          </Tooltip.Target>
        </SimpleTooltip>
      )}
    </>
  );
};

function SimpleTooltip({
  children,
  label,
  'aria-label': ariaLabel,
  isOpen,
  onOpenChange,
  ...props
}: any) {
  return (
    <Tooltip isOpen={isOpen} onIsOpenChange={onOpenChange}>
      {children}
      <Tooltip.Position sideOffset={5} {...props}>
        <Tooltip.Content as={Content} aria-label={ariaLabel}>
          {label}
        </Tooltip.Content>
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Position>
    </Tooltip>
  );
}

const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<'div'>>(
  (props, forwardedRef) => (
    <div
      ref={forwardedRef}
      {...props}
      style={{
        ...styles.root,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 5,
        padding: 10,
        maxWidth: 300,
        ...props.style,
      }}
    />
  )
);

const PositionButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithRef<'button'>>(
  (props, forwardedRef) => (
    <button
      {...props}
      ref={forwardedRef}
      style={{ ...props.style, margin: 5, border: '1px solid black', background: 'transparent' }}
    />
  )
);
