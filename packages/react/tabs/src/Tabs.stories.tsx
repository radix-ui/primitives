import * as React from 'react';
import { Tabs } from './Tabs';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Tabs' };

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs defaultSelectedId="tab1" as={StyledRoot}>
      <Tabs.List aria-label="tabs example" as={StyledTabList}>
        <Tabs.Tab id="tab1" as={StyledTab}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab id="tab2" disabled as={StyledTab}>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab id="tab3" as={StyledTab}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="tab1" as={StyledTabPanel}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Panel>
      <Tabs.Panel id="tab2" as={StyledTabPanel}>
        You'll never find me!
      </Tabs.Panel>
      <Tabs.Panel id="tab3" as={StyledTabPanel}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Panel>
    </Tabs>

    <h1>Vertical (manual activation)</h1>
    <Tabs defaultSelectedId="tab1" as={StyledRoot} orientation="vertical" activationMode="manual">
      <Tabs.List aria-label="tabs example" as={StyledTabList}>
        <Tabs.Tab id="tab1" as={StyledTab}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab id="tab2" disabled as={StyledTab}>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab id="tab3" as={StyledTab}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="tab1" as={StyledTabPanel}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Panel>
      <Tabs.Panel id="tab2" as={StyledTabPanel}>
        You'll never find me!
      </Tabs.Panel>
      <Tabs.Panel id="tab3" as={StyledTabPanel}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Panel>
    </Tabs>
  </>
);

const RECOMMENDED_CSS__TABS__ROOT = {
  // ensures things are layed out correctly by default
  display: 'flex',
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
  },
};

const StyledRoot = styled('div', {
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

const StyledTabList = styled('div', {
  ...RECOMMENDED_CSS__TABS__TAB_LIST,
  backgroundColor: '#eee',
});

const RECOMMENDED_CSS__TABS__TAB = {
  flexShrink: 0,
};

const StyledTab = styled('div', {
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

const StyledTabPanel = styled('div', {
  ...RECOMMENDED_CSS__TABS__TAB_PANEL,

  padding: '1em',
  border: '1px solid #eee',
  fontWeight: '300',
  fontSize: '0.85em',
  lineHeight: '1.65',

  '&[data-orientation="horizontal"]': { borderTop: 'none' },
  '&[data-orientation="vertical"]': { borderLeft: 'none' },
});
