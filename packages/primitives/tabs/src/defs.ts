enum TabsParts {
  Container = 'Tabs',
  TabList = 'Tabs.List',
  Tab = 'Tabs.Tab',
  Panel = 'Tabs.Panel',
}

// Common type, needs to move
enum PartTypes {
  Root = 'ROOT',
  IndexedCollection = 'INDEXED_COLLECTION',
  IndexedDescendant = 'INDEXED_DESCENDANT',
}

type TabsProps = {
  /** The id of the selected tab, if controlled */
  selectedId?: string;
  /** The id of the tab to select by default, if uncontrolled */
  defaultSelectedId?: string;
  /** A function called when a new tab is selected */
  onSelect?(id?: string): void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * (default: horizontal)
   */
  orientation?: 'horizontal' | 'vertical';
  /** Whether a tab is activated automatically or manually (default: automatic) */
  activationMode?: 'automatic' | 'manual';
  /** Whether tab navigation loops around or not (default: true) */
  shouldLoop?: boolean;
};

const container: RootPartDefinition<TabsProps> = {
  type: PartTypes.Root,
  displayName: TabsParts.Container,
  tagName: 'div',
  defaultProps: {
    orientation: 'horizontal',
    activationMode: 'automatic',
    shouldLoop: true,
  },
};

type TabListProps = {};

const tabList: PartDefinition<TabListProps> = {
  displayName: TabsParts.TabList,
  tagName: 'div',
  attrs: {
    role: 'tablist',
    'aria-orientation': (ctx: any) => ctx.orientation,
  },
};

type TabProps = {
  id: string;
  disabled?: boolean;
};

const tab: PartDefinition<TabProps> = {
  displayName: TabsParts.Tab,
  tagName: 'div',
  attrs: {
    id: (props: any) => `tab-${props.id}`,
    role: 'tab',
    'aria-selected': (ctx: any, props: any) => ctx.selectedId === `tab-${props.id}`,
    'aria-controls': (props: any) => `panel-${props.id}`,
    'aria-disabled': (props: any) => props.disabled || undefined,
    tabindex: (ctx: any, props: any) => (ctx.selectedId === `tab-${props.id}` ? 0 : -1),
  },
  events: {
    onFocus(event: any) {
      // TODO
    },
    onKeyDown(event: any) {
      // TODO
    },
  },
};

type TabPanelProps = {
  id: string;
};

const panel: PartDefinition<TabPanelProps> = {
  displayName: TabsParts.Panel,
  tagName: 'div',
  attrs: {
    id: (props: any) => `panel-${props.id}`,
    role: 'tabpanel',
    'aria-labelledby': (props: any) => `tab-${props.id}`,
    tabindex: 0,
    hidden: (ctx: any, props: any) => ctx.selectedId !== `tab-${props.id}`,
  },
};

const tabsDefinition = {
  container,
  tabList,
  tab,
  panel,
};

export { TabsParts, tabsDefinition };
export type { TabsProps, TabListProps, TabProps, TabPanelProps };

// Common primitive types, these should be moved somewhere

interface PartDefinition<Props> {
  type?: PartTypes;
  displayName: string;
  tagName: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | null;
  defaultProps?: Partial<Props>;
  attrs?: {
    [key: string]: any;
  };
  events?: {
    [key: string]: any;
  };
}

interface RootPartDefinition<Props> extends PartDefinition<Props> {
  type: PartTypes.Root;
  context?: { [key: string]: any };
}
