import * as React from 'react';
import { Popper, styles } from './Popper';
import { Portal } from '@interop-ui/react-portal';
import { createStyled } from '@stitches/react';

const { styled, css } = createStyled({});

export default { title: 'Popper' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Popper anchorRef={anchorRef} style={styles.root}>
          <Popper.Content as={Content}>
            <button onClick={() => setIsOpen(false)}>close</button>
          </Popper.Content>
          <Popper.Arrow width={50} height={20} style={styles.arrow} />
        </Popper>
      )}
    </Scrollable>
  );
};

export const WithPortal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Portal>
          <Popper anchorRef={anchorRef} style={styles.root}>
            <Popper.Content as={Content}>
              <button onClick={() => setIsOpen(false)}>close</button>
            </Popper.Content>
            <Popper.Arrow width={50} height={20} style={styles.arrow} />
          </Popper>
        </Portal>
      )}
    </Scrollable>
  );
};

export const WithCustomArrow = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Popper anchorRef={anchorRef} side="right" style={styles.root}>
          <Popper.Content as={Content}>
            <button onClick={() => setIsOpen(false)}>close</button>
          </Popper.Content>
          <Popper.Arrow as={MyArrow} width={50} height={20} style={styles.arrow} />
        </Popper>
      )}
    </Scrollable>
  );
};

const slideDown = css.keyframes({
  '0%': { transform: 'translateY(-100px)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

const AnimatedPopper = styled('div', {
  ...styles.root,
  animation: `${slideDown} 200ms`,
});

export const Animated = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Portal>
          <Popper as={AnimatedPopper} anchorRef={anchorRef}>
            <Popper.Content as={Content}>
              <button onClick={() => setIsOpen(false)}>close</button>
            </Popper.Content>
            <Popper.Arrow width={50} height={20} style={styles.arrow} />
          </Popper>
        </Portal>
      )}
    </Scrollable>
  );
};

const Scrollable = (props: any) => (
  <div
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    {...props}
  />
);

const Anchor = React.forwardRef<HTMLDivElement, any>((props, forwardedRef) => (
  <div ref={forwardedRef} style={{ backgroundColor: 'hotpink', width: 100, height: 100 }}>
    <button {...props}>open</button>
  </div>
));

const Content = React.forwardRef<HTMLDivElement, any>((props, forwardedRef) => (
  <div
    style={{ ...styles.content, backgroundColor: '#eee', width: 250, height: 150 }}
    ref={forwardedRef}
    {...props}
  />
));

function MyArrow(props: any) {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        width: 20,
        height: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'tomato',
      }}
    />
  );
}
