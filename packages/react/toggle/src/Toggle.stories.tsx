import * as React from 'react';
import { Toggle } from './Toggle';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Toggle' };

export const Styled = () => <Toggle className={rootClass}>Toggle</Toggle>;

export const Controlled = () => {
  const [pressed, setPressed] = React.useState(true);

  return (
    <Toggle className={rootClass} pressed={pressed} onPressedChange={setPressed}>
      {pressed ? 'On' : 'Off'}
    </Toggle>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <Toggle className={rootClass}>Toggle</Toggle>

    <h2>On</h2>
    <Toggle className={rootClass} defaultPressed>
      Toggle
    </Toggle>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <Toggle className={rootClass} pressed={false}>
      Toggle
    </Toggle>

    <h2>On</h2>
    <Toggle className={rootClass} pressed>
      Toggle
    </Toggle>

    <h1>Disabled</h1>
    <Toggle className={rootClass} disabled>
      Toggle
    </Toggle>

    <h1>State attributes</h1>
    <Toggle className={rootAttrClass}>Toggle</Toggle>
    <Toggle className={rootAttrClass} disabled>
      Toggle
    </Toggle>
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
const rootAttrClass = css(styles);
