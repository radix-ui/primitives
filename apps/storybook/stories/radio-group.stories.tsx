/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { Direction, Label as LabelPrimitive, RadioGroup } from 'radix-ui';
import styles from './radio-group.stories.module.css';

export default { title: 'Components/RadioGroup' };

export const Parts = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={styles.root} defaultValue="1">
      <Label>
        <RadioGroup.unstable_ItemProvider value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemProvider>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemProvider value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemProvider>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemProvider value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemProvider>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const PartsWithinForm = () => {
  const [data, setData] = React.useState({ required: '', stopprop: '' });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const radio = event.target as unknown as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [radio.name]: radio.value }));
      }}
    >
      <fieldset>
        <legend>required value: {data.required}</legend>
        <RadioGroup.Root className={styles.root} name="required" required>
          {['1', '2', '3'].map((value) => (
            <RadioGroup.unstable_ItemProvider key={value} value={value}>
              <RadioGroup.unstable_ItemTrigger className={styles.item}>
                <RadioGroup.Indicator className={styles.indicator} />
              </RadioGroup.unstable_ItemTrigger>
              <RadioGroup.unstable_ItemBubbleInput />
            </RadioGroup.unstable_ItemProvider>
          ))}
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation value: {data.stopprop}</legend>
        <RadioGroup.Root className={styles.root} name="stopprop">
          {['1', '2', '3'].map((value) => (
            <RadioGroup.unstable_ItemProvider key={value} value={value}>
              <RadioGroup.unstable_ItemTrigger
                className={styles.item}
                onClick={(event) => event.stopPropagation()}
              >
                <RadioGroup.Indicator className={styles.indicator} />
              </RadioGroup.unstable_ItemTrigger>
              <RadioGroup.unstable_ItemBubbleInput />
            </RadioGroup.unstable_ItemProvider>
          ))}
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const LegacyStyled = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={styles.root} defaultValue="1">
      <Label>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const LegacyControlled = () => {
  const [value, setValue] = React.useState('2');

  return (
    <RadioGroup.Root className={styles.root} value={value} onValueChange={setValue}>
      <RadioGroup.Item className={styles.item} value="1">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item className={styles.item} value="2">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item className={styles.item} value="3">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

export const LegacyUnset = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={styles.root}>
      <Label>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={styles.item} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const LegacyWithinForm = () => {
  const [data, setData] = React.useState({ optional: '', required: '', stopprop: '' });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const radio = event.target as unknown as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [radio.name]: radio.value }));
      }}
    >
      <fieldset>
        <legend>optional value: {data.optional}</legend>
        <RadioGroup.Root className={styles.root} name="optional">
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="2">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required value: {data.required}</legend>
        <RadioGroup.Root className={styles.root} name="required" required>
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="2">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation value: {data.stopprop}</legend>
        <RadioGroup.Root className={styles.root} name="stopprop">
          <RadioGroup.Item
            className={styles.item}
            value="1"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={styles.item}
            value="2"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={styles.item}
            value="3"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const LegacyAnimated = () => {
  const indicatorClass = [styles.indicator, styles.animatedIndicator].join(' ');
  return (
    <Label>
      Favourite pet
      <RadioGroup.Root className={styles.root} defaultValue="1">
        <Label>
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={indicatorClass} />
          </RadioGroup.Item>
          Cat
        </Label>{' '}
        <Label>
          <RadioGroup.Item className={styles.item} value="2">
            <RadioGroup.Indicator className={indicatorClass} />
          </RadioGroup.Item>
          Dog
        </Label>{' '}
        <Label>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={indicatorClass} />
          </RadioGroup.Item>
          Rabbit
        </Label>
      </RadioGroup.Root>
    </Label>
  );
};

export const LegacyChromatic = () => {
  const manualFocusRef = React.useRef<React.ComponentRef<typeof RadioGroup.Item>>(null);

  React.useEffect(() => {
    manualFocusRef.current?.focus();
  }, []);

  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={styles.root} defaultValue="3">
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Controlled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={styles.root} value={null}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={styles.root} value="3">
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Disabled item</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Disabled root</h1>
      <RadioGroup.Root className={styles.root} disabled>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        {/* Not possible to set `disabled` back to `false` since it's set on the root (this item
            should still be disabled). */}
        <RadioGroup.Item className={styles.item} value="2" disabled={false}>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>All items disabled</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.Item className={styles.item} value="1" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Manual focus into group</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.Item className={styles.item} value="1" ref={manualFocusRef}>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Force mounted indicator</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} forceMount />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} forceMount />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} forceMount />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Direction</h1>
      <h2>Prop</h2>
      <RadioGroup.Root className={styles.root} defaultValue="1" dir="rtl">
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Inherited</h2>
      <Direction.Provider dir="rtl">
        <RadioGroup.Root className={styles.root} defaultValue="1">
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="2">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </Direction.Provider>

      <h1>State attributes</h1>
      <h2>Default</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.Item className={styles.itemAttr} value="1">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="2">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="3">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Disabled item</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.Item className={styles.itemAttr} value="1">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="3">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <RadioGroup.Root className={styles.rootAttr} defaultValue="2">
        <RadioGroup.Item className={styles.itemAttr} value="1">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="3">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Disabled root</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3" disabled>
        <RadioGroup.Item className={styles.itemAttr} value="1">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="2">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="3">
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>All items disabled</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.Item className={styles.itemAttr} value="1" disabled>
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
        <RadioGroup.Item className={styles.itemAttr} value="3" disabled>
          <RadioGroup.Indicator className={styles.indicatorAttr} />
        </RadioGroup.Item>
      </RadioGroup.Root>
    </>
  );
};
LegacyChromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive.Root {...props} className={styles.label} />;
