import * as React from 'react';
import { RadioGroup, styles } from './RadioGroup';

export default { title: 'RadioGroup' };

export const Basic = () => (
  <RadioGroup style={styles.root}>
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
  <RadioGroup as={Root}>
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
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const Root = React.forwardRef((props: any, forwardedRef) => (
  <RadioGroup {...props} ref={forwardedRef} style={styles.root} />
));

const Item = React.forwardRef((props: any, forwardedRef) => (
  <RadioGroup.Item
    {...props}
    ref={forwardedRef}
    style={{
      ...styles.item,
      width: 30,
      height: 30,
      border: '1px solid gainsboro',
      borderRadius: 9999,
    }}
  />
));

const Indicator = React.forwardRef((props: any, forwardedRef) => (
  <RadioGroup.Indicator
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
