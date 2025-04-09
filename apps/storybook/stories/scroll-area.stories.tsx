import * as React from 'react';
import { Direction, ScrollArea } from 'radix-ui';
import styles from './scroll-area.stories.module.css';

export default { title: 'Components/ScrollArea' };

export const Basic = () => {
  const [props, setProps] = React.useState({} as any);
  return (
    <div className={styles.root}>
      <div style={{ margin: '20px auto', width: 'max-content', textAlign: 'center' }}>
        <form
          onChange={(event) => {
            const formData = new FormData(event.currentTarget);
            const entries = (formData as any).entries();
            const cleanup = [...entries].map(([key, value]: any) => [key, value || undefined]);
            const props = Object.fromEntries(cleanup);
            setProps(props);
          }}
        >
          <label>
            type:{' '}
            <select name="type">
              <option></option>
              <option>always</option>
              <option>auto</option>
              <option>scroll</option>
              <option>hover</option>
            </select>
          </label>{' '}
          <label>
            dir:{' '}
            <select name="dir">
              <option></option>
              <option>ltr</option>
              <option>rtl</option>
            </select>
          </label>{' '}
          <label>
            scrollHideDelay: <input type="number" name="scrollHideDelay" />
          </label>
        </form>
      </div>

      <ScrollAreaStory
        {...props}
        key={props.type}
        style={{ width: 800, height: 800, margin: '30px auto' }}
      >
        {Array.from({ length: 30 }).map((_, index) => (
          <Copy key={index} />
        ))}
      </ScrollAreaStory>
    </div>
  );
};

export const Resizable = () => (
  <div
    className={styles.root}
    style={{
      width: 800,
      height: 800,
      padding: 20,
      resize: 'both',
      border: '1px solid gray',
      overflow: 'hidden',
    }}
  >
    <ScrollAreaStory style={{ width: '100%', height: '100%' }}>
      {Array.from({ length: 30 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>
  </div>
);

export const ContentChange = () => {
  const [verticalCount, setVerticalCount] = React.useState(1);
  const [horizontalCount, setHorizontalCount] = React.useState(1);
  return (
    <div className={styles.root}>
      <button onClick={() => setVerticalCount((count) => count + 1)}>Add vertical content</button>
      <button onClick={() => setHorizontalCount((count) => count + 1)}>
        Increase horizontal size
      </button>
      <ScrollAreaStory type="always" style={{ width: 800, height: 800 }}>
        {Array.from({ length: verticalCount }).map((_, index) => (
          <Copy key={index} style={{ width: 300 * horizontalCount + 'px' }} />
        ))}
      </ScrollAreaStory>
    </div>
  );
};

export const Animated = () => {
  return (
    <div className={styles.root}>
      <ScrollAreaStory animated style={{ width: 800, height: 800 }}>
        {Array.from({ length: 30 }).map((_, index) => (
          <Copy key={index} />
        ))}
      </ScrollAreaStory>
    </div>
  );
};

export const Chromatic = () => (
  <div className={styles.root}>
    <h1>Vertical</h1>
    <h2>Auto with overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal={false}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Auto without overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal={false}>
      <Copy style={{ height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Always with overflow</h2>
    <ScrollAreaStory type="always" vertical horizontal={false}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Always without overflow</h2>
    <ScrollAreaStory type="always" vertical horizontal={false}>
      <Copy style={{ height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Scroll with overflow</h2>
    <ScrollAreaStory type="scroll" vertical horizontal={false}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Scroll without overflow</h2>
    <ScrollAreaStory type="scroll" vertical horizontal={false}>
      <Copy style={{ height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Hover with overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal={false}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Hover without overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal={false}>
      <Copy style={{ height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h1>Horizontal</h1>
    <h2>Auto with overflow</h2>
    <ScrollAreaStory type="auto" vertical={false} horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Auto without overflow</h2>
    <ScrollAreaStory type="auto" vertical={false} horizontal>
      <Copy style={{ width: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Always with overflow</h2>
    <ScrollAreaStory type="always" vertical={false} horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Always without overflow</h2>
    <ScrollAreaStory type="always" vertical={false} horizontal>
      <Copy style={{ width: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Scroll with overflow</h2>
    <ScrollAreaStory type="scroll" vertical={false} horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Scroll without overflow</h2>
    <ScrollAreaStory type="scroll" vertical={false} horizontal>
      <Copy style={{ width: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Hover with overflow</h2>
    <ScrollAreaStory type="hover" vertical={false} horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Hover without overflow</h2>
    <ScrollAreaStory type="hover" vertical={false} horizontal>
      <Copy style={{ width: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h1>Both</h1>
    <h2>Auto with overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Auto with horizontal overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal>
      {Array.from({ length: 1 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Auto with vertical overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} style={{ width: 50, overflow: 'hidden' }} />
      ))}
    </ScrollAreaStory>

    <h2>Auto without overflow</h2>
    <ScrollAreaStory type="auto" vertical horizontal>
      <Copy style={{ width: 50, height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Always with overflow</h2>
    <ScrollAreaStory type="always" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Always without overflow</h2>
    <ScrollAreaStory type="always" vertical horizontal>
      <Copy style={{ width: 50, height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Scroll with overflow</h2>
    <ScrollAreaStory type="scroll" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Scroll without overflow</h2>
    <ScrollAreaStory type="scroll" vertical horizontal>
      <Copy style={{ width: 50, height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Hover with overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Hover without overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal>
      <Copy style={{ width: 50, height: 50, overflow: 'hidden' }} />
    </ScrollAreaStory>

    <h2>Hover with horizontal overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal>
      {Array.from({ length: 1 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Hover with vertical overflow</h2>
    <ScrollAreaStory type="hover" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} style={{ width: 50, overflow: 'hidden' }} />
      ))}
    </ScrollAreaStory>

    <h1>Min thumb size</h1>
    <ScrollAreaStory type="always" vertical horizontal>
      {Array.from({ length: 100 }).map((_, index) => (
        <Copy key={index} style={{ width: 10000 }} />
      ))}
    </ScrollAreaStory>

    <h1>RTL</h1>
    <h2>Prop</h2>
    <ScrollAreaStory type="always" dir="rtl" vertical horizontal>
      {Array.from({ length: 10 }).map((_, index) => (
        <Copy key={index} />
      ))}
    </ScrollAreaStory>

    <h2>Inherited</h2>
    <Direction.Provider dir="rtl">
      <ScrollAreaStory type="always" vertical horizontal>
        {Array.from({ length: 10 }).map((_, index) => (
          <Copy key={index} />
        ))}
      </ScrollAreaStory>
    </Direction.Provider>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const DYNAMIC_CONTENT_DELAY = 2000;

export const ChromaticDynamicContentBeforeLoaded = () => {
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, DYNAMIC_CONTENT_DELAY);
  }, []);

  return (
    <div className={styles.root}>
      <h1>Always</h1>
      <ScrollAreaStory type="always" style={{ width: 500, height: 250 }}>
        {showContent ? (
          Array.from({ length: 30 }).map((_, index) => <Copy key={index} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </ScrollAreaStory>

      <h1>Hover</h1>
      <ScrollAreaStory type="hover" style={{ width: 500, height: 250 }}>
        {showContent ? (
          Array.from({ length: 30 }).map((_, index) => <Copy key={index} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </ScrollAreaStory>

      <h1>Scroll</h1>
      <ScrollAreaStory type="scroll" style={{ width: 500, height: 250 }}>
        {showContent ? (
          Array.from({ length: 30 }).map((_, index) => <Copy key={index} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </ScrollAreaStory>

      <h1>Auto</h1>
      <ScrollAreaStory type="auto" style={{ width: 500, height: 250 }}>
        {showContent ? (
          Array.from({ length: 30 }).map((_, index) => <Copy key={index} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </ScrollAreaStory>
    </div>
  );
};
ChromaticDynamicContentBeforeLoaded.parameters = { chromatic: { disable: false } };

export const ChromaticDynamicContentAfterLoaded = () => <ChromaticDynamicContentBeforeLoaded />;
ChromaticDynamicContentAfterLoaded.parameters = {
  chromatic: { disable: false, delay: DYNAMIC_CONTENT_DELAY },
};

const ScrollAreaStory = ({
  children,
  animated = false,
  vertical = true,
  horizontal = true,
  ...props
}: any) => (
  <ScrollArea.Root
    {...props}
    className={styles.scrollArea}
    style={{ width: 200, height: 200, ...props.style }}
  >
    <ScrollArea.Viewport className={styles.scrollAreaViewport}>{children}</ScrollArea.Viewport>
    {vertical && (
      <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
        <ScrollArea.Thumb
          className={[animated && styles.animatedThumb, styles.thumb].filter(Boolean).join(' ')}
        />
      </ScrollArea.Scrollbar>
    )}
    {horizontal && (
      <ScrollArea.Scrollbar className={styles.scrollbar} orientation="horizontal">
        <ScrollArea.Thumb
          className={[animated && styles.animatedThumb, styles.thumb].filter(Boolean).join(' ')}
        />
      </ScrollArea.Scrollbar>
    )}
    <ScrollArea.Corner className={styles.corner} />
  </ScrollArea.Root>
);

const Copy = (props: any) => (
  <p style={{ width: 4000, marginTop: 0, ...props.style }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet eros iaculis, bibendum
    tellus ac, lobortis odio. Aliquam bibendum elit est, in iaculis est commodo id. Donec pulvinar
    est libero. Proin consectetur pellentesque molestie. Fusce mi ante, ullamcorper eu ante finibus,
    finibus pellentesque turpis. Mauris convallis, leo in vulputate varius, sapien lectus suscipit
    eros, ac semper odio sapien sit amet magna. Sed mattis turpis et lacinia ultrices. Nulla a
    commodo mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
    ridiculus mus. Pellentesque id tempor metus. Pellentesque faucibus tortor non nisi maximus
    dignissim. Etiam leo nisi, molestie a porttitor at, euismod a libero. Nullam placerat tristique
    enim nec pulvinar. Sed eleifend dictum nulla a aliquam. Sed tempus ipsum eget urna posuere
    aliquam. Nulla maximus tortor dui, sed laoreet odio aliquet ac. Vestibulum dolor orci, lacinia
    finibus vehicula eget, posuere ac lectus. Quisque non felis at ipsum scelerisque condimentum. In
    pharetra semper arcu, ut hendrerit sem auctor vel. Aliquam non lacinia elit, a facilisis ante.
    Praesent eget eros augue. Praesent nunc orci, ullamcorper non pulvinar eu, elementum id nibh.
    Nam id lorem euismod, sodales augue quis, porttitor magna. Vivamus ut nisl velit. Nam ultrices
    maximus felis, quis ullamcorper quam luctus et.
  </p>
);
