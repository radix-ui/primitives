import * as React from 'react';
import { Switch, styles } from './Switch';
import { Label as LabelPrimitive, styles as labelStyles } from '@interop-ui/react-label';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Switch' };

export const Basic = () => (
  <Switch style={styles.root}>
    <Switch.Thumb style={styles.thumb} />
  </Switch>
);

export const StitchesStyle = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <Label>
      This is the label{' '}
      <Switch as={Root}>
        <Switch.Thumb as={Thumb} />
      </Switch>
    </Label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>This switch is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">This is the label</Label>{' '}
      <Switch
        as={Root}
        checked={checked}
        onCheckedChange={(event: any) => setChecked(event.target.checked)}
        id="randBox"
      >
        <Switch.Thumb as={Thumb} />
      </Switch>
    </>
  );
};

export const WithinForm = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <form
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setChecked(input.checked);
      }}
    >
      <p>checked: {String(checked)}</p>

      <Switch as={Root}>
        <Switch.Thumb as={Thumb} />
      </Switch>
    </form>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const Label = (props: any) => <LabelPrimitive {...props} style={labelStyles.root} />;

/* -------------------------------------------------------------------------------------------------
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

const Root = React.forwardRef((props: any, forwardedRef) => (
  <RootStyles ref={forwardedRef} {...props} type="button" />
));

const RootStyles = styled('button', {
  ...(styles.root as any),
  width: '50px',
  padding: '4px',
  borderRadius: '9999px',
  backgroundColor: '$gray300',
  transition: 'all 300ms ease-out',
  '&[data-state="checked"]': {
    backgroundColor: '$red',
    borderColor: '$red',
  },
});

const Thumb = styled('span', {
  ...(styles.thumb as any),
  width: '20px',
  height: '20px',
  backgroundColor: '$white',
  borderRadius: '9999px',
  transition: 'all 300ms ease-out',
  '&[data-state="checked"]': {
    marginLeft: '100%',
    transform: 'translateX(-100%)',
  },
});
