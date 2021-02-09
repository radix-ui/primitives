import * as React from 'react';
import { ToggleButton } from './ToggleButton';
import { css } from '../../../../stitches.config';

export default { title: 'Components/ToggleButton' };

export const Styled = () => <ToggleButton className={rootClass}>Toggle</ToggleButton>;

export const Controlled = () => {
  const [toggled, setToggled] = React.useState(true);

  return (
    <ToggleButton className={rootClass} toggled={toggled} onToggledChange={setToggled}>
      {toggled ? 'On' : 'Off'}
    </ToggleButton>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <ToggleButton className={rootClass}>Toggle</ToggleButton>

    <h2>On</h2>
    <ToggleButton className={rootClass} defaultToggled>
      Toggle
    </ToggleButton>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <ToggleButton className={rootClass} toggled={false}>
      Toggle
    </ToggleButton>

    <h2>On</h2>
    <ToggleButton className={rootClass} toggled>
      Toggle
    </ToggleButton>

    <h1>Disabled</h1>
    <ToggleButton className={rootClass} disabled>
      Toggle
    </ToggleButton>

    <h1>Data attribute selectors</h1>
    <ToggleButton className={rootAttrClass}>Toggle</ToggleButton>
    <ToggleButton className={rootAttrClass} disabled>
      Toggle
    </ToggleButton>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const rootClass = css({
  padding: 6,
  lineHeight: 1,
  border: 'none',
  fontFamily: 'sans-serif',
  fontWeight: 'bold',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px $black',
  },

  '&[data-disabled]': { opacity: 0.5 },

  '&[data-state="off"]': {
    backgroundColor: '$red',
    color: '$white',
  },

  '&[data-state="on"]': {
    backgroundColor: '$green',
    color: '$white',
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&:disabled': { opacity: 0.5 },
  '&[data-disabled]': { borderStyle: 'dashed' },
};
const rootAttrClass = css({ '&[data-radix-toggle-button]': styles });
