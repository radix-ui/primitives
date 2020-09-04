import * as React from 'react';
import { Tooltip as TooltipPrimitive, styles } from './Tooltip';

export default { title: 'Tooltip' };

function Tooltip({ children, label, ariaLabel, isOpen, onOpenChange, ...props }: any) {
  return (
    <TooltipPrimitive isOpen={isOpen} onOpenChange={onOpenChange}>
      <TooltipPrimitive.Target>{children}</TooltipPrimitive.Target>
      <TooltipPrimitive.Content
        sideOffset={5}
        {...props}
        style={{
          ...styles.root,
          ...props.style,
          backgroundColor: 'black',
          color: 'white',
          borderRadius: 2,
          padding: 5,
        }}
      >
        <TooltipPrimitive.Label label={label} ariaLabel={ariaLabel} />
        <TooltipPrimitive.Arrow style={{ ...styles.arrow }} offset={10} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive>
  );
}

export const Basic = () => (
  <Tooltip label="hello">
    <button type="button" style={{ margin: 100 }}>
      Button with styled Tooltip
    </button>
  </Tooltip>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Tooltip
      label="Save document"
      side="bottom"
      align="end"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <button type="button" style={{ margin: 100 }}>
        Save
      </button>
    </Tooltip>
  );
};

const PositionButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithRef<'button'>>(
  (props, forwardedRef) => (
    <button
      {...props}
      ref={forwardedRef}
      style={{ ...props.style, margin: 5, border: '1px solid black', background: 'transparent' }}
    />
  )
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
      <Tooltip label="Top start" side="top" align="start">
        <PositionButton style={{ gridColumn: '2', gridRow: '1' }}>Top start</PositionButton>
      </Tooltip>
      <Tooltip label="Top center" side="top" align="center">
        <PositionButton style={{ gridColumn: '3', gridRow: '1' }}>Top center</PositionButton>
      </Tooltip>
      <Tooltip label="Top end" side="top" align="end">
        <PositionButton style={{ gridColumn: '4', gridRow: '1' }}>Top end</PositionButton>
      </Tooltip>

      <Tooltip label="Right start" side="right" align="start">
        <PositionButton style={{ gridColumn: '5', gridRow: '2' }} tabIndex={0}>
          Right start
        </PositionButton>
      </Tooltip>
      <Tooltip label="Right center" side="right" align="center">
        <PositionButton style={{ gridColumn: '5', gridRow: '3' }} tabIndex={0}>
          Right center
        </PositionButton>
      </Tooltip>
      <Tooltip label="Right end" side="right" align="end">
        <PositionButton style={{ gridColumn: '5', gridRow: '4' }} tabIndex={0}>
          Right end
        </PositionButton>
      </Tooltip>

      <Tooltip label="Bottom end" side="bottom" align="end">
        <PositionButton style={{ gridColumn: '4', gridRow: '5' }}>Bottom end</PositionButton>
      </Tooltip>
      <Tooltip label="Bottom center" side="bottom" align="center">
        <PositionButton style={{ gridColumn: '3', gridRow: '5' }}>Bottom center</PositionButton>
      </Tooltip>
      <Tooltip label="Bottom start" side="bottom" align="start">
        <PositionButton style={{ gridColumn: '2', gridRow: '5' }}>Bottom start</PositionButton>
      </Tooltip>

      <Tooltip label="Left end" side="left" align="end">
        <PositionButton style={{ gridColumn: '1', gridRow: '4' }}>Left end</PositionButton>
      </Tooltip>
      <Tooltip label="Left center" side="left" align="center">
        <PositionButton style={{ gridColumn: '1', gridRow: '3' }}>Left center</PositionButton>
      </Tooltip>
      <Tooltip label="Left start" side="left" align="start">
        <PositionButton style={{ gridColumn: '1', gridRow: '2' }}>Left start</PositionButton>
      </Tooltip>
    </div>
  </div>
);

export const AriaLabel = () => (
  <>
    <p>The first button will display AND enunciate the label.</p>
    <p>The second button will display the label, but enunciate the aria label.</p>
    <div style={{ display: 'flex' }}>
      <Tooltip label="Notifications">
        <button type="button" style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </button>
      </Tooltip>

      <Tooltip label="Notifications" ariaLabel="3 notifications">
        <button type="button" style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </button>
      </Tooltip>
    </div>
  </>
);

export const WithText = () => (
  <p>
    Hello this is a test with{' '}
    <Tooltip label="This is a tooltip">
      <a href="https://modulz.app">Tooltip</a>
    </Tooltip>{' '}
    inside a Text Component{' '}
    <Tooltip label="This is a tooltip" side="top">
      <a href="https://modulz.app">Tooltip</a>
    </Tooltip>{' '}
    some more text{' '}
    <Tooltip label="This is a tooltip" side="right" align="center">
      <a href="https://modulz.app">Tooltip</a>
    </Tooltip>{' '}
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
    <Tooltip label="Save document" side="bottom" align="end">
      <button ref={buttonRef} type="button" style={{ margin: 100 }}>
        Save
      </button>
    </Tooltip>
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
      <Tooltip label="tooltip 1">
        <button type="button" style={{ alignSelf: 'flex-start', margin: '0vmin' }}>
          Tool 1
        </button>
      </Tooltip>

      {isMounted && (
        <Tooltip label="tooltip 2">
          <button
            type="button"
            style={{ alignSelf: 'flex-start', margin: '0vmin' }}
            onKeyDown={(event) => event.key === 'Escape' && setIsMounted(false)}
          >
            Tool 2
          </button>
        </Tooltip>
      )}
    </>
  );
};
