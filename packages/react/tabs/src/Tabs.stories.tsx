import * as React from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from './Tabs';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Tabs' };

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs defaultValue="tab1" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTab value="tab1" className={tabClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>

    <h1>Vertical (manual activation)</h1>
    <Tabs defaultValue="tab1" className={rootClass} orientation="vertical" activationMode="manual">
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTab value="tab1" className={tabClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <Tabs defaultValue="tab3" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTab value="tab1" className={tabClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>

    <h1>Controlled</h1>
    <Tabs value="tab3" className={rootClass}>
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTab value="tab1" className={tabClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>

    <h1>Vertical</h1>
    <Tabs defaultValue="tab3" className={rootClass} orientation="vertical" activationMode="manual">
      <TabsList aria-label="tabs example" className={listClass}>
        <TabsTab value="tab1" className={tabClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>

    <h1>Data attribute selectors</h1>
    <Tabs defaultValue="tab3" className={rootAttrClass}>
      <TabsList aria-label="tabs example" className={listAttrClass}>
        <TabsTab value="tab1" className={tabAttrClass}>
          Tab 1
        </TabsTab>
        <TabsTab value="tab2" disabled className={tabAttrClass}>
          Tab 2
        </TabsTab>
        <TabsTab value="tab3" className={tabAttrClass}>
          Tab 3
        </TabsTab>
      </TabsList>
      <TabsPanel value="tab1" className={panelAttrClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="tab2" className={panelAttrClass}>
        You'll never find me!
      </TabsPanel>
      <TabsPanel value="tab3" className={panelAttrClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
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

const RECOMMENDED_CSS__TABS__TAB = {
  flexShrink: 0,
};

const tabClass = css({
  ...RECOMMENDED_CSS__TABS__TAB,

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

const RECOMMENDED_CSS__TABS__TAB_PANEL = {
  flexGrow: 1,
};

const panelClass = css({
  ...RECOMMENDED_CSS__TABS__TAB_PANEL,

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
const rootAttrClass = css({ '&[data-radix-tabs]': styles });
const listAttrClass = css({ '&[data-radix-tabs-list]': styles });
const tabAttrClass = css({ '&[data-radix-tabs-tab]': styles });
const panelAttrClass = css({
  '&[data-radix-tabs-panel]': {
    // ensure we can see the content (because it has `hidden` attribute)
    display: 'block',
    ...styles,
  },
});
