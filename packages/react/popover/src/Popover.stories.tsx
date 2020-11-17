import * as React from 'react';
import { Popover } from './Popover';
import { Arrow } from '@interop-ui/react-arrow';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Popover' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <Popover.Trigger as={StyledTrigger}>open</Popover.Trigger>
        <Popover.Popper as={StyledPopper} sideOffset={5}>
          <Popover.Content as={StyledContent}>
            <Popover.Close as={StyledClose}>close</Popover.Close>
          </Popover.Content>
          <Popover.Arrow as={StyledArrow} width={20} height={10} />
        </Popover.Popper>
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
        <Popover.Trigger as={StyledTrigger}>{isOpen ? 'close' : 'open'}</Popover.Trigger>
        <Popover.Popper as={StyledPopper}>
          <Popover.Content as={StyledContent}>
            <Popover.Close as={StyledClose}>close</Popover.Close>
          </Popover.Content>
          <Popover.Arrow as={StyledArrow} width={20} height={10} />
        </Popover.Popper>
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
        <Popover.Trigger as={StyledTrigger} ref={buttonRef}>
          Open popover
        </Popover.Trigger>

        <Popover.Popper as={StyledPopper} sideOffset={5}>
          <Popover.Content as={StyledContent} css={{ backgroundColor: '$red' }}>
            <Popover>
              <Popover.Trigger as={StyledTrigger}>Open nested popover</Popover.Trigger>
              <Popover.Popper as={StyledPopper} side="top" align="center" sideOffset={5}>
                <Popover.Content as={StyledContent} css={{ backgroundColor: '$green' }}>
                  <Popover.Close as={StyledClose}>close</Popover.Close>
                </Popover.Content>
                <Popover.Arrow
                  as={StyledArrow}
                  width={20}
                  height={10}
                  offset={20}
                  css={{ fill: '$green' }}
                />
              </Popover.Popper>
            </Popover>

            <Popover.Close as={StyledClose} css={{ marginLeft: 10 }}>
              close
            </Popover.Close>
          </Popover.Content>
          <Popover.Arrow
            as={StyledArrow}
            width={20}
            height={10}
            offset={20}
            css={{ fill: '$red' }}
          />
        </Popover.Popper>
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
        <Popover.Trigger as={StyledTrigger}>open</Popover.Trigger>
        <Popover.Popper
          as={StyledPopper}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
        >
          <Popover.Content as={StyledContent} css={{ borderRadius: 0, width: 200, height: 100 }}>
            <Popover.Close>close</Popover.Close>
          </Popover.Content>
        </Popover.Popper>
      </Popover>
    </div>
  );
};

export const NonModal = () => {
  return (
    <>
      <Popover>
        <Popover.Trigger as={StyledTrigger}>open</Popover.Trigger>
        <Popover.Popper as={StyledPopper} sideOffset={5} trapFocus={false}>
          <Popover.Content as={StyledContent}>
            <Popover.Close as={StyledClose}>close</Popover.Close>
          </Popover.Content>
          <Popover.Arrow as={StyledArrow} width={20} height={10} offset={10} />
        </Popover.Popper>
      </Popover>
      <input style={{ marginLeft: 10 }} />
    </>
  );
};

const StyledTrigger = styled('button', {});

const RECOMMENDED_CSS__POPOVER__POPPER = {
  transformOrigin: 'var(--interop-ui-popover-popper-transform-origin)',
};

const StyledPopper = styled('div', RECOMMENDED_CSS__POPOVER__POPPER);

const StyledContent = styled('div', {
  backgroundColor: '$gray300',
  padding: 20,
  borderRadius: 5,
});

const StyledClose = styled('button', {});

const StyledArrow = styled(Arrow, {
  fill: '$gray300',
});
