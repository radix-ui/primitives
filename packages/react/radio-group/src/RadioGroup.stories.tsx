import * as React from 'react';
import { Label as LabelPrimitive } from '@interop-ui/react-label';
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from './RadioGroup';
import { styled } from '../../../../stitches.config';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';

export default { title: 'Components/RadioGroup' };

export const Styled = () => (
  <Label>
    Favourite pet
    <RadioGroup as={StyledRoot} defaultValue="1">
      <Label>
        <RadioGroupItem as={StyledItem} value="1">
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroupItem as={StyledItem} value="2">
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroupItem as={StyledItem} value="3">
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Rabbit
      </Label>
    </RadioGroup>
  </Label>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('2');

  return (
    <RadioGroup
      as={StyledRoot}
      value={value}
      onValueChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
    >
      <RadioGroupItem as={StyledItem} value="1">
        <RadioGroupIndicator as={StyledIndicator} />
      </RadioGroupItem>
      <RadioGroupItem as={StyledItem} value="2">
        <RadioGroupIndicator as={StyledIndicator} />
      </RadioGroupItem>
      <RadioGroupItem as={StyledItem} value="3">
        <RadioGroupIndicator as={StyledIndicator} />
      </RadioGroupItem>
    </RadioGroup>
  );
};

export const Unset = () => (
  <Label>
    Favourite pet
    <RadioGroup as={StyledRoot}>
      <Label>
        <RadioGroupItem as={StyledItem} value="1">
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroupItem as={StyledItem} value="2" disabled>
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroupItem as={StyledItem} value="3">
          <RadioGroupIndicator as={StyledIndicator} />
        </RadioGroupItem>
        Rabbit
      </Label>
    </RadioGroup>
  </Label>
);

const Label = (props: any) => <LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />;

const StyledRoot = styled('div', {});

const RECOMMENDED_CSS__RADIO_GROUP__ITEM = {
  // better default alignment
  verticalAlign: 'middle',
};

const StyledItem = styled('button', {
  ...RECOMMENDED_CSS__RADIO_GROUP__ITEM,
  width: 30,
  height: 30,
  display: 'inline-grid',
  padding: 0,
  placeItems: 'center',
  border: '1px solid $gray300',
  borderRadius: 9999,

  '&:focus': {
    outline: 'none',
    borderColor: '$red',
    boxShadow: '0 0 0 1px $red',
  },

  '&[data-disabled]': {
    opacity: 0.5,
  },
});

const StyledIndicator = styled('span', {
  width: 18,
  height: 18,
  backgroundColor: '$red',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'inherit',
});
