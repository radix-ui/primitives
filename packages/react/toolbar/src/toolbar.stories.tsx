import { DirectionProvider } from '@radix-ui/react-direction';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Toggle } from '@radix-ui/react-toggle';
import * as Toolbar from '@radix-ui/react-toolbar';
import styles from './toolbar.stories.module.css';

export default { title: 'Components/Toolbar' };

export const Styled = () => (
  <>
    <ToolbarExample title="Horizontal"></ToolbarExample>
    <ToolbarExample title="Vertical" orientation="vertical"></ToolbarExample>
  </>
);

export const Chromatic = () => (
  <div style={{ padding: 50 }}>
    <h1>Example</h1>
    <ToolbarExample />
    <ToolbarExample orientation="vertical" />

    <h1>Direction</h1>
    <h2>Prop</h2>
    <ToolbarExample dir="rtl" />

    <h2>Inherited</h2>
    <DirectionProvider dir="rtl">
      <ToolbarExample />
    </DirectionProvider>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const ToolbarExample = ({ title, dir, orientation }: any) => {
  const toggleItemClass = [styles.toolbarItem, styles.toolbarToggleItem].join(' ');
  return (
    <div style={{ padding: 1, margin: -1 }}>
      <h1>{title}</h1>
      <Toolbar.Root
        className={styles.toolbar}
        orientation={orientation}
        loop={true}
        aria-label={`${title} toolbar`}
        dir={dir}
      >
        <Toolbar.Button className={styles.toolbarItem}>Button</Toolbar.Button>
        <Toolbar.Button className={styles.toolbarItem} disabled>
          Button (disabled)
        </Toolbar.Button>
        <Toolbar.Separator className={styles.toolbarSeparator}></Toolbar.Separator>
        <Toolbar.Link
          className={[styles.toolbarItem, styles.toolbarLink].join(' ')}
          href="https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/examples/toolbar/toolbar.html"
          target="_blank"
        >
          Link
        </Toolbar.Link>
        <Toolbar.Separator className={styles.toolbarSeparator}></Toolbar.Separator>
        <Toolbar.Button
          className={[styles.toolbarItem, styles.toolbarToggleButton].join(' ')}
          asChild
        >
          <Toggle>Toggle</Toggle>
        </Toolbar.Button>
        <Toolbar.Separator className={styles.toolbarSeparator}></Toolbar.Separator>
        <Toolbar.ToggleGroup type="single" className={styles.toolbarToggleGroup}>
          <Toolbar.ToggleItem value="left" className={toggleItemClass}>
            Left
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem value="center" className={toggleItemClass}>
            Center
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem value="right" className={toggleItemClass}>
            Right
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
        <Toolbar.Separator className={styles.toolbarSeparator}></Toolbar.Separator>
        <DropdownMenu.Root>
          <Toolbar.Button className={styles.toolbarItem} asChild>
            <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
          </Toolbar.Button>
          <DropdownMenu.Content className={styles.dropdownMenuContent} sideOffset={5}>
            <DropdownMenu.Item className={styles.dropdownMenuItem}>Undo</DropdownMenu.Item>
            <DropdownMenu.Item className={styles.dropdownMenuItem}>Redo</DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Toolbar.Root>
    </div>
  );
};
