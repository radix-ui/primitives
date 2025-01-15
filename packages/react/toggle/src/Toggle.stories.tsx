import * as React from 'react';
import { Toggle } from '@radix-ui/react-toggle';
import styles from './Toggle.stories.module.css';

export default { title: 'Components/Toggle' };

export const Styled = () => <Toggle className={styles.root}>Toggle</Toggle>;

export const Controlled = () => {
  const [pressed, setPressed] = React.useState(true);

  return (
    <Toggle className={styles.root} pressed={pressed} onPressedChange={setPressed}>
      {pressed ? 'On' : 'Off'}
    </Toggle>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <Toggle className={styles.root}>Toggle</Toggle>

    <h2>On</h2>
    <Toggle className={styles.root} defaultPressed>
      Toggle
    </Toggle>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <Toggle className={styles.root} pressed={false}>
      Toggle
    </Toggle>

    <h2>On</h2>
    <Toggle className={styles.root} pressed>
      Toggle
    </Toggle>

    <h1>Disabled</h1>
    <Toggle className={styles.root} disabled>
      Toggle
    </Toggle>

    <h1>State attributes</h1>
    <Toggle className={styles.rootAttr}>Toggle</Toggle>
    <Toggle className={styles.rootAttr} disabled>
      Toggle
    </Toggle>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
