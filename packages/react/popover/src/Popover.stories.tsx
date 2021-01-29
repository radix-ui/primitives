import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverArrow } from './Popover';
import { Arrow } from '@radix-ui/react-arrow';
import { styled, css } from '../../../../stitches.config';
import { Slot } from '@radix-ui/react-slot';

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverContent as={StyledContent} sideOffset={5}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverContent>
      </Popover>
      <input />
    </div>
  );
};

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger as={StyledTrigger}>{open ? 'close' : 'open'}</PopoverTrigger>
        <PopoverContent as={StyledContent}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverContent>
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
        <PopoverContent as={AnimatedContent} sideOffset={10}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverContent>
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
        <PopoverContent as={StyledContent} sideOffset={10} forceMount>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} />
        </PopoverContent>
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

        <PopoverContent as={StyledContent} sideOffset={5} css={{ backgroundColor: '$red' }}>
          <Popover>
            <PopoverTrigger as={StyledTrigger}>Open nested popover</PopoverTrigger>
            <PopoverContent
              as={StyledContent}
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
            </PopoverContent>
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
        </PopoverContent>
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
        <PopoverContent
          as={StyledContent}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
          css={{ borderRadius: 0, width: 200, height: 100 }}
        >
          <PopoverClose>close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const NonModal = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger as={StyledTrigger}>open</PopoverTrigger>
        <PopoverContent as={StyledContent} sideOffset={5} trapFocus={false}>
          <PopoverClose as={StyledClose}>close</PopoverClose>
          <PopoverArrow as={StyledArrow} width={20} height={10} offset={10} />
        </PopoverContent>
      </Popover>
      <input style={{ marginLeft: 10 }} />
    </>
  );
};

export const WithSlottedTrigger = () => {
  return (
    <Popover>
      <PopoverTrigger as={Slot}>
        <StyledTrigger onClick={() => console.log('StyledTrigger click')}>open</StyledTrigger>
      </PopoverTrigger>
      <PopoverContent as={StyledContent} sideOffset={5}>
        <PopoverClose as={StyledClose}>close</PopoverClose>
        <PopoverArrow as={StyledArrow} width={20} height={10} offset={10} />
      </PopoverContent>
    </Popover>
  );
};

const StyledTrigger = styled('button', {});

const RECOMMENDED_CSS__POPOVER__CONTENT = {
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
};

const StyledContent = styled('div', {
  ...RECOMMENDED_CSS__POPOVER__CONTENT,
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

const AnimatedContent = styled(StyledContent, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});
