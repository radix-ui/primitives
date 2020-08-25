import * as React from 'react';
import { Badge as BadgePrimitive, styles } from './Badge';

export default { title: 'Badge' };

export const Basic = () => <Badge>Badge</Badge>;

export const InlineStyle = () => (
  <Badge
    style={{
      backgroundColor: 'gainsboro',
      borderRadius: '9999px',
      padding: '5px 10px',
    }}
  >
    Badge
  </Badge>
);

const Badge = (props: React.ComponentProps<typeof BadgePrimitive>) => (
  <BadgePrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
