import * as React from 'react';
import { Tabs } from './Tabs';

export default { title: 'Tabs' };

export const Basic = () => (
  <Tabs defaultSelectedId="tab1">
    <Tabs.List aria-label="tabs example">
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2" disabled>
        Tab 2
      </Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id="tab1">Panel 1</Tabs.Panel>
    <Tabs.Panel id="tab2">Panel 2</Tabs.Panel>
    <Tabs.Panel id="tab3">Panel 3</Tabs.Panel>
  </Tabs>
);

export const InlineStyle = () => {
  const [selectedId, setSelectedId] = React.useState<string>('tab1');
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const disabledId = 'tab2';

  function getTabStyle(id: string): React.CSSProperties {
    const selected = id === selectedId;
    const focused = id === focusedId;
    const disabled = id === disabledId;
    return {
      lineHeight: 1,
      fontWeight: 'bold',
      padding: '0.2em 0.6em',
      borderTop: `4px solid transparent`,
      borderBottom: `4px solid ${selected ? 'crimson' : focused ? 'royalblue' : 'transparent'}`,
      outline: focused ? `2px solid ${selected ? 'crimson' : 'royalblue'}` : undefined,
      opacity: disabled ? 0.5 : 1,
      cursor: 'pointer',
      userSelect: 'none',
      boxShadow: 'none',
    };
  }

  const tabPanelStyle = {
    padding: '0.4em',
    borderTop: 'none',
    lineHeight: '1.5',
  };

  function handleTabFocus(e: React.FocusEvent) {
    const { tabId: clickedTabId } = (e.target as HTMLElement)?.dataset || {};
    if (clickedTabId) {
      setFocusedId(clickedTabId);
    }
  }

  function handleTabBlur(e: React.FocusEvent) {
    setFocusedId(null);
  }

  return (
    <Tabs
      activationMode="manual"
      style={{ fontFamily: 'sans-serif', maxWidth: '20rem' }}
      selectedId={selectedId}
      onSelect={setSelectedId}
    >
      <Tabs.List
        aria-label="tabs example"
        style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.05)' }}
      >
        <Tabs.Tab
          onFocus={handleTabFocus}
          onBlur={handleTabBlur}
          style={getTabStyle('tab1')}
          id="tab1"
        >
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab
          onFocus={handleTabFocus}
          onBlur={handleTabBlur}
          style={getTabStyle('tab2')}
          id="tab2"
          disabled
        >
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab
          onFocus={handleTabFocus}
          onBlur={handleTabBlur}
          style={getTabStyle('tab3')}
          id="tab3"
        >
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel style={tabPanelStyle} id="tab1">
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Panel>
      <Tabs.Panel style={tabPanelStyle} id="tab2">
        You'll never find me!
      </Tabs.Panel>
      <Tabs.Panel style={tabPanelStyle} id="tab3">
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Panel>
    </Tabs>
  );
};
