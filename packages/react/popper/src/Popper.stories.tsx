import * as React from 'react';
import { Popper, PopperArrow } from './Popper';
import { Portal } from '@radix-ui/react-portal';
import { Arrow } from '@radix-ui/react-arrow';
import { styled, css } from '../../../../stitches.config';

export default { title: 'Components/Popper' };

export const Styled = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setOpen(true)} />

      {open && (
        <Popper as={StyledRoot} anchorRef={anchorRef} sideOffset={5}>
          <button onClick={() => setOpen(false)}>close</button>
          <PopperArrow as={StyledArrow} width={20} height={10} />
        </Popper>
      )}
    </Scrollable>
  );
};

export const WithCustomArrow = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setOpen(true)} />

      {open && (
        <Popper as={StyledRoot} anchorRef={anchorRef} side="right" sideOffset={5}>
          <button onClick={() => setOpen(false)}>close</button>
          <PopperArrow as={CustomArrow} width={20} height={10} offset={20} />
        </Popper>
      )}
    </Scrollable>
  );
};

export const Animated = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setOpen(true)} />

      {open && (
        <Portal>
          <Popper as={AnimatedPopper} anchorRef={anchorRef} sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <PopperArrow as={StyledArrow} width={20} height={10} offset={25} />
          </Popper>
        </Portal>
      )}
    </Scrollable>
  );
};

export const WithPortal = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <Scrollable>
      <Anchor ref={anchorRef} onClick={() => setOpen(true)} />

      {open && (
        <Portal>
          <Popper as={StyledRoot} anchorRef={anchorRef} sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <PopperArrow as={StyledArrow} width={20} height={10} />
          </Popper>
        </Portal>
      )}
    </Scrollable>
  );
};

export const WithVirtualElement = () => {
  const mousePosRef = React.useRef({ x: 0, y: 0 });
  const anchorRef = React.useRef({
    getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...mousePosRef.current }),
  });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = { x: event.pageX, y: event.pageY };
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <Popper as={StyledRoot} anchorRef={anchorRef} align="start" />;
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

function CustomArrow(props: any) {
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

const RECOMMENDED_CSS__POPPER__ROOT = {
  transformOrigin: 'var(--radix-popper-transform-origin)',
};

const StyledRoot = styled('div', {
  ...RECOMMENDED_CSS__POPPER__ROOT,
  backgroundColor: '$gray100',
  width: 300,
  height: 150,
  padding: 10,
  borderRadius: 10,
});

const StyledArrow = styled(Arrow, {
  fill: '$gray100',
});

const rotateIn = css.keyframes({
  '0%': { transform: 'scale(0) rotateZ(calc(var(--direction, 0) * 45deg))' },
  '100%': { transform: 'scale(1)' },
});

const AnimatedPopper = styled(StyledRoot, {
  '&[data-side="top"]': { '--direction': '1' },
  '&[data-side="bottom"]': { '--direction': '-1' },
  animation: `${rotateIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
});
