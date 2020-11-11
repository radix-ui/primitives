import * as React from 'react';
import { Label as LabelPrimitive, styles as labelStyles } from '@interop-ui/react-label';
import { RadioGroup, styles } from './RadioGroup';

export default { title: 'Components/RadioGroup' };

export const Basic = () => (
  <RadioGroup style={styles.root} defaultValue="1">
    <RadioGroup.Item style={styles.item} value="1">
      <RadioGroup.Indicator style={styles.indicator} />
    </RadioGroup.Item>
    <RadioGroup.Item style={styles.item} value="2">
      <RadioGroup.Indicator style={styles.indicator} />
    </RadioGroup.Item>
    <RadioGroup.Item style={styles.item} value="3">
      <RadioGroup.Indicator style={styles.indicator} />
    </RadioGroup.Item>
  </RadioGroup>
);

export const InlineStyle = () => (
  <Label>
    Favourite pet
    <RadioGroup as={Root} defaultValue="1">
      <Label>
        <RadioGroup.Item as={Item} value="1">
          <RadioGroup.Indicator as={Indicator} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item as={Item} value="2">
          <RadioGroup.Indicator as={Indicator} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item as={Item} value="3">
          <RadioGroup.Indicator as={Indicator} />
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
      as={Root}
      value={value}
      onValueChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
    >
      <RadioGroup.Item as={Item} value="1">
        <RadioGroup.Indicator as={Indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item as={Item} value="2">
        <RadioGroup.Indicator as={Indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item as={Item} value="3">
        <RadioGroup.Indicator as={Indicator} />
      </RadioGroup.Item>
    </RadioGroup>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const Label = (props: any) => <LabelPrimitive {...props} style={labelStyles.root} />;

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const Root = React.forwardRef((props: any, forwardedRef) => (
  <RadioGroup {...props} ref={forwardedRef} style={styles.root} />
));

const Item = React.forwardRef((props: any, forwardedRef) => (
  <button
    {...props}
    type="button"
    ref={forwardedRef}
    style={{
      ...styles.item,
      width: 30,
      height: 30,
      display: 'inline-grid',
      placeItems: 'center',
      border: '1px solid gainsboro',
      borderRadius: 9999,
    }}
  />
));

const Indicator = React.forwardRef((props: any, forwardedRef) => (
  <span
    {...props}
    ref={forwardedRef}
    style={{
      ...styles.indicator,
      width: 18,
      height: 18,
      backgroundColor: 'dodgerblue',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'inherit',
    }}
  />
));
