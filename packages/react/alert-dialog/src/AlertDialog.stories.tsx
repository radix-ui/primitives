import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/AlertDialog' };

export const Styled = () => (
  <AlertDialog>
    <AlertDialogTrigger as={StyledTrigger}>delete everything</AlertDialogTrigger>
    <AlertDialogOverlay as={StyledOverlay} />
    <AlertDialogContent as={StyledContent}>
      <AlertDialogTitle as={StyledTitle}>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription as={StyledDescription}>
        This will do a very dangerous thing. Thar be dragons!
      </AlertDialogDescription>
      <AlertDialogAction as={StyledAction}>yolo, do it</AlertDialogAction>
      <AlertDialogCancel as={StyledCancel}>maybe not</AlertDialogCancel>
    </AlertDialogContent>
  </AlertDialog>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  const [housePurchased, setHousePurchased] = React.useState(false);

  return (
    <div>
      <div>
        <img src="https://i.ibb.co/K54hsKt/house.jpg" alt="a large white house with a red roof" />
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          onClick={(e) => {
            if (housePurchased) {
              e.preventDefault();
              setHousePurchased(false);
            }
          }}
        >
          {housePurchased ? 'You bought the house! Sell it!' : 'Buy this house'}
        </AlertDialogTrigger>
        <AlertDialogOverlay as={StyledOverlay} />
        <AlertDialogContent as={StyledContent}>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Houses are very expensive and it looks like you only have €20 in the bank. Maybe consult
            with a financial advisor?
          </AlertDialogDescription>
          <AlertDialogAction as={StyledAction} onClick={() => setHousePurchased(true)}>
            buy it anyway
          </AlertDialogAction>
          <AlertDialogCancel as={StyledCancel}>good point, I'll reconsider</AlertDialogCancel>
        </AlertDialogContent>
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
