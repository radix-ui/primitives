import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { css, keyframes } from '../../../../stitches.config';
import * as Tabs from '@radix-ui/react-tabs';

export default { title: 'Components/Tabs' };

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs.Root defaultValue="tab1" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical (manual activation)</h1>
    <Tabs.Root
      defaultValue="tab1"
      className={rootClass()}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  </>
);

export const Animated = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs.Root defaultValue="tab1" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" className={animatedContentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical (manual activation)</h1>
    <Tabs.Root
      defaultValue="tab1"
      className={rootClass()}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={animatedContentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <Tabs.Root defaultValue="tab3" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Controlled</h1>
    <Tabs.Root value="tab3" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical</h1>
    <Tabs.Root
      defaultValue="tab3"
      className={rootClass()}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Direction</h1>
    <h2>Prop</h2>
    <Tabs.Root defaultValue="tab3" dir="rtl" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h2>Inherited</h2>
    <DirectionProvider dir="rtl">
      <Tabs.Root defaultValue="tab3" className={rootClass()}>
        <Tabs.List aria-label="tabs example" className={listClass()}>
          <Tabs.Trigger value="tab1" className={triggerClass()}>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" className={triggerClass()}>
            Tab 3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" className={contentClass()}>
          Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem
          himenaeos integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida
          elementum pellentesque volutpat dictum ipsum.
        </Tabs.Content>
        <Tabs.Content value="tab2" className={contentClass()}>
          You'll never find me!
        </Tabs.Content>
        <Tabs.Content value="tab3" className={contentClass()}>
          Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
          quam tempus pretium.
        </Tabs.Content>
      </Tabs.Root>
    </DirectionProvider>

    <h1>Animated</h1>
    <p>Should not animate on initial mount</p>
    <Tabs.Root value="tab1" className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="tab1"
        className={animatedContentClass()}
        style={{ animationDuration: '3000ms' }}
      >
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Force mounted contents</h1>
    <Tabs.Root className={rootClass()}>
      <Tabs.List aria-label="tabs example" className={listClass()}>
        <Tabs.Trigger value="tab1" className={triggerClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" className={triggerClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentClass()} forceMount>
        Tab 1 content
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentClass()} forceMount>
        Tab 2 content
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentClass()} forceMount>
        Tab 3 content
      </Tabs.Content>
    </Tabs.Root>

    <h1>State attributes</h1>
    <Tabs.Root defaultValue="tab3" className={rootAttrClass()}>
      <Tabs.List aria-label="tabs example" className={listAttrClass()}>
        <Tabs.Trigger value="tab1" className={triggerAttrClass()}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={triggerAttrClass()}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={triggerAttrClass()}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={contentAttrClass()}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={contentAttrClass()}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={contentAttrClass()}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
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
  border: '1px solid #eee',
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
  fontWeight: '300',
  fontSize: '0.85em',
  lineHeight: '1.65',
  '&[data-orientation="horizontal"]': { borderTop: 'none' },
  '&[data-orientation="vertical"]': { borderLeft: 'none' },
});

const show = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0px)' },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="active"]': {
    animation: `${show} 400ms ease`,
  },
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
