import * as React from 'react';
import { Tabs, styles } from './Tabs';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Tabs' };

export const Basic = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs defaultSelectedId="tab1" as={BasicStyledTabs}>
      <Tabs.List aria-label="tabs example" as={BasicStyledTabList}>
        <Tabs.Tab id="tab1" as={BasicStyledTab}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab id="tab2" disabled as={BasicStyledTab}>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab id="tab3" as={BasicStyledTab}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="tab1" as={BasicStyledTabPanel}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Panel>
      <Tabs.Panel id="tab2" as={BasicStyledTabPanel}>
        You'll never find me!
      </Tabs.Panel>
      <Tabs.Panel id="tab3" as={BasicStyledTabPanel}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Panel>
    </Tabs>

    <h1>Vertical (manual activation)</h1>
    <Tabs
      defaultSelectedId="tab1"
      as={BasicStyledTabs}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" as={BasicStyledTabList}>
        <Tabs.Tab id="tab1" as={BasicStyledTab}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab id="tab2" disabled as={BasicStyledTab}>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab id="tab3" as={BasicStyledTab}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="tab1" as={BasicStyledTabPanel}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Panel>
      <Tabs.Panel id="tab2" as={BasicStyledTabPanel}>
        You'll never find me!
      </Tabs.Panel>
      <Tabs.Panel id="tab3" as={BasicStyledTabPanel}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Panel>
    </Tabs>
  </>
);

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs defaultSelectedId="tab1" as={StyledTabs}>
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
    <Tabs defaultSelectedId="tab1" as={StyledTabs} orientation="vertical" activationMode="manual">
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

const BasicStyledTabs = styled('div', styles.tabs);

const BasicStyledTabList = styled('div', styles.tabList);

const BasicStyledTab = styled('div', styles.tab);

const BasicStyledTabPanel = styled('div', styles.tabPanel);

const StyledTabs = styled(BasicStyledTabs, {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  maxWidth: '20rem',
});

const StyledTabList = styled(BasicStyledTabList, {
  backgroundColor: '#eee',
});

const StyledTab = styled(BasicStyledTab, {
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

const StyledTabPanel = styled(BasicStyledTabPanel, {
  padding: '1em',
  border: '1px solid #eee',
  fontWeight: '300',
  fontSize: '0.85em',
  lineHeight: '1.65',

  '&[data-orientation="horizontal"]': { borderTop: 'none' },
  '&[data-orientation="vertical"]': { borderLeft: 'none' },
});
