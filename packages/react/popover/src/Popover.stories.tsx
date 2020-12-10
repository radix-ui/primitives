import * as React from 'react';
import { Popover, PopoverTrigger, PopoverPopper, PopoverClose, PopoverArrow } from './Popover';
import { Arrow } from '@interop-ui/react-arrow';
import { styled, css } from '../../../../stitches.config';

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverPopper as={StyledPopper} sideOffset={5}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverPopper>
      </Popover>
    </div>
  );
};

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover isOpen={isOpen} onIsOpenChange={setIsOpen}>
        <PopoverTrigger as={StyledTrigger}>{isOpen ? 'close' : 'open'}</PopoverTrigger>
        <PopoverPopper as={StyledPopper}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverPopper>
      </Popover>
    </div>
  );
};

export const Animated = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverPopper as={AnimatedPopper} sideOffset={10}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverPopper>
      </Popover>
    </div>
  );
};

export const ForcedMount = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverPopper as={StyledPopper} sideOffset={10} forceMount>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverPopper>
      </Popover>
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

      <Popover>
        <PopoverTrigger as={StyledTrigger} ref={buttonRef}>
          Open popover
        </PopoverTrigger>

        <PopoverPopper as={StyledPopper} sideOffset={5} css={{ backgroundColor: '$red' }}>
          <Popover>
            <PopoverTrigger as={StyledTrigger}>Open nested popover</PopoverTrigger>
            <PopoverPopper
              as={StyledPopper}
              side="top"
              align="center"
              sideOffset={5}
              css={{ backgroundColor: '$green' }}
            >
              <PopoverClose as={StyledClose}>close</PopoverClose>
              <PopoverArrow
                as={StyledArrow}
                width={20}
                height={10}
                offset={20}
                css={{ fill: '$green' }}
              />
            </PopoverPopper>
          </Popover>

          <PopoverClose as={StyledClose} css={{ marginLeft: 10 }}>
            close
          </PopoverClose>
          <PopoverArrow
            as={StyledArrow}
            width={20}
            height={10}
            offset={20}
            css={{ fill: '$red' }}
          />
        </PopoverPopper>
      </Popover>
    </div>
  );
};

export const CustomAnchor = () => {
  const itemBoxRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemBoxRef}
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
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverPopper
          as={StyledPopper}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
          css={{ borderRadius: 0, width: 200, height: 100 }}
        >
          <PopoverClose>close</PopoverClose>
        </PopoverPopper>
      </Popover>
    </div>
  );
};

export const NonModal = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverPopper as={StyledPopper} sideOffset={5} trapFocus={false}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} offset={10} />
        </PopoverPopper>
      </Popover>
      <input style={{ marginLeft: 10 }} />
    </>
  );
};

const StyledTrigger = styled('button', {});

const RECOMMENDED_CSS__POPOVER__POPPER = {
  transformOrigin: 'var(--radix-popover-popper-transform-origin)',
};

const StyledPopper = styled('div', {
  ...RECOMMENDED_CSS__POPOVER__POPPER,
  backgroundColor: '$gray300',
  padding: 20,
  borderRadius: 5,
});

const StyledClose = styled('button', {});

const StyledArrow = styled(Arrow, {
  fill: '$gray300',
});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const AnimatedPopper = styled(StyledPopper, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});
