import * as React from 'react';
import { Direction, ToggleGroup } from 'radix-ui';
import styles from './toggle-group.stories.module.css';

export default {
  title: 'Components/ToggleGroup',
};

export const Single = () => {
  const [value, setValue] = React.useState<string>();
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup.Root type="single" className={styles.root} aria-label="Options" defaultValue="1">
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <h1>Controlled</h1>
      <ToggleGroup.Root
        type="single"
        className={styles.root}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </>
  );
};

export const Vertical = () => {
  return (
    <ToggleGroup.Root
      type="single"
      orientation="vertical"
      className={styles.root}
      aria-label="Options"
      defaultValue="1"
    >
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item}>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export const Multiple = () => {
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup.Root
        type="multiple"
        className={styles.root}
        aria-label="Options"
        defaultValue={['1']}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <h1>Controlled</h1>
      <ToggleGroup.Root
        type="multiple"
        className={styles.root}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </>
  );
};

export const Chromatic = () => (
  <>
    <h1>Single</h1>
    <h2>Off</h2>
    <ToggleGroup.Root type="single" className={styles.root}>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item} disabled>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>On</h2>
    <ToggleGroup.Root type="single" className={styles.root} defaultValue="1">
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item} disabled>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>Disabled</h2>
    <ToggleGroup.Root type="single" className={styles.root} disabled>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item}>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h1>Multiple</h1>
    <h2>Off</h2>
    <ToggleGroup.Root type="multiple" className={styles.root}>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item} disabled>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>One on</h2>
    <ToggleGroup.Root type="multiple" className={styles.root} defaultValue={['1']}>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item} disabled>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>One and two on</h2>
    <ToggleGroup.Root type="multiple" className={styles.root} defaultValue={['1', '2']}>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item}>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>Disabled</h2>
    <ToggleGroup.Root type="multiple" className={styles.root} disabled>
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item}>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h1>Direction</h1>
    <h2>Prop</h2>
    <ToggleGroup.Root type="single" className={styles.root} defaultValue="1" dir="rtl">
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item} disabled>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>Inherited</h2>
    <Direction.Provider dir="rtl">
      <ToggleGroup.Root type="single" className={styles.root} defaultValue="1">
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item} disabled>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </Direction.Provider>

    <h1>State attributes</h1>
    <h2>Group disabled</h2>
    <ToggleGroup.Root type="multiple" className={styles.root} defaultValue={['1', '2']} disabled>
      <ToggleGroup.Item value="1" className={styles.itemAttr}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.itemAttr}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.itemAttr}>
        Option 3
      </ToggleGroup.Item>
      <ToggleGroup.Item value="4" className={styles.itemAttr}>
        Option 4
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>Group enabled with button override</h2>
    <ToggleGroup.Root
      type="multiple"
      className={styles.root}
      defaultValue={['1', '2']}
      disabled={false}
    >
      <ToggleGroup.Item value="1" className={styles.itemAttr}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.itemAttr} disabled>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.itemAttr}>
        Option 3
      </ToggleGroup.Item>
      <ToggleGroup.Item value="4" className={styles.itemAttr} disabled>
        Option 4
      </ToggleGroup.Item>
    </ToggleGroup.Root>

    <h2>Group disabled with button override</h2>
    <ToggleGroup.Root
      type="multiple"
      className={styles.root}
      defaultValue={['1', '2']}
      disabled={true}
    >
      <ToggleGroup.Item value="1" className={styles.itemAttr}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.itemAttr} disabled={false}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.itemAttr}>
        Option 3
      </ToggleGroup.Item>
      <ToggleGroup.Item value="4" className={styles.itemAttr} disabled={false}>
        Option 4
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
