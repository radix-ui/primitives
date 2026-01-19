import * as React from 'react';
import { Direction, Slider } from 'radix-ui';
import serialize from 'form-serialize';
import styles from './slider.stories.module.css';

export default { title: 'Components/Slider' };

export const Styled = () => (
  <Slider.Root className={styles.root}>
    <Slider.Track className={styles.track}>
      <Slider.Range className={styles.range} />
    </Slider.Track>
    <Slider.Thumb className={styles.thumb} />
  </Slider.Root>
);

export const WithOnValueCommit = () => (
  <>
    <Slider.Root className={styles.root} defaultValue={[20]} onValueCommit={console.log}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <p>Check the console for the `onValueCommit` log</p>
  </>
);

export const RightToLeft = () => (
  <Slider.Root className={styles.root} dir="rtl">
    <Slider.Track className={styles.track}>
      <Slider.Range className={styles.range} />
    </Slider.Track>
    <Slider.Thumb className={styles.thumb} />
  </Slider.Root>
);

export const Horizontal = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
    <Slider.Root
      className={styles.root}
      defaultValue={[10, 30]}
      minStepsBetweenThumbs={1}
      onValueChange={(value) => console.log(value)}
    >
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <Slider.Root className={styles.root} defaultValue={[10]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', gap: 50 }}>
    <Slider.Root className={styles.root} defaultValue={[10, 30]} orientation="vertical">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <Slider.Root className={styles.root} defaultValue={[10]} orientation="vertical">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
  </div>
);

export const Inversions = () => (
  <>
    <h1>Inversions</h1>
    <h2>Horizontal</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <div style={{ flex: 1 }}>
        <h3>LTR</h3>
        <h4>default</h4>
        <Slider.Root className={styles.root} defaultValue={[20]}>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>

        <h4>Inverted</h4>
        <Slider.Root className={styles.root} defaultValue={[20]} inverted>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>
      </div>

      <div style={{ flex: 1 }}>
        <h3>RTL</h3>
        <h4>Default</h4>
        <Slider.Root className={styles.root} defaultValue={[20]} dir="rtl">
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>

        <h4>Inverted</h4>
        <Slider.Root className={styles.root} defaultValue={[20]} dir="rtl" inverted>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>
      </div>
    </div>

    <h2>Vertical</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <div style={{ flex: 1 }}>
        <h3>LTR</h3>
        <div style={{ display: 'flex', gap: 50 }}>
          <div>
            <h4>Default</h4>
            <Slider.Root className={styles.root} defaultValue={[20]} orientation="vertical">
              <Slider.Track className={styles.track}>
                <Slider.Range className={styles.range} />
              </Slider.Track>
              <Slider.Thumb className={styles.thumb} />
            </Slider.Root>
          </div>

          <div>
            <h4>Inverted</h4>
            <Slider.Root
              className={styles.root}
              defaultValue={[20]}
              orientation="vertical"
              inverted
            >
              <Slider.Track className={styles.track}>
                <Slider.Range className={styles.range} />
              </Slider.Track>
              <Slider.Thumb className={styles.thumb} />
            </Slider.Root>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h3>RTL</h3>
        <div style={{ display: 'flex', gap: 50 }}>
          <div>
            <h4>Default</h4>
            <Slider.Root
              className={styles.root}
              defaultValue={[20]}
              dir="rtl"
              orientation="vertical"
            >
              <Slider.Track className={styles.track}>
                <Slider.Range className={styles.range} />
              </Slider.Track>
              <Slider.Thumb className={styles.thumb} />
            </Slider.Root>
          </div>

          <div>
            <h4>Inverted</h4>
            <Slider.Root
              className={styles.root}
              defaultValue={[20]}
              dir="rtl"
              orientation="vertical"
              inverted
            >
              <Slider.Track className={styles.track}>
                <Slider.Range className={styles.range} />
              </Slider.Track>
              <Slider.Thumb className={styles.thumb} />
            </Slider.Root>
          </div>
        </div>
      </div>
    </div>
  </>
);

export const WithMinimumStepsBetweenThumbs = () => (
  <Slider.Root className={styles.root} defaultValue={[10, 30]} minStepsBetweenThumbs={3}>
    <Slider.Track className={styles.track}>
      <Slider.Range className={styles.range} />
    </Slider.Track>
    <Slider.Thumb className={styles.thumb} />
    <Slider.Thumb className={styles.thumb} />
  </Slider.Root>
);

export const WithMultipleRanges = () => {
  const [minStepsBetweenThumbs, setMinStepsBetweenThumbs] = React.useState(0);

  return (
    <>
      <label>
        Minimum steps between thumbs:{' '}
        <input
          type="number"
          value={minStepsBetweenThumbs}
          onChange={(event) => setMinStepsBetweenThumbs(Number(event.target.value))}
          style={{ width: 30 }}
        />
      </label>

      <br />
      <br />

      <Slider.Root
        className={styles.root}
        defaultValue={[10, 15, 20, 80]}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
        <Slider.Thumb className={styles.thumb} />
        <Slider.Thumb className={styles.thumb} />
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
    </>
  );
};

export const SmallSteps = () => {
  const [value, setValue] = React.useState([0.1]);
  return (
    <>
      <Slider.Root
        className={styles.root}
        value={value}
        onValueChange={setValue}
        min={0.1}
        max={0.2}
        step={0.003}
      >
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
      <div>{value}</div>
    </>
  );
};

export const WithinForm = () => {
  const [data, setData] = React.useState({
    single: [0],
    multiple: [10, 15, 20, 80],
    price: {
      min: 30,
      max: 70,
    },
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log(serialize(event.currentTarget, { hash: true }));
      }}
      onChange={(event) => {
        const formData = serialize(event.currentTarget, { hash: true });
        setData(formData as any);
      }}
    >
      <fieldset>
        <legend>Single value: {String(data.single)}</legend>
        <Slider.Root name="single" defaultValue={data.single} className={styles.root}>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>Multiple value: {String(data.multiple)}</legend>
        <Slider.Root name="multiple" defaultValue={data.multiple} className={styles.root}>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} />
          <Slider.Thumb className={styles.thumb} />
          <Slider.Thumb className={styles.thumb} />
          <Slider.Thumb className={styles.thumb} />
        </Slider.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>Multiple values (with named thumbs): {JSON.stringify(data.price)}</legend>
        <Slider.Root defaultValue={[data.price.min, data.price.max]} className={styles.root}>
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} name="price[min]" />
          <Slider.Thumb className={styles.thumb} name="price[max]" />
        </Slider.Root>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
};

export const Strict = () => (
  <React.StrictMode>
    <Slider.Root className={styles.root}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <Slider.Root className={styles.root} defaultValue={[10, 15, 20, 80]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
  </React.StrictMode>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>LTR</h2>
    <Slider.Root className={styles.root} defaultValue={[20]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <Slider.Root className={styles.root} defaultValue={[10, 30]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>RTL</h2>
    <Slider.Root className={styles.root} defaultValue={[20]} dir="rtl">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <Slider.Root className={styles.root} defaultValue={[10, 30]} dir="rtl">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>Multiple ranges</h2>
    <Slider.Root className={styles.root} defaultValue={[10, 15, 20, 80]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h1>Controlled</h1>
    <h2>LTR</h2>
    <Slider.Root className={styles.root} value={[20]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <Slider.Root className={styles.root} value={[10, 30]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h1>Direction</h1>
    <h2>Prop</h2>
    <Slider.Root className={styles.root} value={[20]} dir="rtl">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
    <Slider.Root className={styles.root} value={[10, 30]} dir="rtl">
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>Inherited</h2>
    <Direction.Provider dir="rtl">
      <Slider.Root className={styles.root} value={[20]}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
      <Slider.Root className={styles.root} value={[10, 30]}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
    </Direction.Provider>

    <h1>Scenarios</h1>
    <h2>Extremes</h2>
    <Slider.Root className={styles.root} defaultValue={[0, 100]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>0 case</h2>
    <Slider.Root className={styles.root} defaultValue={[0]} min={-100} max={100}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>Multiple ranges</h2>
    <Slider.Root className={styles.root} value={[10, 15, 20, 80]}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>Vertical</h2>
    <div style={{ display: 'flex' }}>
      <Slider.Root className={styles.root} defaultValue={[10, 30]} orientation="vertical">
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
      <Slider.Root className={styles.root} defaultValue={[20]} orientation="vertical">
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb className={styles.thumb} />
      </Slider.Root>
    </div>

    <h2>Out of bound value (negative)</h2>
    <Slider.Root className={styles.root} defaultValue={[-9000]} min={0} max={100}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h2>Out of bound value (positive)</h2>
    <Slider.Root className={styles.root} defaultValue={[9000]} min={0} max={100}>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <h1>Disabled</h1>
    <Slider.Root className={styles.root} defaultValue={[20]} disabled>
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>

    <Inversions />

    <h1>State attributes</h1>
    <h2>Default</h2>
    <Slider.Root className={styles.rootAttr} defaultValue={[20]}>
      <Slider.Track className={styles.trackAttr}>
        <Slider.Range className={styles.rangeAttr} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumbAttr} />
    </Slider.Root>

    <h2>Disabled</h2>
    <Slider.Root className={styles.rootAttr} defaultValue={[20]} disabled>
      <Slider.Track className={styles.trackAttr}>
        <Slider.Range className={styles.rangeAttr} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumbAttr} />
    </Slider.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
