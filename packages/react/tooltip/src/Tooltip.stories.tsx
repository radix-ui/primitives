import * as React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from './Tooltip';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Tooltip' };

export const Styled = () => (
  <Tooltip>
    <TooltipTrigger className={triggerClass}>Hover or Focus me</TooltipTrigger>
    <TooltipContent className={contentClass} sideOffset={5}>
      Nicely done!
      <TooltipArrow className={arrowClass} offset={10} />
    </TooltipContent>
  </Tooltip>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger style={{ margin: 100 }}>
        I'm controlled, look I'm {open ? 'open' : 'closed'}
      </TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Nicely done!
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>
  );
};

export const CustomDurations = () => (
  <>
    <h1>Delay duration</h1>
    <h2>Default (700ms)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>

    <h2>Custom (0ms = instant open)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>

    <h2>Custom (2s)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip delayDuration={2000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={2000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={2000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>

    <h1>Skip delay duration</h1>
    <h2>Default (300ms to move from one to another tooltip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>

    <h2>Custom (0ms to move from one to another tooltip = never skip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip skipDelayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip skipDelayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip skipDelayDuration={0}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>

    <h2>Custom (5s to move from one to another tooltip)</h2>
    <div style={{ display: 'flex', gap: 50 }}>
      <Tooltip skipDelayDuration={5000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip skipDelayDuration={5000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
      <Tooltip skipDelayDuration={5000}>
        <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
        <TooltipContent className={contentClass} sideOffset={5}>
          Nicely done!
          <TooltipArrow className={arrowClass} offset={10} />
        </TooltipContent>
      </Tooltip>
    </div>
  </>
);

export const CustomContent = () => (
  <div style={{ display: 'flex', gap: 20, padding: 100 }}>
    <Tooltip>
      <TooltipTrigger>Heading</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <h1>Some heading</h1>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Paragraph</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <p>Some paragraph</p>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>List</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Article</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <article>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum, quae qui. Magnam delectus
          ex totam repellat amet distinctio unde, porro architecto voluptatibus nemo et nisi,
          voluptatem eligendi earum autem fugit.
        </article>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Figure</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <figure style={{ margin: 0 }}>
          <img
            src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
            alt=""
            width={100}
          />
          <figcaption>Colm Tuite</figcaption>
        </figure>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Time</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        {/* @ts-ignore */}
        <time datetime="2017-10-31T11:21:00+02:00">Tuesday, 31 October 2017</time>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Link</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        View in <a href="https://modulz.app">Modulz</a>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Form</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <form>
          <label htmlFor="fname">First name:</label>
          <br />
          <input type="text" id="fname" name="fname" />
          <br />
          <label htmlFor="lname">Last name:</label>
          <br />
          <input type="text" id="lname" name="lname" />
        </form>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Mini layout</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
            fontSize: 14,
          }}
        >
          Start video call
          <span style={{ display: 'block', color: '#999' }}>
            press{' '}
            <kbd
              style={{
                fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
                fontWeight: 'bold',
                color: 'white',
              }}
              aria-label="c key"
            >
              c
            </kbd>
          </span>
        </p>
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>
  </div>
);

export const Positions = () => (
  <div
    style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(5, 50px)',
      }}
    >
      <SimpleTooltip label="Top start" side="top" align="start">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '2', gridRow: '1' }}>
          Top start
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Top center" side="top" align="center">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '3', gridRow: '1' }}>
          Top center
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Top end" side="top" align="end">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '4', gridRow: '1' }}>
          Top end
        </TooltipTrigger>
      </SimpleTooltip>

      <SimpleTooltip label="Right start" side="right" align="start">
        <TooltipTrigger
          className={positionButtonClass}
          style={{ gridColumn: '5', gridRow: '2' }}
          tabIndex={0}
        >
          Right start
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Right center" side="right" align="center">
        <TooltipTrigger
          className={positionButtonClass}
          style={{ gridColumn: '5', gridRow: '3' }}
          tabIndex={0}
        >
          Right center
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Right end" side="right" align="end">
        <TooltipTrigger
          className={positionButtonClass}
          style={{ gridColumn: '5', gridRow: '4' }}
          tabIndex={0}
        >
          Right end
        </TooltipTrigger>
      </SimpleTooltip>

      <SimpleTooltip label="Bottom end" side="bottom" align="end">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '4', gridRow: '5' }}>
          Bottom end
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Bottom center" side="bottom" align="center">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '3', gridRow: '5' }}>
          Bottom center
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Bottom start" side="bottom" align="start">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '2', gridRow: '5' }}>
          Bottom start
        </TooltipTrigger>
      </SimpleTooltip>

      <SimpleTooltip label="Left end" side="left" align="end">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '1', gridRow: '4' }}>
          Left end
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Left center" side="left" align="center">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '1', gridRow: '3' }}>
          Left center
        </TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip label="Left start" side="left" align="start">
        <TooltipTrigger className={positionButtonClass} style={{ gridColumn: '1', gridRow: '2' }}>
          Left start
        </TooltipTrigger>
      </SimpleTooltip>
    </div>
  </div>
);

export const AriaLabel = () => (
  <>
    <p>The first button will display AND enunciate the label.</p>
    <p>The second button will display the label, but enunciate the aria label.</p>
    <div style={{ display: 'flex' }}>
      <SimpleTooltip label="Notifications">
        <TooltipTrigger style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </TooltipTrigger>
      </SimpleTooltip>

      <SimpleTooltip label="Notifications" aria-label="3 notifications">
        <TooltipTrigger style={{ margin: 5 }}>
          <span aria-hidden>🔔(3)</span>
        </TooltipTrigger>
      </SimpleTooltip>
    </div>
  </>
);

export const WithText = () => (
  <p>
    Hello this is a test with{' '}
    <SimpleTooltip label="This is a tooltip">
      <TooltipTrigger asChild>
        <a href="https://modulz.app">Tooltip</a>
      </TooltipTrigger>
    </SimpleTooltip>{' '}
    inside a Text Component{' '}
    <SimpleTooltip label="This is a tooltip" side="top">
      <TooltipTrigger asChild>
        <a href="https://modulz.app">Tooltip</a>
      </TooltipTrigger>
    </SimpleTooltip>{' '}
    some more text{' '}
    <SimpleTooltip label="This is a tooltip" side="right" align="center">
      <TooltipTrigger asChild>
        <a href="https://modulz.app">Tooltip</a>
      </TooltipTrigger>
    </SimpleTooltip>{' '}
  </p>
);

export const WithExternalRef = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.boxShadow = '0 0 0 2px red';
    }
  });

  return (
    <SimpleTooltip label="Save document" side="bottom" align="end">
      <TooltipTrigger ref={buttonRef} type="button" style={{ margin: 100 }}>
        Save
      </TooltipTrigger>
    </SimpleTooltip>
  );
};

export const Unmount = () => {
  const [isMounted, setIsMounted] = React.useState(true);
  return (
    <>
      <ul>
        <li>Focus the first button (tooltip 1 shows)</li>
        <li>Focus the second button (tooltip 2 shows)</li>
        <li>Press escape (second button unmounts)</li>
        <li>Focus the first button (tooltip 1 should still show)</li>
      </ul>
      <SimpleTooltip label="tooltip 1">
        <TooltipTrigger style={{ alignSelf: 'flex-start', margin: '0vmin' }}>Tool 1</TooltipTrigger>
      </SimpleTooltip>

      {isMounted && (
        <SimpleTooltip label="tooltip 2">
          <TooltipTrigger
            style={{ alignSelf: 'flex-start', margin: '0vmin' }}
            onKeyDown={(event) => event.key === 'Escape' && setIsMounted(false)}
          >
            Tool 2
          </TooltipTrigger>
        </SimpleTooltip>
      )}
    </>
  );
};

export const Animated = () => {
  return (
    <div style={{ padding: 100 }}>
      <SimpleTooltip className={animatedContentClass} label="Hello world 1">
        <TooltipTrigger style={{ marginRight: 10 }}>Hello 1</TooltipTrigger>
      </SimpleTooltip>
      <SimpleTooltip className={animatedContentClass} label="Hello world 2" side="top">
        <TooltipTrigger>Hello 2</TooltipTrigger>
      </SimpleTooltip>
    </div>
  );
};

export const SlottableContent = () => (
  <Tooltip>
    <TooltipTrigger className={triggerClass}>Hover or Focus me</TooltipTrigger>
    <TooltipContent asChild sideOffset={5}>
      <div className={contentClass}>
        Nicely done!
        <TooltipArrow className={arrowClass} offset={10} />
      </div>
    </TooltipContent>
  </Tooltip>
);

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => (
  <div style={{ padding: 200 }}>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Tooltip>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <h2>Open</h2>
    <Tooltip defaultOpen>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <Tooltip defaultOpen>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
    </Tooltip>

    <h1 style={{ marginTop: 100 }}>Controlled</h1>
    <h2>Closed</h2>
    <Tooltip open={false}>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <h2>Open</h2>
    <Tooltip open>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>

    <h2 style={{ marginTop: 60 }}>Open with reordered parts</h2>
    <Tooltip open>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
      <TooltipTrigger className={triggerClass}>open</TooltipTrigger>
    </Tooltip>

    <h1 style={{ marginTop: 100 }}>Positioning</h1>
    <h2>No collisions</h2>
    <h3>Side & Align</h3>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>

    <h3>Arrow offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} offset={5} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} offset={-10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>

    <h3>Side offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              sideOffset={5}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              sideOffset={-10}
              align={align}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>

    <h3>Align offset</h3>
    <h4>Positive</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              align={align}
              alignOffset={20}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>
    <h4>Negative</h4>
    <div className={gridClass}>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <Tooltip key={`${side}-${align}`} open>
            <TooltipTrigger className={chromaticTriggerClass} />
            <TooltipContent
              className={chromaticContentClass}
              side={side}
              align={align}
              alignOffset={-10}
              avoidCollisions={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
            </TooltipContent>
          </Tooltip>
        ))
      )}
    </div>

    <h2>Collisions</h2>
    <p>See instances on the periphery of the page.</p>
    {SIDES.map((side) =>
      ALIGN_OPTIONS.map((align) => (
        <Tooltip key={`${side}-${align}`} open>
          <TooltipTrigger
            className={chromaticTriggerClass}
            style={{
              position: 'absolute',
              [side]: 10,
              ...((side === 'right' || side === 'left') &&
                (align === 'start'
                  ? { bottom: 10 }
                  : align === 'center'
                  ? { top: 'calc(50% - 15px)' }
                  : { top: 10 })),
              ...((side === 'top' || side === 'bottom') &&
                (align === 'start'
                  ? { right: 10 }
                  : align === 'center'
                  ? { left: 'calc(50% - 15px)' }
                  : { left: 10 })),
            }}
          />
          <TooltipContent className={chromaticContentClass} side={side} align={align}>
            <p style={{ textAlign: 'center' }}>
              {side}
              <br />
              {align}
            </p>
            <TooltipArrow className={chromaticArrowClass} width={20} height={10} />
          </TooltipContent>
        </Tooltip>
      ))
    )}

    <h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
    <Tooltip open>
      <TooltipTrigger asChild>
        <button className={triggerClass}>open</button>
      </TooltipTrigger>
      <TooltipContent className={contentClass} sideOffset={5}>
        Some content
        <TooltipArrow className={arrowClass} width={20} height={10} offset={10} />
      </TooltipContent>
    </Tooltip>

    <h1 style={{ marginTop: 100 }}>With slotted content</h1>
    <Tooltip open>
      <TooltipTrigger className={triggerClass}>Hover or Focus me</TooltipTrigger>
      <TooltipContent asChild sideOffset={5}>
        <div className={contentClass}>
          Some content
          <TooltipArrow className={arrowClass} offset={10} />
        </div>
      </TooltipContent>
    </Tooltip>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

function SimpleTooltip({
  children,
  label,
  'aria-label': ariaLabel,
  open,
  onOpenChange,
  ...props
}: any) {
  return (
    <Tooltip open={open} onOpenChange={onOpenChange}>
      {children}
      <TooltipContent className={contentClass} sideOffset={5} aria-label={ariaLabel} {...props}>
        {label}
        <TooltipArrow className={arrowClass} offset={10} />
      </TooltipContent>
    </Tooltip>
  );
}

const positionButtonClass = css({
  margin: 5,
  border: '1px solid black',
  background: 'transparent',
});

const triggerClass = css({});

const RECOMMENDED_CSS__TOOLTIP__CONTENT: any = {
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
  // ensures content isn't selectable and cannot receive events
  // this is just a detterent to people putting interactive content inside a `Tooltip`
  userSelect: 'none',
  pointerEvents: 'none',
};

const contentClass = css({
  ...RECOMMENDED_CSS__TOOLTIP__CONTENT,
  backgroundColor: '$black',
  color: '$white',
  fontSize: 12,
  borderRadius: 5,
  padding: 10,
  maxWidth: 300,
});

const arrowClass = css({
  fill: '$black',
});

const scaleIn = css.keyframes({
  '0%': { opacity: 0, transform: 'scale(0)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const fadeIn = css.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOut = css.keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="delayed-open"]': {
    animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="instant-open"]': {
    animation: `${fadeIn} 0.2s ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 0.2s ease-out`,
  },
});

const gridClass = css({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(3, 50px)',
  columnGap: 150,
  rowGap: 100,
  padding: 100,
  border: '1px solid black',
});

const chromaticTriggerClass = css({
  boxSizing: 'border-box',
  width: 30,
  height: 30,
  backgroundColor: 'tomato',
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticContentClass = css({
  boxSizing: 'border-box',
  display: 'grid',
  placeContent: 'center',
  width: 60,
  height: 60,
  backgroundColor: 'royalblue',
  color: 'white',
  fontSize: 10,
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticArrowClass = css({
  fill: 'black',
});
