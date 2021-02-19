import * as React from 'react';
import { Slider, SliderTrack, SliderRange, SliderThumb } from './Slider';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Slider' };

export const Styled = () => (
  <Slider className={rootClass}>
    <SliderTrack className={trackClass}>
      <SliderRange className={rangeClass} />
    </SliderTrack>
    <SliderThumb className={thumbClass} />
  </Slider>
);

export const RightToLeft = () => (
  <Slider className={rootClass} dir="rtl">
    <SliderTrack className={trackClass}>
      <SliderRange className={rangeClass} />
    </SliderTrack>
    <SliderThumb className={thumbClass} />
  </Slider>
);

export const Horizontal = () => (
  <>
    <Slider
      className={rootClass}
      defaultValue={[10, 30]}
      minStepsBetweenThumbs={1}
      onValueChange={(value) => console.log(value)}
    >
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <br />

    <Slider className={rootClass} defaultValue={[10]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
  </>
);

export const Vertical = () => (
  <>
    <Slider className={rootClass} defaultValue={[10, 30]} orientation="vertical">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <br />

    <Slider className={rootClass} defaultValue={[10]} orientation="vertical">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
  </>
);

export const WithMinimumStepsBetweenThumbs = () => (
  <Slider className={rootClass} defaultValue={[10, 30]} minStepsBetweenThumbs={3}>
    <SliderTrack className={trackClass}>
      <SliderRange className={rangeClass} />
    </SliderTrack>
    <SliderThumb className={thumbClass} />
    <SliderThumb className={thumbClass} />
  </Slider>
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

      <Slider
        className={rootClass}
        defaultValue={[10, 15, 20, 80]}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <SliderTrack className={trackClass}>
          <SliderRange className={rangeClass} />
        </SliderTrack>
        <SliderThumb className={thumbClass} />
        <SliderThumb className={thumbClass} />
        <SliderThumb className={thumbClass} />
        <SliderThumb className={thumbClass} />
      </Slider>
    </>
  );
};

export const SmallSteps = () => {
  const [value, setValue] = React.useState([0.1]);
  return (
    <>
      <Slider
        className={rootClass}
        value={value}
        onValueChange={setValue}
        min={0.1}
        max={0.2}
        step={0.003}
      >
        <SliderTrack className={trackClass}>
          <SliderRange className={rangeClass} />
        </SliderTrack>
        <SliderThumb className={thumbClass} />
      </Slider>
      <div>{value}</div>
    </>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>LTR</h2>
    <Slider className={rootClass} defaultValue={[20]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
    <Slider className={rootClass} defaultValue={[10, 30]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>RTL</h2>
    <Slider className={rootClass} defaultValue={[20]} dir="rtl">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
    <Slider className={rootClass} defaultValue={[10, 30]} dir="rtl">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>Multiple ranges</h2>
    <Slider className={rootClass} defaultValue={[10, 15, 20, 80]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h1>Controlled</h1>
    <h2>LTR</h2>
    <Slider className={rootClass} value={[20]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
    <Slider className={rootClass} value={[10, 30]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>RTL</h2>
    <Slider className={rootClass} value={[20]} dir="rtl">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>
    <Slider className={rootClass} value={[10, 30]} dir="rtl">
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>Extremes</h2>
    <Slider className={rootClass} defaultValue={[0, 100]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>Multiple ranges</h2>
    <Slider className={rootClass} value={[10, 15, 20, 80]}>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
      <SliderThumb className={thumbClass} />
    </Slider>

    <h2>Vertical</h2>
    <div style={{ display: 'flex' }}>
      <Slider className={rootClass} defaultValue={[10, 30]} orientation="vertical">
        <SliderTrack className={trackClass}>
          <SliderRange className={rangeClass} />
        </SliderTrack>
        <SliderThumb className={thumbClass} />
        <SliderThumb className={thumbClass} />
      </Slider>
      <Slider className={rootClass} defaultValue={[20]} orientation="vertical">
        <SliderTrack className={trackClass}>
          <SliderRange className={rangeClass} />
        </SliderTrack>
        <SliderThumb className={thumbClass} />
      </Slider>
    </div>

    <h1>Disabled</h1>
    <Slider className={rootClass} defaultValue={[20]} disabled>
      <SliderTrack className={trackClass}>
        <SliderRange className={rangeClass} />
      </SliderTrack>
      <SliderThumb className={thumbClass} />
    </Slider>

    <h1>Data attribute selectors</h1>
    <h2>Default</h2>
    <Slider className={rootAttrClass} defaultValue={[20]}>
      <SliderTrack className={trackAttrClass}>
        <SliderRange className={rangeAttrClass} />
      </SliderTrack>
      <SliderThumb className={thumbAttrClass} />
    </Slider>

    <h2>Disabled</h2>
    <Slider className={rootAttrClass} defaultValue={[20]} disabled>
      <SliderTrack className={trackAttrClass}>
        <SliderRange className={rangeAttrClass} />
      </SliderTrack>
      <SliderThumb className={thumbAttrClass} />
    </Slider>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const RECOMMENDED_CSS__SLIDER__ROOT: any = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
};

const rootClass = css({
  ...RECOMMENDED_CSS__SLIDER__ROOT,
  '&[data-orientation="horizontal"]': {
    height: 15,
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: 15,
  },
  '&[data-disabled]': { opacity: 0.5 },
});

const RECOMMENDED_CSS__SLIDER__TRACK: any = {
  position: 'relative',
  // ensures full width in horizontal orientation, ignored in vertical orientation
  flexGrow: 1,
};

const trackClass = css({
  ...RECOMMENDED_CSS__SLIDER__TRACK,
  background: 'gainsboro',
  borderRadius: 4,
  '&[data-orientation="horizontal"]': {
    height: 4,
  },
  '&[data-orientation="vertical"]': {
    width: 4,
    height: 300,
  },
});

const RECOMMENDED_CSS__SLIDER__RANGE: any = {
  position: 'absolute',
  // good default for both orientation (match track width/height respectively)
  '&[data-orientation="horizontal"]': {
    height: '100%',
  },
  '&[data-orientation="vertical"]': {
    width: '100%',
  },
};

const rangeClass = css({
  ...RECOMMENDED_CSS__SLIDER__RANGE,
  background: '$black',
  borderRadius: 'inherit',
});

const RECOMMENDED_CSS__SLIDER__THUMB = {
  // ensures the thumb is sizeable
  display: 'block',

  // Add recommended target size regardless of styled size
  '&::before': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    width: 44,
    height: 44,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const thumbClass = css({
  ...RECOMMENDED_CSS__SLIDER__THUMB,
  borderRadius: 15,
  width: 15,
  height: 15,
  backgroundColor: '$black',
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px $red',
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-disabled]': { borderStyle: 'dashed' },
};
const rootAttrClass = css({ ...RECOMMENDED_CSS__SLIDER__ROOT, '&[data-radix-slider]': styles });
const trackAttrClass = css({
  ...RECOMMENDED_CSS__SLIDER__TRACK,
  '&[data-radix-slider-track]': styles,
});
const rangeAttrClass = css({
  ...RECOMMENDED_CSS__SLIDER__RANGE,
  '&[data-radix-slider-range]': styles,
});
const thumbAttrClass = css({
  ...RECOMMENDED_CSS__SLIDER__THUMB,
  '&[data-radix-slider-thumb]': styles,
});
