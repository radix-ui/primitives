import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import { Portal } from '@radix-ui/react-portal';
import * as Popper from '@radix-ui/react-popper';

export default { title: 'Components/Popper' };

export const Styled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={anchorClass()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className={contentClass()} sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <Popper.Arrow className={arrowClass()} width={20} height={10} />
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithCustomArrow = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={anchorClass()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className={contentClass()} side="right" sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <Popper.Arrow asChild offset={20}>
              <CustomArrow width={20} height={10} />
            </Popper.Arrow>
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const Animated = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={anchorClass()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal>
            <Popper.Content className={animatedContentClass()} sideOffset={5}>
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className={arrowClass()} width={20} height={10} offset={25} />
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithPortal = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={anchorClass()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal>
            <Popper.Content className={contentClass()} sideOffset={5}>
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className={arrowClass()} width={20} height={10} />
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithVirtualElement = () => {
  const mousePosRef = React.useRef({ x: 0, y: 0 });
  const virtualRef = React.useRef({
    getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...mousePosRef.current }),
  });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = { x: event.pageX, y: event.pageY };
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Popper.Root>
      <Popper.Anchor virtualRef={virtualRef} />
      <Popper.Content className={contentClass()} align="start" />
    </Popper.Root>
  );
};

const Scrollable = (props: any) => (
  <div
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    {...props}
  />
);

const CustomArrow = (props: any) => (
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

const RECOMMENDED_CSS__POPPER__CONTENT = {
  transformOrigin: 'var(--radix-popper-transform-origin)',
};

const contentClass = css({
  ...RECOMMENDED_CSS__POPPER__CONTENT,
  backgroundColor: '$gray100',
  width: 300,
  height: 150,
  padding: 10,
  borderRadius: 10,
});

const anchorClass = css({
  backgroundColor: 'hotpink',
  width: 100,
  height: 100,
});

const arrowClass = css({
  fill: '$gray100',
});

const rotateIn = keyframes({
  '0%': { transform: 'scale(0) rotateZ(calc(var(--direction, 0) * 45deg))' },
  '100%': { transform: 'scale(1)' },
});

const animatedContentClass = css(contentClass, {
  '&[data-side="top"]': { '--direction': '1' },
  '&[data-side="bottom"]': { '--direction': '-1' },
  animation: `${rotateIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
});
