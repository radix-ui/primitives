/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { css } from '../../../../stitches.config';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

export default { title: 'Components/Accordion' };

export const Single = () => {
  const [valueOne, setValueOne] = React.useState('one');

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion type="single" className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h1>Controlled</h1>
      <Accordion type="single" value={valueOne} onValueChange={setValueOne} className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h1>Collapsible</h1>
      <Accordion type="single" className={rootClass} defaultValue="one" collapsible>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionContent>
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
            <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h1>Controlled</h1>
      <Accordion type="multiple" value={value} onValueChange={setValue} className={rootClass}>
        <AccordionItem className={itemClass} value="one">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="two">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="three" disabled>
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className={itemClass} value="four">
          <AccordionHeader className={headerClass}>
            <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClass}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </AccordionContent>
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
              <AccordionTrigger className={triggerClass}>{value}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={animatedContentClass}>
              {[...Array(count)].map((_, index) => (
                <div style={{ padding: 10 }} key={index}>
                  Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                  viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                  quam suscipit habitant sed.
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export const Animated2D = () => {
  const values = ['One', 'Two', 'Three', 'Four'];

  return (
    <>
      <Accordion type="single" className={rootClass}>
        {values.map((value) => (
          <AccordionItem key={value} value={value} className={itemClass}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{value}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={animated2DContentClass}>
                <div style={{ padding: 10, background: 'whitesmoke', overflow: 'hidden'}}>
                  <div style={{width: 'calc(20em - 20px)', height: 100}}>
                    Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                    viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                    quam suscipit habitant sed.
                  </div>
                </div>
            </AccordionContent>
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
          <AccordionTrigger className={triggerClass}>One</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className={contentClass}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className={itemClass} value="two">
        <AccordionHeader className={headerClass}>
          <AccordionTrigger className={triggerClass}>Two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className={contentClass}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className={itemClass} value="three" disabled>
        <AccordionHeader className={headerClass}>
          <AccordionTrigger className={triggerClass}>Three (disabled)</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className={contentClass}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className={itemClass} value="four">
        <AccordionHeader className={headerClass}>
          <AccordionTrigger className={triggerClass}>Four</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className={contentClass}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionContent>
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
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Single open</h2>
      <Accordion type="single" className={rootClass} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple closed</h2>
      <Accordion type="multiple" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple open</h2>
      <Accordion type="multiple" className={rootClass} defaultValue={['One', 'Two']}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Controlled</h1>
      <h2>Single open</h2>
      <Accordion type="single" className={rootClass} value="Three">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Multiple open</h2>
      <Accordion type="multiple" className={rootClass} value={['Two', 'Three']}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (whole)</h1>
      <Accordion type="single" className={rootClass} disabled>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion type="single" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion type="single" className={rootClass} disabled={false}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Force mounted contents</h1>
      <Accordion type="single" className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionTrigger className={triggerClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentClass} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>State attributes</h1>
      <h2>Accordion disabled</h2>
      <Accordion type="single" className={rootAttrClass} defaultValue="Two" disabled>
        {items.map((item) => (
          <AccordionItem key={item} className={itemAttrClass} value={item}>
            <AccordionHeader className={headerAttrClass}>
              <AccordionTrigger className={triggerAttrClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentAttrClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Accordion enabled with item override</h2>
      <Accordion type="single" className={rootAttrClass} defaultValue="Two" disabled={false}>
        {items.map((item) => (
          <AccordionItem
            key={item}
            className={itemAttrClass}
            value={item}
            disabled={['Two', 'Four'].includes(item)}
          >
            <AccordionHeader className={headerAttrClass}>
              <AccordionTrigger className={triggerAttrClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentAttrClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Accordion disabled with item override</h2>
      <Accordion type="single" className={rootAttrClass} defaultValue="Two" disabled={true}>
        {items.map((item) => (
          <AccordionItem
            key={item}
            className={itemAttrClass}
            value={item}
            disabled={['Two', 'Four'].includes(item) ? false : undefined}
          >
            <AccordionHeader className={headerAttrClass}>
              <AccordionTrigger className={triggerAttrClass}>{item}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className={contentAttrClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionContent>
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

const RECOMMENDED_CSS__ACCORDION__TRIGGER: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const triggerClass = css({
  ...RECOMMENDED_CSS__ACCORDION__TRIGGER,
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

const contentClass = css({
  padding: 10,
  lineHeight: 1.5,
});

const slideDown = css.keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = css.keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const open2D = css.keyframes({
  from: {
    width: 0,
    height: 0,
  },
  to: {
    width: 'var(--radix-accordion-content-width)',
    height: 'var(--radix-accordion-content-height)',
  },
});

const close2D = css.keyframes({
  from: {
    width: 'var(--radix-accordion-content-width)',
    height: 'var(--radix-accordion-content-height)'
  },
  to: {
    width: 0,
    height: 0
  },
});

const animatedContentClass = css({
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms ease-out`,
  },
});

const animated2DContentClass = css({
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${open2D} 1000ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${close2D} 1000ms ease-out`,
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
const triggerAttrClass = css(styles);
const contentAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
