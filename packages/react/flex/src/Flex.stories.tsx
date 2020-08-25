import React from 'react';
import { Flex as FlexPrimitive, styles } from './Flex';

export default { title: 'Flex' };

export const Basic = () => (
  <Flex>
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
  </Flex>
);

export const InlineStyle = () => (
  <FlexInlineStyle>
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
  </FlexInlineStyle>
);

export const Gap = () => (
  <FlexInlineStyle gap={5}>
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
  </FlexInlineStyle>
);

export const RowGap = () => (
  <FlexInlineStyle rowGap={5}>
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
  </FlexInlineStyle>
);

export const ColumnGap = () => (
  <FlexInlineStyle columnGap={5}>
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
  </FlexInlineStyle>
);

export const OffsetGap = () => (
  <FlexInlineStyle gap={5}>
    <FlexInlineStyleItem />
    <FlexInlineStyleItem xOffset={20} />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem />
    <FlexInlineStyleItem yOffset={20} />
    <FlexInlineStyleItem />
  </FlexInlineStyle>
);

const Flex = (props: React.ComponentProps<typeof FlexPrimitive>) => (
  <FlexPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const FlexItem = (props: React.ComponentProps<typeof FlexPrimitive.Item>) => (
  <FlexPrimitive.Item {...props} style={{ ...styles.item, ...props.style }} />
);

const FlexInlineStyle = (props: React.ComponentProps<typeof Flex>) => (
  <Flex
    {...props}
    style={{
      backgroundColor: 'ghostwhite',
      flexWrap: 'wrap',
    }}
  />
);

const FlexInlineStyleItem = (props: React.ComponentProps<typeof FlexItem>) => (
  <FlexItem
    {...props}
    style={{
      height: 50,
      minWidth: 200,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'gainsboro',
    }}
  />
);
