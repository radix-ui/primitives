/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Accordion } from 'radix-ui';
import styles from './accordion.stories.module.css';

export default { title: 'Components/Accordion' };

export const Single = () => {
  const [valueOne, setValueOne] = React.useState('one');

  return (
    <>
      <h1>Uncontrolled</h1>
      <Accordion.Root type="single" className={styles.root}>
        <Accordion.Item className={styles.item} value="one">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="two">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="three" disabled>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="four">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
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
        className={styles.root}
      >
        <Accordion.Item className={styles.item} value="one">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="two">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="three" disabled>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="four">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
            dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
            <button>Cool</button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <h1>Collapsible</h1>
      <Accordion.Root type="single" className={styles.root} defaultValue="one" collapsible>
        <Accordion.Item className={styles.item} value="one">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="two">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="three" disabled>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="four">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
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
      <Accordion.Root type="multiple" className={styles.root}>
        <Accordion.Item className={styles.item} value="one">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="two">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="three" disabled>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="four">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
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
        className={styles.root}
      >
        <Accordion.Item className={styles.item} value="one">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
            integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
            habitant sed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="two">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
            porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="three" disabled>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat
            himenaeos euismod magna, nec tempor pulvinar eu etiam mattis.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.item} value="four">
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
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
      <Accordion.Root type="single" className={styles.root}>
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={styles.item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.animatedContent}>
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
      <Accordion.Root type="single" className={styles.root} defaultValue="One">
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={styles.item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.animatedContent}>
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
      <Accordion.Root type="single" className={styles.root}>
        {values.map((value) => (
          <Accordion.Item key={value} value={value} className={styles.item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{value}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.animated2DContent}>
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
    <Accordion.Root type="multiple" value={value} onValueChange={setValue} className={styles.root}>
      <Accordion.Item className={styles.item} value="one">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.animatedContent}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="two">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.animatedContent}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="three">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Three</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.animatedContent}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="four">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.animatedContent}>
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
    <Accordion.Root type="single" className={styles.root}>
      <Accordion.Item className={styles.item} value="one">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="two">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="three" disabled>
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="four">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
    <div style={{ height: '150vh' }} />
  </>
);

export const Horizontal = () => (
  <>
    <h1>Horizontal Orientation</h1>
    <Accordion.Root type="single" className={styles.root} orientation="horizontal">
      <Accordion.Item className={styles.item} value="one">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="two">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="three" disabled>
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Three (disabled)</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className={styles.item} value="four">
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </>
);

export const Chromatic = () => {
  const items = ['One', 'Two', 'Three', 'Four'];
  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Single closed</h2>
      <Accordion.Root type="single" className={styles.root}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Single open</h2>
      <Accordion.Root type="single" className={styles.root} defaultValue="Two">
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple closed</h2>
      <Accordion.Root type="multiple" className={styles.root}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple open</h2>
      <Accordion.Root type="multiple" className={styles.root} defaultValue={['One', 'Two']}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Controlled</h1>
      <h2>Single open</h2>
      <Accordion.Root type="single" className={styles.root} value="Three">
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Multiple open</h2>
      <Accordion.Root type="multiple" className={styles.root} value={['Two', 'Three']}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Disabled (whole)</h1>
      <Accordion.Root type="single" className={styles.root} disabled>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion.Root type="single" className={styles.root}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item} disabled={item === 'Two'}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion.Root type="single" className={styles.root} disabled={false}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item} disabled={item === 'Two'}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>Force mounted contents</h1>
      <Accordion.Root type="single" className={styles.root}>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.item} value={item}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h1>State attributes</h1>
      <h2>Accordion disabled</h2>
      <Accordion.Root type="single" className={styles.rootAttr} defaultValue="Two" disabled>
        {items.map((item) => (
          <Accordion.Item key={item} className={styles.itemAttr} value={item}>
            <Accordion.Header className={styles.headerAttr}>
              <Accordion.Trigger className={styles.triggerAttr}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.contentAttr}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Accordion enabled with item override</h2>
      <Accordion.Root type="single" className={styles.rootAttr} defaultValue="Two" disabled={false}>
        {items.map((item) => (
          <Accordion.Item
            key={item}
            className={styles.itemAttr}
            value={item}
            disabled={['Two', 'Four'].includes(item)}
          >
            <Accordion.Header className={styles.headerAttr}>
              <Accordion.Trigger className={styles.triggerAttr}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.contentAttr}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <h2>Accordion disabled with item override</h2>
      <Accordion.Root type="single" className={styles.rootAttr} defaultValue="Two" disabled={true}>
        {items.map((item) => (
          <Accordion.Item
            key={item}
            className={styles.itemAttr}
            value={item}
            disabled={['Two', 'Four'].includes(item) ? false : undefined}
          >
            <Accordion.Header className={styles.headerAttr}>
              <Accordion.Trigger className={styles.triggerAttr}>{item}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.contentAttr}>
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
