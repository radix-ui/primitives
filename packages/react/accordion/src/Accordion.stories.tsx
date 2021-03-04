/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { css } from '../../../../stitches.config';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} from './Accordion';

export default { title: 'Components/Accordion' };

export const Single = () => {
  const [valueOne, setValueOne] = React.useState('one');
  const [valueTwo, setValueTwo] = React.useState('two');

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion type="single" className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>One</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Two</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Four</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <h1>Controlled</h1>
      <Accordion type="single" value={valueOne} onValueChange={setValueOne} className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>One</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Two</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Four</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <h1>Controlled (at least one open)</h1>
      <Accordion
        type="single"
        value={valueTwo}
        onValueChange={(value) => value && setValueTwo(value)}
        className={rootClass}
      >
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>One</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Two</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Four</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export const Multiple = () => {
  const [value, setValue] = React.useState(['one', 'two']);

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion type="multiple" className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>One</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Two</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Four</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <h1>Controlled</h1>
      <Accordion type="multiple" value={value} onValueChange={setValue} className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>One</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Two</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionButton className={buttonClass}>Four</AccordionButton>
          </AccordionHeader>
          <AccordionPanel className={panelClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export const Animated = () => {
  const values = ['One', 'Two', 'Three', 'Four'];
  const [count, setCount] = React.useState(1);
  const [hasDynamicContent, setHasDynamicContent] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    if (hasDynamicContent) {
      timerRef.current = window.setTimeout(() => {
        setCount((prevCount) => {
          const nextCount = prevCount < 5 ? prevCount + 1 : prevCount;
          if (nextCount === 5) setHasDynamicContent(false);
          return nextCount;
        });
      }, 3000);
      return () => {
        clearTimeout(timerRef.current);
      };
    }
  }, [count, hasDynamicContent]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={hasDynamicContent}
          onChange={(event) => {
            const checked = event.target.checked;
            if (checked) setCount(1);
            setHasDynamicContent(checked);
          }}
        />{' '}
        Dynamic content
      </label>
      <br />
      <br />
      <Accordion type="single" className={rootClass}>
        {values.map((value) => (
          <AccordionItem key={value} value={value} className={itemClass}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{value}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={animatedPanelClass}>
              {[...Array(count)].map((_, index) => (
                <div style={{ padding: 10 }} key={index}>
                  Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                  viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                  quam suscipit habitant sed.
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export const OutsideViewport = () => (
  <>
    <p>Scroll down to see tabs</p>
    <div style={{ height: '150vh' }} />
    <p>
      When accordion buttons are focused and the user is navigating via keyboard, the page should
      not scroll unless the next tab is entering the viewport.
    </p>
    <Accordion type="single" className={rootClass}>
      <AccordionItem className={itemClass} value="one">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="two">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="three" disabled>
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="four">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Four</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <div style={{ height: '150vh' }} />
  </>
);

export const Chromatic = () => {
  const items = ['One', 'Two', 'Three', 'Four'];
  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Single closed</h2>
      <Accordion type="single" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Single open</h2>
      <Accordion type="single" className={rootClass} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple closed</h2>
      <Accordion type="multiple" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple open</h2>
      <Accordion type="multiple" className={rootClass} defaultValue={['One', 'Two']}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Controlled</h1>
      <h2>Single open</h2>
      <Accordion type="single" className={rootClass} value="Three">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple open</h2>
      <Accordion type="multiple" className={rootClass} value={['Two', 'Three']}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (whole)</h1>
      <Accordion type="single" className={rootClass} disabled>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion type="single" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion type="single" className={rootClass} disabled={false}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Force mounted panels</h1>
      <Accordion type="single" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>State attributes</h1>
      <Accordion type="single" className={rootAttrClass} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem
            key={item}
            className={itemAttrClass}
            value={item}
            disabled={item === 'Four'}
          >
            <AccordionHeader className={headerAttrClass}>
              <AccordionButton className={buttonAttrClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelAttrClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const rootClass = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const itemClass = css({
  borderBottom: '1px solid white',
});

const headerClass = css({
  margin: 0,
});

const RECOMMENDED_CSS__ACCORDION__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const buttonClass = css({
  ...RECOMMENDED_CSS__ACCORDION__BUTTON,
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
  padding: 10,
  backgroundColor: '$black',
  color: 'white',
  fontFamily: 'inherit',
  fontSize: '1.2em',

  '--shadow-color': 'crimson',

  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 -5px 0 0 var(--shadow-color)',
    color: '$red',
  },

  '&[data-disabled]': {
    color: '$gray300',
  },

  '&[data-state="open"]': {
    backgroundColor: '$red',
    color: '$white',

    '&:focus': {
      '--shadow-color': '#111',
      color: '$black',
    },
  },
});

const panelClass = css({
  padding: 10,
  lineHeight: 1.5,
});

const slideDown = css.keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-panel-height)' },
});

const slideUp = css.keyframes({
  from: { height: 'var(--radix-accordion-panel-height)' },
  to: { height: 0 },
});

const animatedPanelClass = css({
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms ease-out`,
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
  '&[data-disabled]': { borderStyle: 'dashed' },
  '&:disabled': { opacity: 0.5 },
};
const rootAttrClass = css(styles);
const itemAttrClass = css(styles);
const headerAttrClass = css(styles);
const buttonAttrClass = css(styles);
const panelAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
