import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Tabs' };

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs defaultValue="tab1" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>

    <h1>Vertical (manual activation)</h1>
    <Tabs defaultValue="tab1" className={rootClass} orientation="vertical" activationMode="manual">
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <Tabs defaultValue="tab3" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>

    <h1>Controlled</h1>
    <Tabs value="tab3" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>

    <h1>Vertical</h1>
    <Tabs defaultValue="tab3" className={rootClass} orientation="vertical" activationMode="manual">
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>

    <h1>Direction</h1>
    <h2>Prop</h2>
    <Tabs defaultValue="tab3" dir="rtl" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTrigger value="tab1" className={triggerClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>

    <h2>Inherited</h2>
    <DirectionProvider dir="rtl">
      <Tabs defaultValue="tab3" className={rootClass}>
        <TabsList aria-label="tabs example" className={listClass}>
          <TabsTrigger value="tab1" className={triggerClass}>
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" disabled className={triggerClass}>
            Tab 2
          </TabsTrigger>
          <TabsTrigger value="tab3" className={triggerClass}>
            Tab 3
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className={contentClass}>
          Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem
          himenaeos integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida
          elementum pellentesque volutpat dictum ipsum.
        </TabsContent>
        <TabsContent value="tab2" className={contentClass}>
          You'll never find me!
        </TabsContent>
        <TabsContent value="tab3" className={contentClass}>
          Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
          quam tempus pretium.
        </TabsContent>
      </Tabs>
    </DirectionProvider>

    <h1>State attributes</h1>
    <Tabs defaultValue="tab3" className={rootAttrClass}>
      <TabsList aria-label="tabs example" className={listAttrClass}>
        <TabsTrigger value="tab1" className={triggerAttrClass}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2" disabled className={triggerAttrClass}>
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3" className={triggerAttrClass}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={contentAttrClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="tab2" className={contentAttrClass}>
        You'll never find me!
      </TabsContent>
      <TabsContent value="tab3" className={contentAttrClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const RECOMMENDED_CSS__TABS__ROOT = {
  // ensures things are layed out correctly by default
  display: 'flex',
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
  },
};

const rootClass = css({
  ...RECOMMENDED_CSS__TABS__ROOT,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  maxWidth: '20rem',
});

const RECOMMENDED_CSS__TABS__TAB_LIST = {
  flexShrink: 0,
  // ensures things are layed out correctly by default
  display: 'flex',
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
};

const listClass = css({
  ...RECOMMENDED_CSS__TABS__TAB_LIST,
  backgroundColor: '#eee',
});

const RECOMMENDED_CSS__TABS__TRIGGER = {
  all: 'unset' as any,
  flexShrink: 0,
};

const triggerClass = css({
  ...RECOMMENDED_CSS__TABS__TRIGGER,

  padding: '0.4em 0.6em',
  fontWeight: '500',
  lineHeight: '1',
  userSelect: 'none',

  '&[data-orientation="horizontal"]': {
    borderTop: '4px solid transparent',
    borderBottom: '4px solid var(--border-color, transparent)',
  },

  '&[data-orientation="vertical"]': {
    padding: '0.6em',
    borderRight: '4px solid var(--border-color, transparent)',
  },

  '&[data-disabled]': { color: '$gray300' },

  '&[data-state="active"]': { '--border-color': 'crimson' },

  '&:focus': {
    '--border-color': '#111',
    outline: '1px solid var(--border-color)',
    '&[data-state="active"]': { '--border-color': 'crimson' },
  },
});

const RECOMMENDED_CSS__TABS__CONTENT = {
  flexGrow: 1,
};

const contentClass = css({
  ...RECOMMENDED_CSS__TABS__CONTENT,

  padding: '1em',
  border: '1px solid #eee',
  fontWeight: '300',
  fontSize: '0.85em',
  lineHeight: '1.65',

  '&[data-orientation="horizontal"]': { borderTop: 'none' },
  '&[data-orientation="vertical"]': { borderLeft: 'none' },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&:disabled': { opacity: 0.5 },
  '&[data-disabled]': { borderStyle: 'dashed' },

  '&[data-state="inactive"]': { borderColor: 'red' },
  '&[data-state="active"]': { borderColor: 'green' },
};
const rootAttrClass = css(styles);
const listAttrClass = css(styles);
const triggerAttrClass = css(styles);
const contentAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
