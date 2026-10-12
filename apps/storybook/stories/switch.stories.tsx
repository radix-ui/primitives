/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { Label as LabelPrimitive, Switch } from 'radix-ui';
import styles from './switch.stories.module.css';

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
  const [formData, setFormData] = React.useState<Record<string, boolean>>({});
  const [checked, setChecked] = React.useState(false);
  const [fieldData, setFieldData] = React.useState<Record<string, boolean>>({
    'required-1': true,
  });

  const setFieldChecked = (name: string, value: string, nextChecked: boolean) => {
    if (value === '4') {
      window.alert('4 is not supported');
    } else {
      setFieldData((prevData) => ({ ...prevData, [`${name}-${value}`]: nextChecked }));
    }
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const input = event.target as unknown as HTMLInputElement;
        setFormData((prevData) => ({ ...prevData, [input.name]: input.checked }));
      }}
    >
      <fieldset>
        <legend>optional field</legend>
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

      <fieldset>
        <legend>required field (1 is required)</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <Switch.Root
              className={styles.root}
              id={`required-${value}`}
              name={`required-${value}`}
              required={value === '1'}
              checked={fieldData[`required-${value}`] ?? false}
              onCheckedChange={(nextChecked) => setFieldChecked('required', value, nextChecked)}
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>{' '}
            <label htmlFor={`required-${value}`}>{value}</label>
          </div>
        ))}
      </fieldset>

      <br />

      <fieldset>
        <legend>With stop propagation</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <Switch.Root
              className={styles.root}
              id={`stopprop-${value}`}
              name={`stopprop-${value}`}
              checked={fieldData[`stopprop-${value}`] ?? false}
              onCheckedChange={(nextChecked) => setFieldChecked('stopprop', value, nextChecked)}
              onClick={(event) => event.stopPropagation()}
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>{' '}
            <label htmlFor={`stopprop-${value}`}>{value}</label>
          </div>
        ))}
      </fieldset>

      <br />

      <fieldset>
        <legend>native inputs (1 is required)</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <input
              type="checkbox"
              // A checkbox input exposes its own checked state, so `aria-checked` isn't needed
              // oxlint-disable-next-line jsx-a11y/role-has-required-aria-props
              role="switch"
              id={`native-${value}`}
              name={`native-${value}`}
              required={value === '1'}
              checked={fieldData[`native-${value}`] ?? false}
              onChange={(event) => setFieldChecked('native', value, event.target.checked)}
            />{' '}
            <label htmlFor={`native-${value}`}>{value}</label>
          </div>
        ))}
      </fieldset>

      <br />

      <button type="reset">Reset</button>
      <button>Submit</button>
      <hr />
      <div>
        <h2>Form data:</h2>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      <div>
        <h2>Field data:</h2>
        <pre>{JSON.stringify({ optional: checked, ...fieldData }, null, 2)}</pre>
      </div>
    </form>
  );
};

export const WithinFormReset = () => {
  const [controlled, setControlled] = React.useState(true);

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <p>
        Toggle the switches, then press <strong>Reset</strong>. Each switch returns to its initial
        value (the uncontrolled switch via its <code>defaultChecked</code>, the controlled switch
        via its initial <code>checked</code> state).
      </p>

      <fieldset>
        <legend>Uncontrolled (defaultChecked)</legend>
        <label>
          <Switch.Root className={styles.root} name="uncontrolled" defaultChecked>
            <Switch.Thumb className={styles.thumb} />
          </Switch.Root>{' '}
          with label
        </label>
      </fieldset>

      <br />

      <fieldset>
        <legend>Controlled checked: {String(controlled)}</legend>
        <label>
          <Switch.Root
            className={styles.root}
            name="controlled"
            checked={controlled}
            onCheckedChange={setControlled}
          >
            <Switch.Thumb className={styles.thumb} />
          </Switch.Root>{' '}
          with label
        </label>
      </fieldset>

      <br />

      <button type="reset">Reset</button>
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
