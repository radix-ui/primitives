import * as React from 'react';
import {
  Heading,
  Title,
  SubHeading,
  Paragraph,
  Divider,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from './pageComponents';
import { CodeBlock } from './CodeBlock';

export const MDXComponents = {
  h1: Title,
  h2: (props: any) => <Heading {...props} as="h2" />,
  h3: (props: any) => <SubHeading {...props} as="h3" />,
  hr: Divider,
  p: Paragraph,
  code: (props: any) => <CodeBlock {...props} />,
  table: (props: any) => <Table {...props} />,
  tr: (props: any) => <Tr {...props} />,
  th: (props: any) => <Th {...props} />,
  td: (props: any) => <Td {...props} />,
  tbody: (props: any) => <Tbody {...props} />,
  thead: (props: any) => <Thead {...props} />,
};

export default MDXComponents;
