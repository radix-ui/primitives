import * as React from 'react';
import { AlertDialog } from './AlertDialog';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/AlertDialog' };

export const Styled = () => (
  <AlertDialog>
    <AlertDialog.Trigger as={StyledTrigger}>delete everything</AlertDialog.Trigger>
    <AlertDialog.Overlay as={StyledOverlay} />
    <AlertDialog.Content as={StyledContent}>
      <AlertDialog.Title as={StyledTitle}>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description as={StyledDescription}>
        This will do a very dangerous thing. Thar be dragons!
      </AlertDialog.Description>
      <AlertDialog.Action as={StyledAction}>yolo, do it</AlertDialog.Action>
      <AlertDialog.Cancel as={StyledCancel}>maybe not</AlertDialog.Cancel>
    </AlertDialog.Content>
  </AlertDialog>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [housePurchased, setHousePurchased] = React.useState(false);

  return (
    <div>
      <div>
        <img src="https://i.ibb.co/K54hsKt/house.jpg" alt="a large white house with a red roof" />
      </div>
      <AlertDialog isOpen={isOpen} onIsOpenChange={setIsOpen}>
        <AlertDialog.Trigger
          onClick={(e) => {
            if (housePurchased) {
              e.preventDefault();
              setHousePurchased(false);
            }
          }}
        >
          {housePurchased ? 'You bought the house! Sell it!' : 'Buy this house'}
        </AlertDialog.Trigger>
        <AlertDialog.Overlay as={StyledOverlay} />
        <AlertDialog.Content as={StyledContent}>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            Houses are very expensive and it looks like you only have €20 in the bank. Maybe consult
            with a financial advisor?
          </AlertDialog.Description>
          <AlertDialog.Action as={StyledAction} onClick={() => setHousePurchased(true)}>
            buy it anyway
          </AlertDialog.Action>
          <AlertDialog.Cancel as={StyledCancel}>good point, I'll reconsider</AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
};

const StyledTrigger = styled('button', {});

const RECOMMENDED_CSS__ALERT_DIALOG__OVERLAY: any = {
  // ensures overlay is positionned correctly
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const StyledOverlay = styled('div', {
  ...RECOMMENDED_CSS__ALERT_DIALOG__OVERLAY,
  backgroundColor: 'black',
  opacity: 0.2,
});

const RECOMMENDED_CSS__ALERT_DIALOG__CONTENT: any = {
  // ensures good default position for content
  position: 'fixed',
  top: 0,
  left: 0,
};

const StyledContent = styled('div', {
  ...RECOMMENDED_CSS__ALERT_DIALOG__CONTENT,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const StyledCancel = styled('button', {
  appearance: 'none',
  padding: 10,
  border: 'none',
  background: '$grey100',
});

const StyledAction = styled('button', {
  appearance: 'none',
  padding: 10,
  border: 'none',
  backgroundColor: '$red',
  color: '$white',
});

const StyledTitle = styled('h2', {});

const StyledDescription = styled('p', {});
