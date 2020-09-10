import * as React from 'react';
import { Tooltip, styles } from './Tooltip';

export default { title: 'Tooltip' };

export const Basic = () => (
  <Tooltip>
    <Tooltip.Target style={{ margin: 100 }}>Hover or Focus me</Tooltip.Target>
    <Tooltip.Content as={Content} sideOffset={5}>
      <Tooltip.Label label="Nicely done!" />
      <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
    </Tooltip.Content>
  </Tooltip>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Tooltip isOpen={isOpen} onIsOpenChange={setIsOpen}>
      <Tooltip.Target style={{ margin: 100 }}>
        I'm controlled, look I'm {isOpen ? 'open' : 'closed'}
      </Tooltip.Target>
      <Tooltip.Content as={Content} sideOffset={5}>
        <Tooltip.Label label="Nicely done!" />
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Content>
    </Tooltip>
  );
};

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

      <SimpleTooltip label="Notifications" ariaLabel="3 notifications">
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

function SimpleTooltip({ children, label, ariaLabel, isOpen, onOpenChange, ...props }: any) {
  return (
    <Tooltip isOpen={isOpen} onIsOpenChange={onOpenChange}>
      {children}
      <Tooltip.Content as={Content} sideOffset={5} {...props}>
        <Tooltip.Label label={label} ariaLabel={ariaLabel} />
        <Tooltip.Arrow style={{ ...styles.arrow }} offset={10} />
      </Tooltip.Content>
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
        ...props.style,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 2,
        padding: 5,
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
