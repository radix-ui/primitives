import * as React from 'react';
import { Slider } from './Slider';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Slider' };

export const Styled = () => (
  <Slider defaultValue={10} as={StyledRoot}>
    <Slider.Track as={StyledTrack}>
      <Slider.Range as={StyledRange} />
    </Slider.Track>
    <Slider.Thumb as={StyledThumb} />
  </Slider>
);

export const Horizontal = () => (
  <>
    {/* @ts-ignore */}
    <Slider as={StyledRoot} defaultValue={[10, 30]}>
      <Slider.Track as={StyledTrack}>
        <Slider.Range as={StyledRange} />
      </Slider.Track>
      <Slider.Thumb as={StyledThumb} />
      <Slider.Thumb as={StyledThumb} />
    </Slider>

    <br />

    <Slider as={StyledRoot} defaultValue={10}>
      <Slider.Track as={StyledTrack}>
        <Slider.Range as={StyledRange} />
      </Slider.Track>
      <Slider.Thumb as={StyledThumb} />
    </Slider>
  </>
);

export const Vertical = () => (
  <>
    {/* @ts-ignore */}
    <Slider as={StyledRoot} defaultValue={[10, 30]} orientation="vertical">
      <Slider.Track as={StyledTrack}>
        <Slider.Range as={StyledRange} />
      </Slider.Track>
      <Slider.Thumb as={StyledThumb} />
      <Slider.Thumb as={StyledThumb} />
    </Slider>

    <br />

    <Slider as={StyledRoot} defaultValue={10} orientation="vertical">
      <Slider.Track as={StyledTrack}>
        <Slider.Range as={StyledRange} />
      </Slider.Track>
      <Slider.Thumb as={StyledThumb} />
    </Slider>
  </>
);

export const WithMinimumStepsBetweenThumbs = () => (
  // @ts-ignore
  <Slider as={StyledRoot} defaultValue={[10, 30]} minStepsBetweenThumbs={3}>
    <Slider.Track as={StyledTrack}>
      <Slider.Range as={StyledRange} />
    </Slider.Track>
    <Slider.Thumb as={StyledThumb} />
    <Slider.Thumb as={StyledThumb} />
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

      {/* @ts-ignore */}
      <Slider
        as={StyledRoot}
        defaultValue={[10, 15, 20, 80]}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <Slider.Track as={StyledTrack}>
          <Slider.Range as={StyledRange} />
        </Slider.Track>
        <Slider.Thumb as={StyledThumb} />
        <Slider.Thumb as={StyledThumb} />
        <Slider.Thumb as={StyledThumb} />
        <Slider.Thumb as={StyledThumb} />
      </Slider>
    </>
  );
};

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

const StyledRoot = styled('span', {
  ...RECOMMENDED_CSS__SLIDER__ROOT,
  '&[data-orientation="horizontal"]': {
    height: 15,
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: 15,
  },
});

const RECOMMENDED_CSS__SLIDER__TRACK: any = {
  position: 'relative',
  // ensures full width in horizontal orientation, ignored in vertical orientation
  flexGrow: 1,
};

const StyledTrack = styled('span', {
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

const StyledRange = styled('span', {
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

const StyledThumb = styled('span', {
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
