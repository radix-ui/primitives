import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import { Label as LabelPrimitive } from '@radix-ui/react-label';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';
import { DirectionProvider } from '@radix-ui/react-direction';
import * as RadioGroup from '@radix-ui/react-radio-group';

export default { title: 'Components/RadioGroup' };

export const Styled = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={rootClass()} defaultValue="1">
      <Label>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('2');

  return (
    <RadioGroup.Root className={rootClass()} value={value} onValueChange={setValue}>
      <RadioGroup.Item className={itemClass()} value="1">
        <RadioGroup.Indicator className={indicatorClass()} />
      </RadioGroup.Item>
      <RadioGroup.Item className={itemClass()} value="2">
        <RadioGroup.Indicator className={indicatorClass()} />
      </RadioGroup.Item>
      <RadioGroup.Item className={itemClass()} value="3">
        <RadioGroup.Indicator className={indicatorClass()} />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

export const Unset = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={rootClass()}>
      <Label>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="2" disabled>
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
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
        <RadioGroup.Root className={rootClass()} name="optional">
          <RadioGroup.Item className={itemClass()} value="1">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="2">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="3">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required value: {data.required}</legend>
        <RadioGroup.Root className={rootClass()} name="required" required>
          <RadioGroup.Item className={itemClass()} value="1">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="2">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="3">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation value: {data.stopprop}</legend>
        <RadioGroup.Root className={rootClass()} name="stopprop">
          <RadioGroup.Item
            className={itemClass()}
            value="1"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={itemClass()}
            value="2"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={itemClass()}
            value="3"
            onClick={(event) => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const Animated = () => (
  <Label>
    Favourite pet
    <RadioGroup.Root className={rootClass()} defaultValue="1">
      <Label>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={animatedIndicatorClass()} />
        </RadioGroup.Item>
        Cat
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={animatedIndicatorClass()} />
        </RadioGroup.Item>
        Dog
      </Label>{' '}
      <Label>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={animatedIndicatorClass()} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
);

export const Chromatic = () => {
  const manualFocusRef = React.useRef<React.ElementRef<typeof RadioGroup.Item>>(null);

  React.useEffect(() => {
    manualFocusRef.current?.focus();
  }, []);

  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={rootClass()}>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={rootClass()} defaultValue="3">
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Controlled</h1>
      <h2>Unset</h2>
      <RadioGroup.Root className={rootClass()} value="">
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Set</h2>
      <RadioGroup.Root className={rootClass()} value="3">
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Disabled</h1>
      <RadioGroup.Root className={rootClass()}>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2" disabled>
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Manual focus into group</h1>
      <RadioGroup.Root className={rootClass()}>
        <RadioGroup.Item className={itemClass()} value="1" ref={manualFocusRef}>
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Force mounted indicator</h1>
      <RadioGroup.Root className={rootClass()}>
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} forceMount />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} forceMount />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} forceMount />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h1>Direction</h1>
      <h2>Prop</h2>
      <RadioGroup.Root className={rootClass()} defaultValue="1" dir="rtl">
        <RadioGroup.Item className={itemClass()} value="1">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="2">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemClass()} value="3">
          <RadioGroup.Indicator className={indicatorClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Inherited</h2>
      <DirectionProvider dir="rtl">
        <RadioGroup.Root className={rootClass()} defaultValue="1">
          <RadioGroup.Item className={itemClass()} value="1">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="2">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
          <RadioGroup.Item className={itemClass()} value="3">
            <RadioGroup.Indicator className={indicatorClass()} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </DirectionProvider>

      <h1>State attributes</h1>
      <h2>Default</h2>
      <RadioGroup.Root className={rootAttrClass()} defaultValue="3">
        <RadioGroup.Item className={itemAttrClass()} value="1">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="2">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="3">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <h2>Disabled</h2>
      <RadioGroup.Root className={rootAttrClass()} defaultValue="3">
        <RadioGroup.Item className={itemAttrClass()} value="1">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="2" disabled>
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="3">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <RadioGroup.Root className={rootAttrClass()} defaultValue="2">
        <RadioGroup.Item className={itemAttrClass()} value="1">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="2" disabled>
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
        <RadioGroup.Item className={itemAttrClass()} value="3">
          <RadioGroup.Indicator className={indicatorAttrClass()} />
        </RadioGroup.Item>
      </RadioGroup.Root>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />;

const rootClass = css({});

const RECOMMENDED_CSS__RADIO_GROUP__ITEM = {
  // better default alignment
  verticalAlign: 'middle',
};

const itemClass = css({
  ...RECOMMENDED_CSS__RADIO_GROUP__ITEM,
  width: 30,
  height: 30,
  display: 'inline-grid',
  padding: 0,
  placeItems: 'center',
  border: '1px solid $gray300',
  borderRadius: 9999,

  '&:focus': {
    outline: 'none',
    borderColor: '$red',
    boxShadow: '0 0 0 1px $colors$red',
  },

  '&[data-disabled]': {
    opacity: 0.5,
  },
});

const indicatorClass = css({
  width: 18,
  height: 18,
  backgroundColor: '$red',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'inherit',
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const animatedIndicatorClass = css(indicatorClass, {
  '&[data-state="checked"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="unchecked"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&:disabled': { opacity: 0.5 },
  '&[data-disabled]': { borderStyle: 'dashed' },

  '&[data-state="unchecked"]': { borderColor: 'red' },
  '&[data-state="checked"]': { borderColor: 'green' },
};
const rootAttrClass = css(styles);
const itemAttrClass = css(styles);
const indicatorAttrClass = css(styles);
