import * as React from 'react';
import { Sheet as SheetPrimitive, styles } from './Sheet';

export default { title: 'Sheet' };

export const Basic = () => (
  <Sheet isOpen>
    <SheetContent>Content</SheetContent>
  </Sheet>
);

export const InlineStyle = (props: Omit<React.ComponentProps<typeof Sheet>, 'isOpen'>) => (
  <Sheet {...props} isOpen style={{ backgroundColor: 'gainsboro' }}>
    <SheetContent style={{ background: 'white' }}>Content</SheetContent>
  </Sheet>
);

export const Right = () => <InlineStyle side="right" />;

const Sheet = (props: React.ComponentProps<typeof SheetPrimitive>) => (
  <SheetPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const SheetContent = (props: React.ComponentProps<typeof SheetPrimitive.Content>) => (
  <SheetPrimitive.Content {...props} style={{ ...styles.content, ...props.style }} />
);
