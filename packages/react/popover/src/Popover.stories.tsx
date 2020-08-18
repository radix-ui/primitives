import * as React from 'react';
import { Popover as PopoverPrimitive, styles } from './Popover';

export default { title: 'Popover' };

export const Basic = () => (
  <Popover isOpen>
    <PopoverArrow width={20} height={10} />
    Popover
  </Popover>
);

export const InlineStyle = () => (
  <Popover
    isOpen
    style={{
      backgroundColor: 'ghostwhite',
      border: '1px solid gainsboro',
      borderRadius: 4,
      padding: '10px 20px',
    }}
  >
    <PopoverArrow width={20} height={10} style={{ stroke: 'gainsboro', fill: 'ghostwhite' }} />
    Popover
  </Popover>
);

const Popover = (props: Omit<React.ComponentProps<typeof PopoverPrimitive>, 'targetRef'>) => {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <span ref={ref} />
      <PopoverPrimitive targetRef={ref} {...props} style={{ ...styles.root, ...props.style }} />
    </>
  );
};

const PopoverArrow = (props: React.ComponentProps<typeof PopoverPrimitive.Arrow>) => (
  <PopoverPrimitive.Arrow {...props} style={{ ...styles.arrow, ...props.style }} />
);
