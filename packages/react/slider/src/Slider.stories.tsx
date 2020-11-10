import * as React from 'react';
import { Slider, styles } from './Slider';

export default { title: 'Slider' };

export const Basic = () => (
  <Slider defaultValue={10} style={styles.root}>
    <Slider.Track style={styles.track}>
      <Slider.Range style={styles.range} />
    </Slider.Track>
    <Slider.Thumb style={styles.thumb} />
  </Slider>
);

export const Horizontal = () => {
  const [isFocusRange, setIsFocusRange] = React.useState([false, false]);
  const [isFocusSingle, setIsFocusSingle] = React.useState(false);

  return (
    <>
      <Slider as={Root} defaultValue={[10, 30]} style={{ height: 15 }}>
        <Slider.Track as={Track} style={{ height: 4 }}>
          <Slider.Range as={Range} style={{ height: '100%' }} />
        </Slider.Track>
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[0]}
          onFocus={() => setIsFocusRange([true, false])}
          onBlur={() => setIsFocusRange([false, false])}
        />
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[1]}
          onFocus={() => setIsFocusRange([false, true])}
          onBlur={() => setIsFocusRange([false, false])}
        />
      </Slider>

      <br />

      <Slider as={Root} defaultValue={10} style={{ height: 15 }}>
        <Slider.Track as={Track} style={{ height: 4 }}>
          <Slider.Range as={Range} style={{ height: '100%' }} />
        </Slider.Track>
        <Slider.Thumb
          as={Thumb}
          focused={isFocusSingle}
          onFocus={() => setIsFocusSingle(true)}
          onBlur={() => setIsFocusSingle(false)}
        />
      </Slider>
    </>
  );
};

export const Vertical = () => {
  const [isFocusRange, setIsFocusRange] = React.useState([false, false]);
  const [isFocusSingle, setIsFocusSingle] = React.useState(false);

  return (
    <>
      <Slider
        as={Root}
        defaultValue={[10, 30]}
        orientation="vertical"
        style={{ width: 15, flexDirection: 'column' }}
      >
        <Slider.Track as={Track} style={{ height: '300px', width: 4 }}>
          <Slider.Range as={Range} style={{ width: '100%' }} />
        </Slider.Track>
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[0]}
          onFocus={() => setIsFocusRange([true, false])}
          onBlur={() => setIsFocusRange([false, false])}
        />
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[1]}
          onFocus={() => setIsFocusRange([false, true])}
          onBlur={() => setIsFocusRange([false, false])}
        />
      </Slider>

      <br />

      <Slider
        as={Root}
        defaultValue={10}
        orientation="vertical"
        style={{ width: 15, flexDirection: 'column' }}
      >
        <Slider.Track as={Track} style={{ height: '300px', width: 4 }}>
          <Slider.Range as={Range} style={{ width: '100%' }} />
        </Slider.Track>
        <Slider.Thumb
          as={Thumb}
          focused={isFocusSingle}
          onFocus={() => setIsFocusSingle(true)}
          onBlur={() => setIsFocusSingle(false)}
        />
      </Slider>
    </>
  );
};

export const WithMinimumStepsBetweenThumbs = () => {
  const [isFocusRange, setIsFocusRange] = React.useState([false, false]);

  return (
    <Slider as={Root} defaultValue={[10, 30]} style={{ height: 15 }} minStepsBetweenThumbs={3}>
      <Slider.Track as={Track} style={{ height: 4 }}>
        <Slider.Range as={Range} style={{ height: '100%' }} />
      </Slider.Track>
      <Slider.Thumb
        as={Thumb}
        focused={isFocusRange[0]}
        onFocus={() => setIsFocusRange([true, false])}
        onBlur={() => setIsFocusRange([false, false])}
      />
      <Slider.Thumb
        as={Thumb}
        focused={isFocusRange[1]}
        onFocus={() => setIsFocusRange([false, true])}
        onBlur={() => setIsFocusRange([false, false])}
      />
    </Slider>
  );
};

export const WithMultipleRanges = () => {
  const [isFocusRange, setIsFocusRange] = React.useState([false, false, false, false]);
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

      <Slider
        as={Root}
        defaultValue={[10, 15, 20, 80]}
        style={{ height: 15 }}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <Slider.Track as={Track} style={{ height: 4 }}>
          <Slider.Range as={Range} style={{ height: '100%' }} />
        </Slider.Track>
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[0]}
          onFocus={() => setIsFocusRange([true, false, false, false])}
          onBlur={() => setIsFocusRange([false, false, false, false])}
        />
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[1]}
          onFocus={() => setIsFocusRange([false, true, false, false])}
          onBlur={() => setIsFocusRange([false, false, false, false])}
        />
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[2]}
          onFocus={() => setIsFocusRange([false, false, true, false])}
          onBlur={() => setIsFocusRange([false, false, false, false])}
        />
        <Slider.Thumb
          as={Thumb}
          focused={isFocusRange[3]}
          onFocus={() => setIsFocusRange([false, false, false, true])}
          onBlur={() => setIsFocusRange([false, false, false, false])}
        />
      </Slider>
    </>
  );
};

const Root = React.forwardRef((props: any, ref) => (
  <span
    {...props}
    ref={ref}
    style={{ ...styles.root, ...props.style, display: 'flex', alignItems: 'center' }}
  />
));

const Track = React.forwardRef((props: any, ref) => (
  <span
    {...props}
    ref={ref}
    style={{ ...styles.track, ...props.style, background: 'gainsboro', borderRadius: 4 }}
  />
));

const Range = React.forwardRef((props: any, ref) => (
  <span
    {...props}
    ref={ref}
    style={{ ...styles.range, ...props.style, background: 'black', borderRadius: 'inherit' }}
  />
));

const Thumb = React.forwardRef(({ focused, ...props }: any, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      ...styles.thumb,
      ...props.style,
      borderRadius: 15,
      width: 15,
      height: 15,
      background: 'black',
      outline: focused ? `2px solid red` : undefined,
    }}
  />
));
