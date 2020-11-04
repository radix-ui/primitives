import * as React from 'react';
import { Popper, styles } from './Popper';
import { Portal } from '@interop-ui/react-portal';
import { styled, css } from '../../../../stitches.config';

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

export const Animated = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Portal>
          <Popper as={AnimatedPopper} anchorRef={anchorRef} sideOffset={10}>
            <Popper.Content as={Content}>
              <button onClick={() => setIsOpen(false)}>close</button>
            </Popper.Content>
            <Popper.Arrow width={50} height={20} style={styles.arrow} offset={25} />
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

const rotateIn = css.keyframes({
  '0%': { transform: 'scale(0) rotateZ(calc(var(--direction, 0) * 45deg))' },
  '100%': { transform: 'scale(1)' },
});

const AnimatedPopper = styled('div', {
  ...styles.root,
  '&[data-side="top"]': { '--direction': '1' },
  '&[data-side="bottom"]': { '--direction': '-1' },
  animation: `${rotateIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
});
