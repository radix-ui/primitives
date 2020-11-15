import * as React from 'react';
import { Label as LabelPrimitive } from '@interop-ui/react-label';
import { RadioGroup, styles } from './RadioGroup';
import { styled } from '../../../../stitches.config';
import { recommendedStyles as recommendedLabelStyles } from '../../label/src/Label.stories';

export default { title: 'Components/RadioGroup' };

export const Basic = () => (
  <RadioGroup as={BasicStyledRoot} defaultValue="1">
    <RadioGroup.Item as={BasicStyledItem} value="1">
      <RadioGroup.Indicator as={BasicStyledIndicator}>
        <span role="img" aria-label="tick">
          ●
        </span>
      </RadioGroup.Indicator>
    </RadioGroup.Item>
    <RadioGroup.Item as={BasicStyledItem} value="2">
      <RadioGroup.Indicator as={BasicStyledIndicator}>
        <span role="img" aria-label="tick">
          ●
        </span>
      </RadioGroup.Indicator>
    </RadioGroup.Item>
    <RadioGroup.Item as={BasicStyledItem} value="3">
      <RadioGroup.Indicator as={BasicStyledIndicator}>
        <span role="img" aria-label="tick">
          ●
        </span>
      </RadioGroup.Indicator>
    </RadioGroup.Item>
  </RadioGroup>
);

export const Styled = () => (
  <Label>
    Favourite pet
    <RadioGroup as={StyledRoot} defaultValue="1">
      <Label>
        <RadioGroup.Item as={StyledItem} value="1">
          <RadioGroup.Indicator as={StyledIndicator} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item as={StyledItem} value="2">
          <RadioGroup.Indicator as={StyledIndicator} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item as={StyledItem} value="3">
          <RadioGroup.Indicator as={StyledIndicator} />
        </RadioGroup.Item>
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
      <RadioGroup.Item as={StyledItem} value="1">
        <RadioGroup.Indicator as={StyledIndicator} />
      </RadioGroup.Item>
      <RadioGroup.Item as={StyledItem} value="2">
        <RadioGroup.Indicator as={StyledIndicator} />
      </RadioGroup.Item>
      <RadioGroup.Item as={StyledItem} value="3">
        <RadioGroup.Indicator as={StyledIndicator} />
      </RadioGroup.Item>
    </RadioGroup>
  );
};

const Label = (props: any) => <LabelPrimitive {...props} style={recommendedLabelStyles} />;

const BasicStyledRoot = styled('div', styles.root);
const BasicStyledItem = styled('button', styles.item);
const BasicStyledIndicator = styled('span', styles.indicator);

const StyledRoot = styled(BasicStyledRoot, {});

const StyledItem = styled(BasicStyledItem, {
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
});

const StyledIndicator = styled(BasicStyledIndicator, {
  width: 18,
  height: 18,
  backgroundColor: '$red',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'inherit',
});
