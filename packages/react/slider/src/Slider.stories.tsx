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
  const [isFocus, setIsFocus] = React.useState([false, false]);
  const handleBlur = () => setIsFocus([false, false]);

  return (
    <Slider as={Root} defaultValue={10} style={{ height: 15 }}>
      <Slider.Track as={Track} style={{ height: 4 }}>
        <Slider.Range as={Range} style={{ height: '100%' }} />
      </Slider.Track>
      <Slider.Thumb
        as={Thumb}
        style={{ top: '50%' }}
        focused={isFocus[0]}
        onFocus={() => setIsFocus([true, false])}
        onBlur={handleBlur}
      />
      <Slider.Thumb
        as={Thumb}
        focused={isFocus[1]}
        style={{ top: '50%' }}
        onFocus={() => setIsFocus([false, true])}
        onBlur={handleBlur}
      />
    </Slider>
  );
};

export const Vertical = () => {
  const [isFocus, setIsFocus] = React.useState([false, false]);
  const handleBlur = () => setIsFocus([false, false]);

  return (
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
        style={{ left: '50%' }}
        focused={isFocus[0]}
        onFocus={() => setIsFocus([true, false])}
        onBlur={handleBlur}
      />
      <Slider.Thumb
        as={Thumb}
        focused={isFocus[1]}
        style={{ left: '50%' }}
        onFocus={() => setIsFocus([false, true])}
        onBlur={handleBlur}
      />
    </Slider>
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
  <span {...props} ref={ref} style={{ ...styles.range, ...props.style, background: 'black' }} />
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
