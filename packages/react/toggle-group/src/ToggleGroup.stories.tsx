import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import { css } from '../../../../stitches.config';

export default {
  title: 'Components/ToggleGroup',
};

export const Single = () => {
  const [value, setValue] = React.useState<string>();
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup type="single" className={rootClass} aria-label="Options" defaultValue="1">
        <ToggleGroupItem value="1" className={itemClass}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" className={itemClass}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" className={itemClass}>
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>

      <h1>Controlled</h1>
      <ToggleGroup
        type="single"
        className={rootClass}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="1" className={itemClass}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" className={itemClass}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" className={itemClass}>
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
};

export const Vertical = () => {
  return (
    <ToggleGroup
      type="single"
      orientation="vertical"
      className={rootClass}
      aria-label="Options"
      defaultValue="1"
    >
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass}>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const Multiple = () => {
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup type="multiple" className={rootClass} aria-label="Options" defaultValue={['1']}>
        <ToggleGroupItem value="1" className={itemClass}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" className={itemClass}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" className={itemClass}>
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>

      <h1>Controlled</h1>
      <ToggleGroup
        type="multiple"
        className={rootClass}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="1" className={itemClass}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" className={itemClass}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" className={itemClass}>
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
};

export const Chromatic = () => (
  <>
    <h1>Single</h1>

    <h2>Off</h2>
    <ToggleGroup type="single" className={rootClass}>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass} disabled>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>On</h2>
    <ToggleGroup type="single" className={rootClass} defaultValue="1">
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass} disabled>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>Disabled</h2>
    <ToggleGroup type="single" className={rootClass} disabled>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass}>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h1>Multiple</h1>
    <h2>Off</h2>
    <ToggleGroup type="multiple" className={rootClass}>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass} disabled>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>One on</h2>
    <ToggleGroup type="multiple" className={rootClass} defaultValue={['1']}>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass} disabled>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>One and two on</h2>
    <ToggleGroup type="multiple" className={rootClass} defaultValue={['1', '2']}>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass}>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>Disabled</h2>
    <ToggleGroup type="multiple" className={rootClass} disabled>
      <ToggleGroupItem value="1" className={itemClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemClass}>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>

    <h1>State attributes</h1>
    <h2>Group disabled</h2>
    <ToggleGroup type="multiple" className={rootClass} defaultValue={['1', '2']} disabled>
      <ToggleGroupItem value="1" className={itemAttrClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemAttrClass}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemAttrClass}>
        Option 3
      </ToggleGroupItem>
      <ToggleGroupItem value="4" className={itemAttrClass}>
        Option 4
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>Group enabled with button override</h2>
    <ToggleGroup type="multiple" className={rootClass} defaultValue={['1', '2']} disabled={false}>
      <ToggleGroupItem value="1" className={itemAttrClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemAttrClass} disabled>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemAttrClass}>
        Option 3
      </ToggleGroupItem>
      <ToggleGroupItem value="4" className={itemAttrClass} disabled>
        Option 4
      </ToggleGroupItem>
    </ToggleGroup>

    <h2>Group disabled with button override</h2>
    <ToggleGroup type="multiple" className={rootClass} defaultValue={['1', '2']} disabled={true}>
      <ToggleGroupItem value="1" className={itemAttrClass}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" className={itemAttrClass} disabled={false}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" className={itemAttrClass}>
        Option 3
      </ToggleGroupItem>
      <ToggleGroupItem value="4" className={itemAttrClass} disabled={false}>
        Option 4
      </ToggleGroupItem>
    </ToggleGroup>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const rootClass = css({
  display: 'inline-flex',
  gap: 5,
  padding: 5,
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
});

const itemClass = css({
  border: '1px solid $black',
  borderRadius: 6,
  padding: '5px 10px',
  fontSize: 13,
  backgroundColor: '$white',
  color: '$black',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },

  '&:disabled': {
    opacity: 0.5,
  },

  '&[data-state="on"]': {
    backgroundColor: '$black',
    color: '$white',
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="off"]': { borderColor: 'red' },
  '&[data-state="on"]': { borderColor: 'green' },
  '&[data-disabled]': { borderStyle: 'dashed' },
  '&:disabled': { opacity: 0.5 },
};
const itemAttrClass = css(styles);
