import * as React from 'react';
import { Dialog as DialogPrimitive, styles } from './Dialog';

export default { title: 'Dialog' };

export const Basic = () => (
  <Dialog isOpen>
    <DialogContent>Content</DialogContent>
  </Dialog>
);

export const InlineStyle = () => (
  <Dialog isOpen style={{ backgroundColor: 'gainsboro' }}>
    <DialogContent
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        minWidth: 500,
        minHeight: 500,
      }}
    >
      Content
    </DialogContent>
  </Dialog>
);

const Dialog = (props: React.ComponentProps<typeof DialogPrimitive>) => (
  <DialogPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const DialogContent = (props: React.ComponentProps<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Content {...props} style={{ ...styles.content, ...props.style }} />
);
