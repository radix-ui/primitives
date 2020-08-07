import * as React from 'react';
import { Badge, styles as badgeStyles } from './Badge';

export default { title: 'Badge' };

export function Basic() {
  return (
    <Badge style={badgeStyles.badge}>
      Cool Badge <span aria-hidden>😎</span>
    </Badge>
  );
}
