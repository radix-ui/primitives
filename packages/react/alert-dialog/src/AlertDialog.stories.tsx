import * as React from 'react';
import { AlertDialog, styles } from './AlertDialog';
import type { AlertDialogContentProps } from './AlertDialog';

export default { title: 'AlertDialog' };

export const Basic = () => {
  return (
    <AlertDialog>
      <AlertDialog.Trigger style={styles.trigger}>delete everything</AlertDialog.Trigger>
      <AlertDialog.Overlay style={styles.overlay} />
      <AlertDialog.Content style={styles.content}>
        <AlertDialog.Title style={styles.title}>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description style={styles.description}>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialog.Description>
        <AlertDialog.Action style={styles.action}>yolo, do it</AlertDialog.Action>
        <AlertDialog.Cancel style={styles.cancel}>maybe not</AlertDialog.Cancel>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export const InlineStyle = () => {
  const buttonStyles: React.CSSProperties = {
    appearance: 'none',
    display: 'inline-block',
    marginRight: 10,
    border: 'none',
    padding: '0.5em 0.8em',
    lineHeight: 1,
    boxShadow: 'none',
    textShadow: 'none',
    fontWeight: 'bold',
    background: '#DCDCDC',
    color: '#111',
    fontFamily: 'helvetica, sans-serif',
  };
  return (
    <AlertDialog>
      <AlertDialog.Trigger style={{ ...styles.trigger, ...buttonStyles }}>
        delete everything
      </AlertDialog.Trigger>
      <AlertDialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
      <AlertDialog.Content
        style={{
          ...styles.content,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          minWidth: 500,
          minHeight: 300,
          padding: 50,
          borderRadius: 10,
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
        }}
      >
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialog.Description>
        <AlertDialog.Action
          style={{
            ...styles.action,
            ...buttonStyles,
            background: 'crimson',
            color: '#fff',
          }}
        >
          yolo, do it
        </AlertDialog.Action>
        <AlertDialog.Cancel
          style={{
            ...styles.cancel,
            ...buttonStyles,
          }}
        >
          maybe not
        </AlertDialog.Cancel>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

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
          as={Button}
          onClick={(e) => {
            if (housePurchased) {
              e.preventDefault();
              setHousePurchased(false);
            }
          }}
        >
          {housePurchased ? 'You bought the house! Sell it!' : 'Buy this house'}
        </AlertDialog.Trigger>
        <AlertDialog.Overlay as={Overlay} />
        <AlertDialog.Content as={Content}>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            Houses are very expensive and it looks like you only have €20 in the bank. Maybe consult
            with a financial advisor?
          </AlertDialog.Description>
          <AlertDialog.Action as={WarningButton} onClick={() => setHousePurchased(true)}>
            buy it anyway
          </AlertDialog.Action>
          <AlertDialog.Cancel as={Button}>good point, I'll reconsider</AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
};

const Button = React.forwardRef<HTMLButtonElement, any>(function Button(props, ref) {
  return (
    <button
      ref={ref}
      {...props}
      style={{
        ...styles.trigger,
        appearance: 'none',
        marginRight: 10,
        border: 'none',
        padding: '0.5em 0.8em',
        lineHeight: 1,
        boxShadow: 'none',
        textShadow: 'none',
        fontWeight: 'bold',
        background: '#DCDCDC',
        color: '#111',
        fontFamily: 'helvetica, sans-serif',
        opacity: props.disabled ? 0.5 : 1,
        display: props.hidden ? 'none' : 'inline-block',
        ...props.style,
      }}
    />
  );
});

const Overlay = React.forwardRef<HTMLDivElement, any>(function Overlay(props, ref) {
  return (
    <div
      ref={ref}
      {...props}
      style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }}
    />
  );
});

const WarningButton = React.forwardRef<HTMLButtonElement, any>(function WarningButton(props, ref) {
  return (
    <Button
      ref={ref}
      {...props}
      style={{
        background: 'crimson',
        color: '#fff',
        ...props.style,
      }}
    />
  );
});

const Content = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(function Content(
  props,
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      {...props}
      style={{
        ...styles.content,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        minWidth: 500,
        minHeight: 300,
        padding: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
        ...props.style,
      }}
    />
  );
});
