/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as Accordion from '@radix-ui/react-accordion';

export default { title: 'Components/Accordion' };

export const Single = () => {
  const [valueOne, setValueOne] = React.useState('one');

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion.Root type="single" className={rootClass()}>
        <Accordion.Item className={itemClass()} value="one">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="two">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="three" disabled>
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="four">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <h1>Controlled</h1>
      <Accordion.Root
        type="single"
        value={valueOne}
        onValueChange={setValueOne}
        className={rootClass()}
      >
        <Accordion.Item className={itemClass()} value="one">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="two">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="three" disabled>
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="four">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <h1>Collapsible</h1>
      <Accordion.Root type="single" className={rootClass()} defaultValue="one" collapsible>
        <Accordion.Item className={itemClass()} value="one">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="two">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="three" disabled>
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="four">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export const Multiple = () => {
  const [value, setValue] = React.useState(['one', 'two']);

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion.Root type="multiple" className={rootClass()}>
        <Accordion.Item className={itemClass()} value="one">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="two">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="three" disabled>
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="four">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <h1>Controlled</h1>
      <Accordion.Root
        type="multiple"
        value={value}
        onValueChange={setValue}
        className={rootClass()}
      >
        <Accordion.Item className={itemClass()} value="one">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="two">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="three" disabled>
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={itemClass()} value="four">
          <Accordion.Header className={headerClass()}>
            <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={contentClass()}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
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
      <h1>Closed by default</h1>
      <Accordion.Root type="single" className={rootClass()}>
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={itemClass()}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={animatedContentClass()}>
              {[...Array(count)].map((_, index) => (
                <div style={{ padding: 10 }} key={index}>
                  Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                  viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                  quam suscipit habitant sed.
                </div>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Open by default</h1>
      <Accordion.Root type="single" className={rootClass()} defaultValue="One">
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={itemClass()}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={animatedContentClass()}>
              {[...Array(count)].map((_, index) => (
                <div style={{ padding: 10 }} key={index}>
                  Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                  viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                  quam suscipit habitant sed.
                </div>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};

export const Animated2D = () => {
  const values = ['One', 'Two', 'Three', 'Four'];

  return (
    <>
      <Accordion.Root type="single" className={rootClass()}>
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={itemClass()}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={animated2DContentClass()}>
              <div style={{ padding: 10, background: 'whitesmoke', overflow: 'hidden' }}>
                <div style={{ width: 'calc(20em - 20px)', height: 100 }}>
                  Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
                  viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque
                  quam suscipit habitant sed.
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};

export const AnimatedControlled = () => {
  const [value, setValue] = React.useState(['one', 'two', 'three', 'four']);
  return (
    <Accordion.Root type="multiple" value={value} onValueChange={setValue} className={rootClass()}>
      <Accordion.Item className={itemClass()} value="one">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={animatedContentClass()}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="two">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={animatedContentClass()}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="three">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Three</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={animatedContentClass()}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="four">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={animatedContentClass()}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
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
    <Accordion.Root type="single" className={rootClass()}>
      <Accordion.Item className={itemClass()} value="one">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={contentClass()}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="two">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={contentClass()}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="three" disabled>
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Three (disabled)</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={contentClass()}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={itemClass()} value="four">
        <Accordion.Header className={headerClass()}>
          <Accordion.Trigger className={triggerClass()}>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={contentClass()}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
    <div style={{ height: '150vh' }} />
  </>
);

export const Chromatic = () => {
  const items = ['One', 'Two', 'Three', 'Four'];
  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Single closed</h2>
      <Accordion.Root type="single" className={rootClass()}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Single open</h2>
      <Accordion.Root type="single" className={rootClass()} defaultValue="Two">
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple closed</h2>
      <Accordion.Root type="multiple" className={rootClass()}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple open</h2>
      <Accordion.Root type="multiple" className={rootClass()} defaultValue={['One', 'Two']}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Controlled</h1>
      <h2>Single open</h2>
      <Accordion.Root type="single" className={rootClass()} value="Three">
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple open</h2>
      <Accordion.Root type="multiple" className={rootClass()} value={['Two', 'Three']}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Disabled (whole)</h1>
      <Accordion.Root type="single" className={rootClass()} disabled>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion.Root type="single" className={rootClass()}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item} disabled={item === 'Two'}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion.Root type="single" className={rootClass()} disabled={false}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item} disabled={item === 'Two'}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Force mounted contents</h1>
      <Accordion.Root type="single" className={rootClass()}>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemClass()} value={item}>
            <Accordion.Header className={headerClass()}>
              <Accordion.Trigger className={triggerClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentClass()} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>State attributes</h1>
      <h2>Accordion disabled</h2>
      <Accordion.Root type="single" className={rootAttrClass()} defaultValue="Two" disabled>
        {items.map((item) => (
          <Accordion.Item key={item} className={itemAttrClass()} value={item}>
            <Accordion.Header className={headerAttrClass()}>
              <Accordion.Trigger className={triggerAttrClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentAttrClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Accordion enabled with item override</h2>
      <Accordion.Root type="single" className={rootAttrClass()} defaultValue="Two" disabled={false}>
        {items.map((item) => (
          <Accordion.Item
            key={item}
            className={itemAttrClass()}
            value={item}
            disabled={['Two', 'Four'].includes(item)}
          >
            <Accordion.Header className={headerAttrClass()}>
              <Accordion.Trigger className={triggerAttrClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentAttrClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Accordion disabled with item override</h2>
      <Accordion.Root type="single" className={rootAttrClass()} defaultValue="Two" disabled={true}>
        {items.map((item) => (
          <Accordion.Item
            key={item}
            className={itemAttrClass()}
            value={item}
            disabled={['Two', 'Four'].includes(item) ? false : undefined}
          >
            <Accordion.Header className={headerAttrClass()}>
              <Accordion.Trigger className={triggerAttrClass()}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={contentAttrClass()}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
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

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const open2D = keyframes({
  from: {
    width: 0,
    height: 0,
  },
  to: {
    width: 'var(--radix-accordion-content-width)',
    height: 'var(--radix-accordion-content-height)',
  },
});

const close2D = keyframes({
  from: {
    width: 'var(--radix-accordion-content-width)',
    height: 'var(--radix-accordion-content-height)',
  },
  to: {
    width: 0,
    height: 0,
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
