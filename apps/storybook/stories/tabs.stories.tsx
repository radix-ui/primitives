import { Direction, Tabs } from 'radix-ui';
import styles from './tabs.stories.module.css';

export default { title: 'Components/Tabs' };

const animatedContentClass = [styles.content, styles.animatedContent].join(' ');

export const Styled = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs.Root defaultValue="tab1" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical (manual activation)</h1>
    <Tabs.Root
      defaultValue="tab1"
      className={styles.root}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  </>
);

export const Animated = () => (
  <>
    <h1>Horizontal (automatic activation)</h1>
    <Tabs.Root defaultValue="tab1" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" className={animatedContentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical (manual activation)</h1>
    <Tabs.Root
      defaultValue="tab1"
      className={styles.root}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={animatedContentClass}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <Tabs.Root defaultValue="tab3" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Controlled</h1>
    <Tabs.Root value="tab3" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Vertical</h1>
    <Tabs.Root
      defaultValue="tab3"
      className={styles.root}
      orientation="vertical"
      activationMode="manual"
    >
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Direction</h1>
    <h2>Prop</h2>
    <Tabs.Root defaultValue="tab3" dir="rtl" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h2>Inherited</h2>
    <Direction.Provider dir="rtl">
      <Tabs.Root defaultValue="tab3" className={styles.root}>
        <Tabs.List aria-label="tabs example" className={styles.list}>
          <Tabs.Trigger value="tab1" className={styles.trigger}>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" className={styles.trigger}>
            Tab 3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" className={styles.content}>
          Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem
          himenaeos integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida
          elementum pellentesque volutpat dictum ipsum.
        </Tabs.Content>
        <Tabs.Content value="tab2" className={styles.content}>
          You'll never find me!
        </Tabs.Content>
        <Tabs.Content value="tab3" className={styles.content}>
          Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
          quam tempus pretium.
        </Tabs.Content>
      </Tabs.Root>
    </Direction.Provider>

    <h1>Animated</h1>
    <p>Should not animate on initial mount</p>
    <Tabs.Root value="tab1" className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="tab1"
        className={animatedContentClass}
        style={{ animationDuration: '3000ms' }}
      >
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={animatedContentClass}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={animatedContentClass}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>

    <h1>Force mounted contents</h1>
    <Tabs.Root className={styles.root}>
      <Tabs.List aria-label="tabs example" className={styles.list}>
        <Tabs.Trigger value="tab1" className={styles.trigger}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" className={styles.trigger}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.trigger}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.content} forceMount>
        Tab 1 content
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.content} forceMount>
        Tab 2 content
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.content} forceMount>
        Tab 3 content
      </Tabs.Content>
    </Tabs.Root>

    <h1>State attributes</h1>
    <Tabs.Root defaultValue="tab3" className={styles.rootAttr}>
      <Tabs.List aria-label="tabs example" className={styles.listAttr}>
        <Tabs.Trigger value="tab1" className={styles.triggerAttr}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled className={styles.triggerAttr}>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={styles.triggerAttr}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={styles.contentAttr}>
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.contentAttr}>
        You'll never find me!
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.contentAttr}>
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
