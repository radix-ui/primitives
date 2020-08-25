import * as React from 'react';
import { Link as LinkPrimitive, styles } from './Link';

export default { title: 'Link' };

export const Basic = () => <Link href="#">Link</Link>;

export const InlineStyle = () => (
  <Link href="#" style={{ color: 'dodgerblue', textDecoration: 'underline' }}>
    Link
  </Link>
);

const Link = (props: React.ComponentProps<typeof LinkPrimitive>) => (
  <LinkPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
