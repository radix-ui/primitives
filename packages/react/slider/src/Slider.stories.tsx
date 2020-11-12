import * as React from 'react';
import { Slider, styles } from './Slider';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Slider' };

export const Basic = () => (
  <Slider defaultValue={10} as={BasicStyledRoot}>
    <Slider.Track as={BasicStyledTrack}>
      <Slider.Range as={BasicStyledRange} />
    </Slider.Track>
    <Slider.Thumb as={BasicStyledThumb} />
  </Slider>
);

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

const BasicStyledRoot = styled('span', styles.root);
const BasicStyledTrack = styled('span', styles.track);
const BasicStyledRange = styled('span', styles.range);
const BasicStyledThumb = styled('span', styles.thumb);

const StyledRoot = styled(BasicStyledRoot, {
  '&[data-orientation="horizontal"]': {
    height: 15,
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: 15,
  },
});

const StyledTrack = styled(BasicStyledTrack, {
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

const StyledRange = styled(BasicStyledRange, {
  background: '$black',
  borderRadius: 'inherit',
});

const StyledThumb = styled(BasicStyledThumb, {
  borderRadius: 15,
  width: 15,
  height: 15,
  backgroundColor: '$black',
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px $red',
  },
});
