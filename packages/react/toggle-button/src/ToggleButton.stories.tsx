import * as React from 'react';
import { ToggleButton, styles } from './ToggleButton';

export default { title: 'ToggleButton' };

export const Basic = () => (
  <ToggleButton style={styles.root}>
    {({ toggled }) => `Currently ${toggled ? 'on' : 'off'}`}
  </ToggleButton>
);

export const InlineStyle = () => (
  <ToggleButton as={Button}>{({ toggled }) => `Currently ${toggled ? 'on' : 'off'}`}</ToggleButton>
);

export const Controlled = () => {
  const [toggled, setToggled] = React.useState(true);

  return (
    <ToggleButton
      as={Button}
      toggled={toggled}
      onToggle={setToggled}
      style={{
        color: toggled ? 'green' : 'gainsboro',
        borderColor: 'currentColor',
      }}
    >
      {toggled ? 'On' : 'Off'}
    </ToggleButton>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const Button = (props: React.ComponentPropsWithoutRef<'button'>) => (
  <button
    {...props}
    style={{
      ...styles.root,
      padding: 6,
      border: '2px solid gainsboro',
      lineHeight: 1,
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      ...props.style,
    }}
  />
);
