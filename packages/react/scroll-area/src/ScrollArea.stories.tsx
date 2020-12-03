import * as React from 'react';
import { styled } from '../../../../stitches.config';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaButtonEnd,
  ScrollAreaButtonStart,
  ScrollAreaScrollbarX,
  ScrollAreaScrollbarY,
  ScrollAreaCorner,
  ScrollAreaTrack,
  ScrollAreaThumb,
  SCROLL_AREA_CSS_PROPS,
} from './ScrollArea';
import {
  Popover,
  PopoverPopper,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@interop-ui/react-popover';

export default { title: 'Components/ScrollArea' };

export function Basic() {
  const [usesNative, setNative] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [restTimeout, setRestTimeout] = React.useState(600);
  const [scrollbarVisibility, setScrollbarVisibility] = React.useState<ScrollbarVisibility>(
    'always'
  );
  const [trackClickBehavior, setTrackClickBehavior] = React.useState<TrackClickBehavior>('page');

  return (
    <div>
      <label>
        <input
          name="usesNative"
          type="checkbox"
          checked={usesNative}
          onChange={(e) => setNative(e.target.checked)}
        />
        <span>Force native scrollbars</span>
      </label>
      <label>
        <input
          name="prefersReducedMotion"
          type="checkbox"
          checked={prefersReducedMotion}
          onChange={(e) => setPrefersReducedMotion(e.target.checked)}
          disabled={usesNative}
        />
        <span>Simulate preference for reduced motion</span>
      </label>

      <div style={{ display: 'flex', margin: '10px 0' }}>
        <RadioGroup
          name="autoHide"
          legend="Show scrollbars:"
          fields={
            [
              { value: 'always', label: 'Always', disabled: usesNative },
              { value: 'scroll', label: 'When scrolling', disabled: usesNative },
              {
                value: 'hover',
                label: 'When scrolling and when the pointer is over the scrollable area',
                disabled: usesNative,
              },
            ] as { value: ScrollbarVisibility; label: string; disabled: boolean }[]
          }
          checked={scrollbarVisibility}
          onChange={(newValue) => {
            setScrollbarVisibility(newValue as ScrollbarVisibility);
          }}
        />
        <RadioGroup
          name="trackClickBehavior"
          legend="Click the scrollbar track to:"
          fields={[
            { value: 'page', label: 'Jump to the next page', disabled: usesNative },
            { value: 'relative', label: "Jump to the spot that's clicked", disabled: usesNative },
          ]}
          checked={trackClickBehavior}
          onChange={(newValue) => {
            setTrackClickBehavior(newValue as TrackClickBehavior);
          }}
        />
        <label>
          <span>Rest timeout (Min: 100ms, Max: 2000ms)</span>
          <input
            value={restTimeout}
            onChange={(e) => {
              setRestTimeout(Number(e.target.value));
            }}
            type="range"
            min={100}
            max={2000}
            disabled={scrollbarVisibility !== 'scroll'}
          />
        </label>
      </div>

      <hr />
      <div
        className="resizable"
        style={{
          padding: 10,
          border: '1px solid gray',
          resize: 'both',
          overflow: 'auto',
        }}
      >
        <ScrollArea
          as={Win98StyledRoot}
          unstable_forceNative={usesNative}
          unstable_prefersReducedMotion={prefersReducedMotion}
          overflowX="scroll"
          scrollbarVisibility={scrollbarVisibility}
          scrollbarVisibilityRestTimeout={restTimeout}
          trackClickBehavior={trackClickBehavior}
          css={{ width: '400px', height: '400px' }}
        >
          <ScrollAreaScrollbarY as={Win98StyledScrollbarY}>
            <ScrollAreaButtonStart as={Win98StyledScrollButtonStart}>
              <Arrow direction="up" />
            </ScrollAreaButtonStart>

            <ScrollAreaTrack as={Win98StyledScrollTrack}>
              <ScrollAreaThumb as={Win98StyledScrollThumb} />
            </ScrollAreaTrack>
            <ScrollAreaButtonEnd as={Win98StyledScrollButtonEnd}>
              <Arrow direction="down" />
            </ScrollAreaButtonEnd>
          </ScrollAreaScrollbarY>

          <ScrollAreaScrollbarX as={Win98StyledScrollbarX}>
            <ScrollAreaButtonStart as={Win98StyledScrollButtonStart}>
              <Arrow direction="left" />
            </ScrollAreaButtonStart>

            <ScrollAreaTrack as={Win98StyledScrollTrack}>
              <ScrollAreaThumb as={Win98StyledScrollThumb} />
            </ScrollAreaTrack>
            <ScrollAreaButtonEnd as={Win98StyledScrollButtonEnd}>
              <Arrow direction="right" />
            </ScrollAreaButtonEnd>
          </ScrollAreaScrollbarX>

          <ScrollAreaCorner as={Win98StyledCorner} />

          <ScrollAreaViewport
            as={StyledViewport}
            css={{
              width: '2000px',
              padding: 20,

              '& > :first-child': {
                marginTop: 0,
              },

              '& > :last-child': {
                marginBottom: 0,
              },
            }}
          >
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
          </ScrollAreaViewport>
        </ScrollArea>
        <TestButton onClick={() => alert('whoa')}>Test for pointer events</TestButton>
      </div>
    </div>
  );
}

export function InsidePopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover isOpen={isOpen} onIsOpenChange={setIsOpen}>
        <PopoverTrigger as="button">{isOpen ? 'close' : 'open'}</PopoverTrigger>
        <PopoverPopper style={{ ...RECOMMENDED_CSS__POPOVER__POPPER }}>
          <PopoverContent style={{ backgroundColor: '#eee', width: 250, height: 150 }}>
            <ScrollArea
              overflowX="scroll"
              scrollbarVisibility="scroll"
              trackClickBehavior="page"
              as={AnySizeRoot}
            >
              <ScrollAreaScrollbarY as={Win98StyledScrollbarY} style={{ bottom: 0 }}>
                <ScrollAreaTrack as={Win98StyledScrollTrack}>
                  <ScrollAreaThumb as={Win98StyledScrollThumb} />
                </ScrollAreaTrack>
              </ScrollAreaScrollbarY>

              <ScrollAreaViewport
                as={StyledViewport}
                css={{
                  padding: 10,
                  '& > :first-child': {
                    marginTop: 0,
                  },
                  '& > :last-child': {
                    marginBottom: 0,
                  },
                }}
              >
                <LongContent />
              </ScrollAreaViewport>
            </ScrollArea>
          </PopoverContent>
          <PopoverArrow width={50} height={20} />
        </PopoverPopper>
      </Popover>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

const RECOMMENDED_CSS__POPOVER__POPPER: any = {
  boxSizing: 'border-box',
  transformOrigin: 'var(--interop-ui-popover-popper-transform-origin)',
};

const RECOMMENDED_CSS__SCROLL_AREA__ROOT: any = {
  boxSizing: 'border-box',
  position: 'relative',
  // Root z-index set to 0 so we can set a new baseline for its children Apps may need to override
  // this if they have higher z-indices that conflict with their scrollbars, but they should not
  // need to change the z-indices for other elements in the tree. We'll want to document this
  // well!
  zIndex: 0,
  maxWidth: '100%',
  maxHeight: '100%',
  '&[data-dragging], &[data-scrolling]': {
    pointerEvents: 'auto !important',
  },
  '& [data-interop-ui-scroll-area-position]::-webkit-scrollbar': {
    display: 'none',
  },
};

const RECOMMENDED_CSS__SCROLL_AREA__VIEWPORT: any = {
  boxSizing: 'border-box',
  zIndex: 1,
  position: 'relative',

  '&[data-dragging], &[data-scrolling]': {
    // Remove pointer events from the content area while dragging or scrolling
    pointerEvents: 'none !important',
  },
};

const RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR: any = {
  boxSizing: 'border-box',
  zIndex: 2,
  position: 'absolute',
  display: 'flex',
  userSelect: 'none',
};
const RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR_X: any = {
  ...RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR,
  height: `16px`,
  left: 0,
  bottom: 0,
  right: `var(${SCROLL_AREA_CSS_PROPS.scrollbarXSize}, 0)`,
  flexDirection: 'row',
};
const RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR_Y: any = {
  ...RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR,
  width: '16px',
  right: 0,
  top: 0,
  bottom: `var(${SCROLL_AREA_CSS_PROPS.scrollbarYSize}, 0)`,
  flexDirection: 'column',
};
const RECOMMENDED_CSS__SCROLL_AREA__TRACK: any = {
  boxSizing: 'border-box',
  zIndex: -1,
  position: 'relative',
  width: '100%',
  height: '100%',
};
const RECOMMENDED_CSS__SCROLL_AREA__THUMB: any = {
  boxSizing: 'border-box',
  position: 'absolute',
  top: '0',
  left: '0',
  userSelect: 'none',
  willChange: `var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbWillChange})`,
  height: `var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbHeight})`,
  width: `var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbWidth})`,
};
const RECOMMENDED_CSS__SCROLL_AREA__BUTTON: any = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto',
};
const RECOMMENDED_CSS__SCROLL_AREA__CORNER: any = {
  userSelect: 'none',
  zIndex: 2,
  bottom: 0,
  right: `var(${SCROLL_AREA_CSS_PROPS.cornerRight})`,
  left: `var(${SCROLL_AREA_CSS_PROPS.cornerLeft})`,
  width: `var(${SCROLL_AREA_CSS_PROPS.cornerWidth})`,
  height: `var(${SCROLL_AREA_CSS_PROPS.cornerHeight})`,
};

const TestButton = styled('button', {
  appearance: 'none',
  display: 'block',
  marginTop: '10px',
  '&:hover': {
    background: 'crimson',
    color: '#fff',
  },
});

const Win98StyledRoot = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__ROOT,
  border: '2px solid #FFF',
  borderTopColor: '#858585',
  borderLeftColor: '#858585',
  borderRightColor: '#C0C0C0',
  borderBottomColor: '#C0C0C0',
  fontFamily: 'sans-serif',
});

const AnySizeRoot = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__ROOT,
  fontFamily: 'sans-serif',
});

const Win98StyledScrollbarY = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR_Y,
  transition: '300ms opacity ease',
  width: `16px`,
});

const Win98StyledScrollbarX = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__SCROLLBAR_X,
  transition: '300ms opacity ease',
  height: `16px`,
});

const Win98StyledScrollButton = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__BUTTON,
  position: 'relative',
  backgroundColor: '#C0C0C0',
  border: '2px solid #FFF',
  borderTopColor: '#FFF',
  borderLeftColor: '#FFF',
  borderRightColor: '#858585',
  borderBottomColor: '#858585',
  width: '16px',
  height: '16px',
  padding: '3px',
});

const Win98StyledScrollButtonStart = styled(Win98StyledScrollButton, {});

const Win98StyledScrollButtonEnd = styled(Win98StyledScrollButton, {});

const Win98StyledScrollThumb = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__THUMB,
  backgroundColor: '#C0C0C0',
  border: '2px solid #FFF',
  borderTopColor: '#FFF',
  borderLeftColor: '#FFF',
  borderRightColor: '#858585',
  borderBottomColor: '#858585',
});

const Win98StyledScrollTrack = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__TRACK,
  background: 'rgba(65, 105, 225, 0.3)',
});

const StyledViewport = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__VIEWPORT,
});

const Win98StyledCorner = styled('div', {
  ...RECOMMENDED_CSS__SCROLL_AREA__CORNER,
  backgroundColor: '#C0C0C0',
});

const Arrow = React.forwardRef<SVGSVGElement, any>(function Arrow(
  { direction, ...props },
  forwardedRef
) {
  const transform =
    direction === 'down'
      ? undefined
      : `rotate(${
          direction === 'left'
            ? '90deg'
            : direction === 'right'
            ? '-90deg'
            : direction === 'up'
            ? '180deg'
            : '0'
        })`;

  return (
    <svg
      {...props}
      ref={forwardedRef}
      viewBox="0 0 20 10"
      preserveAspectRatio="none"
      style={{
        ...props.style,
        flexGrow: 1,
        transform,
      }}
    >
      <polygon points="0,0 20,0 10,10" />
    </svg>
  );
});

function LongContent() {
  return (
    <React.Fragment>
      <p>
        Lacinia hendrerit auctor nam quisque augue suscipit feugiat, sit at imperdiet vitae lacus.
        Dolor sit dui posuere faucibus non pharetra laoreet conubia, augue rhoncus cras nisl sodales
        proin hac ipsum, per hendrerit sed volutpat natoque curae consectetur. Curae blandit neque
        vehicula vel mauris vulputate per felis sociosqu, sodales integer sollicitudin id litora
        accumsan viverra pulvinar, mus non adipiscing dolor facilisis habitasse mi leo. Litora
        faucibus eu pulvinar tempus gravida iaculis consectetur risus euismod fringilla, dui posuere
        viverra sapien tortor mattis et dolor tempor sem conubia, taciti sociis mus rhoncus cubilia
        praesent dapibus aliquet quis. Diam hendrerit aliquam metus dolor fusce lorem, non gravida
        arcu primis posuere ipsum adipiscing, mus sollicitudin eros lacinia mollis.
      </p>
      <p>
        Habitant fames mi massa mollis fusce congue nascetur magna bibendum inceptos accumsan,
        potenti ipsum ac sollicitudin taciti dis rhoncus lacinia fermentum placerat. Himenaeos
        taciti egestas lacinia maecenas ornare ultricies, auctor vitae nulla mi posuere leo mollis,
        eleifend lacus rutrum ante curabitur. Nullam mi quisque nulla enim pretium facilisi interdum
        morbi, himenaeos velit fames pellentesque eget nascetur laoreet vel rutrum, malesuada risus
        ad netus dolor et scelerisque.
      </p>
      <ul>
        <li>Dis cubilia aenean tortor iaculis fames duis aliquet</li>
        <li>Erat non lacinia, tempor molestie fringilla</li>
        <li>Porttitor litora praesent placerat pulvinar</li>
        <li>Arcu curabitur fermentum felis sollicitudin varius nec cras</li>
      </ul>
      <p>
        Habitasse tristique hac ligula in metus blandit lobortis leo nullam litora, tempus fusce
        tincidunt phasellus urna est rhoncus pretium etiam eu, fames neque faucibus sociis primis
        felis dui vitae odio. Egestas purus morbi pulvinar luctus adipiscing rutrum ultrices hac,
        vehicula odio ridiculus cubilia vivamus blandit faucibus, dapibus velit sociis metus
        ultricies amet scelerisque.
      </p>
      <p>
        Scelerisque commodo nam cras litora lacinia primis fames morbi natoque, quisque ante duis
        phasellus pharetra convallis montes felis. Consectetur leo suspendisse fringilla elementum
        maecenas massa urna malesuada auctor senectus, pretium turpis nisi orci ipsum vulputate
        cubilia sociis adipiscing. Vulputate ridiculus amet dis accumsan non ultrices fames mattis
        hendrerit, ornare elementum sociosqu eget consectetur duis viverra vivamus tincidunt,
        blandit nulla porta semper dolor pharetra nisi scelerisque. Consequat conubia porta cras et
        ac auctor pellentesque luctus morbi potenti, viverra varius commodo venenatis vestibulum
        erat sagittis laoreet.
      </p>
    </React.Fragment>
  );
}

function RadioGroup(props: {
  name: string;
  legend?: string;
  fields: { value: string; label: string; disabled?: boolean }[];
  checked: string;
  onChange: (checked: string) => void;
}) {
  return (
    <fieldset>
      {props.legend && <legend>{props.legend}</legend>}
      {props.fields.map((field) => (
        <div key={field.value}>
          <label>
            <input
              type="radio"
              name={props.name}
              value={field.value}
              checked={props.checked === field.value}
              disabled={field.disabled}
              onChange={(event) => {
                if (event.target.checked) {
                  props.onChange(field.value);
                }
              }}
            />
            <span>{field.label}</span>
          </label>
        </div>
      ))}
    </fieldset>
  );
}

type TrackClickBehavior = 'page' | 'relative';
type ScrollbarVisibility = 'always' | 'scroll' | 'hover';
