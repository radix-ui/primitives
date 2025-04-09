import * as React from 'react';
import { Collapsible } from 'radix-ui';
import styles from './collapsible.stories.module.css';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible.Root className={styles.root}>
    <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
    <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
  </Collapsible.Root>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={styles.root}>
      <Collapsible.Trigger className={styles.trigger}>
        {open ? 'close' : 'open'}
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.content} asChild>
        <article>Content 1</article>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const Animated = () => {
  return (
    <>
      <h1>Closed by default</h1>
      <Collapsible.Root className={styles.root}>
        <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
        <Collapsible.Content className={styles.animatedContent}>
          <div style={{ padding: 10 }}>Content 1</div>
        </Collapsible.Content>
      </Collapsible.Root>

      <h1>Open by default</h1>
      <Collapsible.Root defaultOpen className={styles.root}>
        <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
        <Collapsible.Content className={styles.animatedContent}>
          <div style={{ padding: 10 }}>Content 1</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};

export const AnimatedHorizontal = () => {
  return (
    <Collapsible.Root className={styles.root}>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.animatedWidthContent}>
        <div style={{ padding: 10 }}>Content</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={styles.root}>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={styles.root} defaultOpen>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>Controlled</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={styles.root} open={false}>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={styles.root} open>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>Disabled</h1>
    <Collapsible.Root className={styles.root} disabled>
      <Collapsible.Trigger className={styles.trigger}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.content}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>State attributes</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={styles.rootAttr}>
      <Collapsible.Trigger className={styles.triggerAttr}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.contentAttr}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={styles.rootAttr} defaultOpen>
      <Collapsible.Trigger className={styles.triggerAttr}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.contentAttr}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Disabled</h2>
    <Collapsible.Root className={styles.rootAttr} defaultOpen disabled>
      <Collapsible.Trigger className={styles.triggerAttr}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={styles.contentAttr}>Content 1</Collapsible.Content>
    </Collapsible.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
