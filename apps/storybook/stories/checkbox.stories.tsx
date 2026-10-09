/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { Checkbox, Label as LabelPrimitive } from 'radix-ui';
import styles from './checkbox.stories.module.css';

export default { title: 'Components/Checkbox' };

export const Styled = () => (
  <>
    <p>This checkbox is nested inside a label. The state is uncontrolled.</p>

    <h1>Custom label</h1>
    <Label>
      Label{' '}
      <Checkbox.unstable_Provider>
        <Checkbox.unstable_Trigger className={styles.root}>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.unstable_Trigger>
      </Checkbox.unstable_Provider>
    </Label>

    <br />
    <br />

    <h1>Native label</h1>
    <label>
      Label{' '}
      <Checkbox.unstable_Provider>
        <Checkbox.unstable_Trigger className={styles.root}>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.unstable_Trigger>
      </Checkbox.unstable_Provider>
    </label>

    <h1>Native label + native checkbox</h1>
    <label>
      Label <input type="checkbox" />
    </label>

    <h1>Custom label + htmlFor</h1>
    <Label htmlFor="one">Label</Label>
    <Checkbox.unstable_Provider>
      <Checkbox.unstable_Trigger className={styles.root} id="one">
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.unstable_Trigger>
    </Checkbox.unstable_Provider>

    <br />
    <br />

    <h1>Native label + htmlFor</h1>
    <label htmlFor="two">Label</label>
    <Checkbox.unstable_Provider>
      <Checkbox.unstable_Trigger className={styles.root} id="two">
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.unstable_Trigger>
    </Checkbox.unstable_Provider>

    <h1>Native label + native checkbox</h1>
    <label htmlFor="three">Label</label>
    <input type="checkbox" id="three" />
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(true);

  return (
    <>
      <p>This checkbox is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">Label</Label>{' '}
      <Checkbox.unstable_Provider checked={checked} onCheckedChange={setChecked}>
        <Checkbox.unstable_Trigger className={styles.root} id="randBox">
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.unstable_Trigger>
      </Checkbox.unstable_Provider>
    </>
  );
};

export const Indeterminate = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox.unstable_Provider checked={checked} onCheckedChange={setChecked}>
          <Checkbox.unstable_Trigger className={styles.root}>
            <Checkbox.Indicator className={styles.indicator} />
          </Checkbox.unstable_Trigger>
        </Checkbox.unstable_Provider>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate',
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const WithinForm = () => {
  const [formData, setFormData] = React.useState<Record<string, boolean>>({});
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');
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
          <Checkbox.Root
            className={styles.root}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Checkbox.Indicator className={styles.indicator} />
          </Checkbox.Root>{' '}
          with label
        </label>
        <br />
        <br />

        <button
          type="button"
          onClick={() => {
            setChecked((v) => (v === 'indeterminate' ? false : 'indeterminate'));
          }}
        >
          Toggle indeterminate
        </button>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required field (1 is required)</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <Checkbox.unstable_Provider
              name={`required-${value}`}
              required={value === '1'}
              checked={fieldData[`required-${value}`] ?? false}
              onCheckedChange={(nextChecked) =>
                setFieldChecked('required', value, nextChecked === true)
              }
            >
              <Checkbox.unstable_Trigger className={styles.root} id={`required-${value}`}>
                <Checkbox.Indicator className={styles.indicator} />
              </Checkbox.unstable_Trigger>
              <Checkbox.unstable_BubbleInput />
            </Checkbox.unstable_Provider>{' '}
            <label htmlFor={`required-${value}`}>{value}</label>
          </div>
        ))}
      </fieldset>

      <br />

      <fieldset>
        <legend>With stop propagation</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <Checkbox.unstable_Provider
              name={`stopprop-${value}`}
              checked={fieldData[`stopprop-${value}`] ?? false}
              onCheckedChange={(nextChecked) =>
                setFieldChecked('stopprop', value, nextChecked === true)
              }
            >
              <Checkbox.unstable_Trigger
                className={styles.root}
                onClick={(event) => event.stopPropagation()}
                id={`stopprop-${value}`}
              >
                <Checkbox.Indicator className={styles.indicator} />
              </Checkbox.unstable_Trigger>
              <Checkbox.unstable_BubbleInput />
            </Checkbox.unstable_Provider>{' '}
            <label htmlFor={`stopprop-${value}`}>{value}</label>
          </div>
        ))}
      </fieldset>

      <br />

      <fieldset>
        <legend>no bubble input</legend>
        <Checkbox.unstable_Provider name="nobubble">
          <Checkbox.unstable_Trigger className={styles.root}>
            <Checkbox.Indicator className={styles.indicator} />
          </Checkbox.unstable_Trigger>
        </Checkbox.unstable_Provider>
      </fieldset>

      <br />

      <fieldset>
        <legend>native inputs (1 is required)</legend>
        {['1', '2', '3', '4'].map((value) => (
          <div key={value}>
            <input
              type="checkbox"
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

export const LegacyStyled = () => (
  <>
    <p>This checkbox is nested inside a label. The state is uncontrolled.</p>

    <h1>Custom label</h1>
    <Label>
      Label{' '}
      <Checkbox.Root className={styles.root}>
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </Label>

    <br />
    <br />

    <h1>Native label</h1>
    <label>
      Label{' '}
      <Checkbox.Root className={styles.root}>
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </label>

    <h1>Native label + native checkbox</h1>
    <label>
      Label <input type="checkbox" />
    </label>

    <h1>Custom label + htmlFor</h1>
    <Label htmlFor="one">Label</Label>
    <Checkbox.Root className={styles.root} id="one">
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <br />
    <br />

    <h1>Native label + htmlFor</h1>
    <label htmlFor="two">Label</label>
    <Checkbox.Root className={styles.root} id="two">
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Native label + native checkbox</h1>
    <label htmlFor="three">Label</label>
    <input type="checkbox" id="three" />
  </>
);

export const LegacyControlled = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(true);

  return (
    <>
      <p>This checkbox is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">Label</Label>{' '}
      <Checkbox.Root
        className={styles.root}
        checked={checked}
        onCheckedChange={setChecked}
        id="randBox"
      >
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </>
  );
};

export const LegacyIndeterminate = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox.Root className={styles.root} checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate',
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const LegacyWithinForm = () => {
  const [data, setData] = React.useState({ optional: false, required: false, stopprop: false });
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

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
          <Checkbox.Root
            className={styles.root}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Checkbox.Indicator className={styles.indicator} />
          </Checkbox.Root>{' '}
          with label
        </label>
        <br />
        <br />

        <button
          type="button"
          onClick={() => {
            setChecked((prevChecked) => {
              return prevChecked === 'indeterminate' ? false : 'indeterminate';
            });
          }}
        >
          Toggle indeterminate
        </button>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Checkbox.Root className={styles.root} name="required" required>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Checkbox.Root
          className={styles.root}
          name="stopprop"
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <button type="reset">Reset</button>
      <button>Submit</button>
    </form>
  );
};

export const LegacyAnimated = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox.Root className={styles.root} checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Indicator className={[styles.indicator, styles.animatedIndicator].join(' ')} />
        </Checkbox.Root>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate',
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const LegacyChromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Unchecked</h2>
    <Checkbox.Root className={styles.root}>
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={styles.root} defaultChecked>
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Controlled</h1>
    <h2>Unchecked</h2>
    <Checkbox.Root className={styles.root} checked={false}>
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={styles.root} checked>
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Indeterminate</h1>
    <Checkbox.Root className={styles.root} checked="indeterminate">
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Disabled</h1>
    <Checkbox.Root className={styles.root} defaultChecked disabled>
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Force mounted indicator</h1>
    <Checkbox.Root className={styles.root}>
      <Checkbox.Indicator className={styles.indicator} forceMount style={{ height: 20 }} />
    </Checkbox.Root>

    <h1>State attributes</h1>
    <h2>Unchecked</h2>
    <Checkbox.Root className={styles.rootAttr}>
      <Checkbox.Indicator className={styles.indicatorAttr} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={styles.rootAttr} defaultChecked>
      <Checkbox.Indicator className={styles.indicatorAttr} />
    </Checkbox.Root>

    <h2>Indeterminate</h2>
    <Checkbox.Root className={styles.rootAttr} checked="indeterminate">
      <Checkbox.Indicator className={styles.indicatorAttr} />
    </Checkbox.Root>

    <h2>Disabled</h2>
    <Checkbox.Root className={styles.rootAttr} defaultChecked disabled>
      <Checkbox.Indicator className={styles.indicatorAttr} />
    </Checkbox.Root>

    <h2>Force mounted indicator</h2>
    <Checkbox.Root className={styles.rootAttr}>
      <Checkbox.Indicator className={styles.indicatorAttr} forceMount style={{ height: 20 }} />
    </Checkbox.Root>
  </>
);
LegacyChromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive.Root {...props} className={styles.label} />;
