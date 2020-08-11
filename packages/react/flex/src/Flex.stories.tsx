import React from 'react';
import { Flex as FlexPrimitive, styles as flexStyles } from './Flex';

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

export const Gap = () => (
  <Flex gap={5}>
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
  </Flex>
);

export const RowGap = () => (
  <Flex rowGap={5}>
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
  </Flex>
);

export const ColumnGap = () => (
  <Flex columnGap={5}>
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
    <FlexItem />
  </Flex>
);

export const OffsetGap = () => (
  <Flex gap={5}>
    <FlexItem />
    <FlexItem xOffset={20} />
    <FlexItem />
    <FlexItem />
    <FlexItem yOffset={20} />
    <FlexItem />
  </Flex>
);

const Flex = (props: React.ComponentProps<typeof FlexPrimitive>) => (
  <FlexPrimitive
    {...props}
    style={{
      ...flexStyles.flex,
      backgroundColor: 'ghostwhite',
      flexWrap: 'wrap',
    }}
  />
);

const FlexItem = (props: React.ComponentProps<typeof FlexPrimitive.Item>) => (
  <FlexPrimitive.Item
    {...props}
    style={{
      ...flexStyles.item,
      height: 50,
      minWidth: 200,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'gainsboro',
    }}
  />
);
