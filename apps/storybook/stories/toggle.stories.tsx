import * as React from 'react';
import { Toggle } from 'radix-ui';
import styles from './toggle.stories.module.css';

export default { title: 'Components/Toggle' };

export const Styled = () => <Toggle.Root className={styles.root}>Toggle</Toggle.Root>;

export const Controlled = () => {
  const [pressed, setPressed] = React.useState(true);

  return (
    <Toggle.Root className={styles.root} pressed={pressed} onPressedChange={setPressed}>
      {pressed ? 'On' : 'Off'}
    </Toggle.Root>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <Toggle.Root className={styles.root}>Toggle</Toggle.Root>

    <h2>On</h2>
    <Toggle.Root className={styles.root} defaultPressed>
      Toggle
    </Toggle.Root>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <Toggle.Root className={styles.root} pressed={false}>
      Toggle
    </Toggle.Root>

    <h2>On</h2>
    <Toggle.Root className={styles.root} pressed>
      Toggle
    </Toggle.Root>

    <h1>Disabled</h1>
    <Toggle.Root className={styles.root} disabled>
      Toggle
    </Toggle.Root>

    <h1>State attributes</h1>
    <Toggle.Root className={styles.rootAttr}>Toggle</Toggle.Root>
    <Toggle.Root className={styles.rootAttr} disabled>
      Toggle
    </Toggle.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
