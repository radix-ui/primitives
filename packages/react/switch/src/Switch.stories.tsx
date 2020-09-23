import * as React from 'react';
import { Switch, styles } from './Switch';
import { createStyled } from '@stitches/react';

export default { title: 'Switch' };

const { styled } = createStyled({
  tokens: {
    colors: {
      $white: '#fff',
      $gray100: '#ccc',
      $gray300: '#aaa',
      $red: 'crimson',
    },
  },
});

export const Basic = () => (
  <Switch style={styles.root}>
    <Switch.Thumb style={styles.thumb} />
  </Switch>
);

export const StitchesStyle = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <label>
      This is the label{' '}
      <Switch as={Root}>
        <Switch.Thumb as={Thumb} />
      </Switch>
    </label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>This switch is placed adjacent to its label. The state is controlled.</p>
      <label htmlFor="randBox">This is the label</label>{' '}
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
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

// Had issues with the size tokens for some reason, feel free to fix this for me stitches style
const HEIGHT = 30;
const BORDER = 4;

const Root = styled('input', {
  ...(styles.root as any),
  height: `${HEIGHT}px`,
  width: `${HEIGHT * 2}px`,
  border: `${BORDER}px solid $gray300`,
  borderRadius: `${HEIGHT / 2}px`,
  backgroundColor: '$gray300',
  transition: 'all 300ms ease-out',
  '&[data-state="checked"]': {
    backgroundColor: '$red',
    borderColor: '$red',
  },
});

const Thumb = styled('span', {
  ...(styles.thumb as any),
  width: `${HEIGHT - BORDER * 2}px`,
  height: `${HEIGHT - BORDER * 2}px`,
  top: `${BORDER}px`,
  left: `${BORDER}px`,
  backgroundColor: '$white',
  borderRadius: `${HEIGHT / 2}px`,
  transition: 'transform 300ms ease-out',
  '&[data-state="checked"]': {
    transform: `translateX(${HEIGHT}px)`,
  },
});
