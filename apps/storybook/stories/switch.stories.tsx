/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { Label as LabelPrimitive, Slot, Switch } from 'radix-ui';
import styles from './switch.stories.module.css';
import { customMergeProps } from './custom-merge-props';

export default { title: 'Components/Switch' };

export const Styled = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <Label>
      This is the label{' '}
      <Switch.Root className={styles.root}>
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
    </Label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>This switch is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">This is the label</Label>{' '}
      <Switch.Root
        className={styles.root}
        checked={checked}
        onCheckedChange={setChecked}
        id="randBox"
      >
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
    </>
  );
};

export const WithinForm = () => {
  const [data, setData] = React.useState({ optional: false, required: false, stopprop: false });
  const [checked, setChecked] = React.useState(false);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const input = event.target as unknown as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [input.name]: input.checked }));
      }}
    >
      <fieldset>
        <legend>optional checked: {String(data.optional)}</legend>
        <label>
          <Switch.Root
            className={styles.root}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Switch.Thumb className={styles.thumb} />
          </Switch.Root>{' '}
          with label
        </label>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Switch.Root className={styles.root} name="required" required>
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Switch.Root
          className={styles.root}
          name="stopprop"
          onClick={(event) => event.stopPropagation()}
        >
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const Parts = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>This switch is composed from the unstable parts. The state is controlled.</p>
      <Label htmlFor="randBox">This is the label</Label>{' '}
      <Switch.unstable_Provider checked={checked} onCheckedChange={setChecked}>
        <Switch.unstable_Trigger className={styles.root} id="randBox">
          <Switch.Thumb className={styles.thumb} />
        </Switch.unstable_Trigger>
      </Switch.unstable_Provider>
    </>
  );
};

export const PartsWithinForm = () => {
  const [data, setData] = React.useState({ optional: false, required: false, stopprop: false });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const input = event.target as unknown as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [input.name]: input.checked }));
      }}
    >
      <fieldset>
        <legend>optional checked: {String(data.optional)}</legend>
        <Switch.unstable_Provider name="optional">
          <Switch.unstable_Trigger className={styles.root}>
            <Switch.Thumb className={styles.thumb} />
          </Switch.unstable_Trigger>
          <Switch.unstable_BubbleInput />
        </Switch.unstable_Provider>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Switch.unstable_Provider name="required" required>
          <Switch.unstable_Trigger className={styles.root}>
            <Switch.Thumb className={styles.thumb} />
          </Switch.unstable_Trigger>
          <Switch.unstable_BubbleInput />
        </Switch.unstable_Provider>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Switch.unstable_Provider name="stopprop">
          <Switch.unstable_Trigger
            className={styles.root}
            onClick={(event) => event.stopPropagation()}
          >
            <Switch.Thumb className={styles.thumb} />
          </Switch.unstable_Trigger>
          <Switch.unstable_BubbleInput />
        </Switch.unstable_Provider>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>no bubble input</legend>
        <Switch.unstable_Provider name="nobubble">
          <Switch.unstable_Trigger className={styles.root}>
            <Switch.Thumb className={styles.thumb} />
          </Switch.unstable_Trigger>
        </Switch.unstable_Provider>
      </fieldset>

      <br />
      <br />

      <button type="reset">Reset</button>
      <button>Submit</button>
    </form>
  );
};

export const WithCustomMergeProps = () => (
  <Slot.Provider mergeProps={customMergeProps}>
    <Switch.Root className={styles.root} asChild>
      <button data-custom-merge>
        <Switch.Thumb className={styles.thumb} />
      </button>
    </Switch.Root>
  </Slot.Provider>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <Switch.Root className={styles.root}>
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>

    <h2>On</h2>
    <Switch.Root className={styles.root} defaultChecked>
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <Switch.Root className={styles.root} checked={false}>
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>

    <h2>On</h2>
    <Switch.Root className={styles.root} checked>
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>

    <h1>Disabled</h1>
    <Switch.Root className={styles.root} disabled>
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>

    <h1>State attributes</h1>
    <h2>Unchecked</h2>
    <Switch.Root className={styles.rootAttr}>
      <Switch.Thumb className={styles.thumbAttr} />
    </Switch.Root>

    <h2>Checked</h2>
    <Switch.Root className={styles.rootAttr} defaultChecked>
      <Switch.Thumb className={styles.thumbAttr} />
    </Switch.Root>

    <h2>Disabled</h2>
    <Switch.Root className={styles.rootAttr} defaultChecked disabled>
      <Switch.Thumb className={styles.thumbAttr} />
    </Switch.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive.Root {...props} className={styles.label} />;
