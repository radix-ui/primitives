/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import type { Meta } from '@storybook/react';
import { Direction, Label as LabelPrimitive, RadioGroup } from 'radix-ui';
import styles from './radio-group.stories.module.css';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup.Root,
} satisfies Meta<typeof RadioGroup.Root>;

export const Styled = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={styles.root} defaultValue="1">
      <Label>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('2');

  return (
    <RadioGroup.Root className={styles.root} value={value} onValueChange={setValue}>
      <RadioGroup.unstable_ItemRoot value="1">
        <RadioGroup.unstable_ItemTrigger className={styles.item}>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.unstable_ItemTrigger>
      </RadioGroup.unstable_ItemRoot>
      <RadioGroup.unstable_ItemRoot value="2">
        <RadioGroup.unstable_ItemTrigger className={styles.item}>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.unstable_ItemTrigger>
      </RadioGroup.unstable_ItemRoot>
      <RadioGroup.unstable_ItemRoot value="3">
        <RadioGroup.unstable_ItemTrigger className={styles.item}>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.unstable_ItemTrigger>
      </RadioGroup.unstable_ItemRoot>
    </RadioGroup.Root>
  );
};

export const Unset = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={styles.root}>
      <Label>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const WithinForm = () => {
  const [data, setData] = React.useState({ optional: '', required: '', stopprop: '' });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const radio = event.target as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [radio.name]: radio.value }));
      }}
    >
      <fieldset>
        <legend>optional value: {data.optional}</legend>
        <RadioGroup.Root className={styles.root} name="optional">
          <RadioGroup.unstable_ItemRoot value="1">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="2">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="3">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required value: {data.required}</legend>
        <RadioGroup.Root className={styles.root} name="required" required>
          <RadioGroup.unstable_ItemRoot value="1">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="2">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="3">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation value: {data.stopprop}</legend>
        <RadioGroup.Root className={styles.root} name="stopprop">
          <RadioGroup.unstable_ItemRoot value="1">
            <RadioGroup.unstable_ItemTrigger
              onClick={(event) => event.stopPropagation()}
              className={styles.item}
            >
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="2">
            <RadioGroup.unstable_ItemTrigger
              onClick={(event) => event.stopPropagation()}
              className={styles.item}
            >
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="3">
            <RadioGroup.unstable_ItemTrigger
              onClick={(event) => event.stopPropagation()}
              className={styles.item}
            >
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemRoot>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const Animated = () => {
  const indicatorClass = [styles.indicator, styles.animatedIndicator].join(' ');
  return (
    <Label>
      Favourite pet
      <RadioGroup.Root className={styles.root} defaultValue="1">
        <Label>
          <RadioGroup.unstable_ItemRoot value="1">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={indicatorClass} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
          Cat
        </Label>{' '}
        <Label>
          <RadioGroup.unstable_ItemRoot value="2">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={indicatorClass} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
          Dog
        </Label>{' '}
        <Label>
          <RadioGroup.unstable_ItemRoot value="3">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={indicatorClass} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
          Rabbit
        </Label>
      </RadioGroup.Root>
    </Label>
  );
};

export const Chromatic = () => {
  const manualFocusRef = React.useRef<React.ElementRef<typeof RadioGroup.Item>>(null);

  React.useEffect(() => {
    manualFocusRef.current?.focus();
  }, []);

  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={styles.root} defaultValue="3">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Controlled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={styles.root} value={null}>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={styles.root} value="3">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Disabled item</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Disabled root</h1>
      <RadioGroup.Root className={styles.root} disabled>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        {/* Not possible to set `disabled` back to `false` since it's set on the root (this item
            should still be disabled). */}
        <RadioGroup.unstable_ItemRoot value="2" disabled={false}>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>All items disabled</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.unstable_ItemRoot value="1" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Manual focus into group</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item} ref={manualFocusRef}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Force mounted indicator</h1>
      <RadioGroup.Root className={styles.root}>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} forceMount />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} forceMount />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} forceMount />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h1>Direction</h1>
      <h2>Prop</h2>
      <RadioGroup.Root className={styles.root} defaultValue="1" dir="rtl">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.item}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>Inherited</h2>
      <Direction.Provider dir="rtl">
        <RadioGroup.Root className={styles.root} defaultValue="1">
          <RadioGroup.unstable_ItemRoot value="1">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="2">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
          <RadioGroup.unstable_ItemRoot value="3">
            <RadioGroup.unstable_ItemTrigger className={styles.item}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.unstable_ItemTrigger>
          </RadioGroup.unstable_ItemRoot>
        </RadioGroup.Root>
      </Direction.Provider>

      <h1>State attributes</h1>
      <h2>Default</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>Disabled item</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <RadioGroup.Root className={styles.rootAttr} defaultValue="2">
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>Disabled root</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3" disabled>
        <RadioGroup.unstable_ItemRoot value="1">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3">
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>

      <h2>All items disabled</h2>
      <RadioGroup.Root className={styles.rootAttr} defaultValue="3">
        <RadioGroup.unstable_ItemRoot value="1" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="2" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
        <RadioGroup.unstable_ItemRoot value="3" disabled>
          <RadioGroup.unstable_ItemTrigger className={styles.itemAttr}>
            <RadioGroup.Indicator className={styles.indicatorAttr} />
          </RadioGroup.unstable_ItemTrigger>
        </RadioGroup.unstable_ItemRoot>
      </RadioGroup.Root>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive.Root {...props} className={styles.label} />;
