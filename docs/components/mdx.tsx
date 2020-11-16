import * as React from 'react';
import { Link } from './Link';
import {
  Caption,
  Divider,
  Heading,
  Paragraph,
  SubHeading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Title,
  Tr,
} from './pageComponents';
import { CodeBlock } from './CodeBlock';

export const MDXComponents = {
  h1: Title,
  h2: (props: any) => <Heading {...props} as="h2" />,
  h3: (props: any) => <SubHeading {...props} as="h3" />,
  a: Link,
  hr: Divider,
  p: Paragraph,
  caption: Caption,
  code: (props: any) => <CodeBlock {...props} isMdx />,
  table: Table,
  tr: Tr,
  th: Th,
  td: Td,
  tbody: Tbody,
  thead: Thead,
};

export default MDXComponents;
