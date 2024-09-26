import { DirectionProvider } from '@radix-ui/react-direction';
import { css } from '../../../../stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { classes } from '../../menu/src/Menu.stories';
import { Toggle } from '@radix-ui/react-toggle';
import * as Toolbar from '@radix-ui/react-toolbar';

const { contentClass: dropdownMenuContentClass, itemClass: dropdownMenuItemClass } = classes;

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

const ToolbarExample = ({ title, dir, orientation }: any) => (
  <div style={{ padding: 1, margin: -1 }}>
    <h1>{title}</h1>
    <Toolbar.Root
      className={toolbarClass()}
      orientation={orientation}
      loop={true}
      aria-label={`${title} toolbar`}
      dir={dir}
    >
      <Toolbar.Button className={toolbarItemClass()}>Button</Toolbar.Button>
      <Toolbar.Button className={toolbarItemClass()} disabled>
        Button (disabled)
      </Toolbar.Button>
      <Toolbar.Separator className={toolbarSeparatorClass()}></Toolbar.Separator>
      <Toolbar.Link
        className={toolbarLinkClass()}
        href="https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/examples/toolbar/toolbar.html"
        target="_blank"
      >
        Link
      </Toolbar.Link>
      <Toolbar.Separator className={toolbarSeparatorClass()}></Toolbar.Separator>
      <Toolbar.Button className={toolbarToggleButtonClass()} asChild>
        <Toggle>Toggle</Toggle>
      </Toolbar.Button>
      <Toolbar.Separator className={toolbarSeparatorClass()}></Toolbar.Separator>
      <Toolbar.ToggleGroup type="single" className={toolbarToggleGroupClass()}>
        <Toolbar.ToggleItem value="left" className={toolbarToggleItemClass()}>
          Left
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="center" className={toolbarToggleItemClass()}>
          Center
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="right" className={toolbarToggleItemClass()}>
          Right
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className={toolbarSeparatorClass()}></Toolbar.Separator>
      <DropdownMenu.Root>
        <Toolbar.Button className={toolbarItemClass()} asChild>
          <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        </Toolbar.Button>
        <DropdownMenu.Content className={dropdownMenuContentClass()} sideOffset={5}>
          <DropdownMenu.Item className={dropdownMenuItemClass()}>Undo</DropdownMenu.Item>
          <DropdownMenu.Item className={dropdownMenuItemClass()}>Redo</DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Toolbar.Root>
  </div>
);

const RECOMMENDED_CSS__TOOLBAR = {
  // ensures things are layed out correctly by default
  display: 'flex',
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
};

const toolbarClass = css({
  ...RECOMMENDED_CSS__TOOLBAR,
  display: 'inline-flex',
  gap: 5,
  boxSizing: 'border-box',
  minWidth: 130,
  backgroundColor: '$white',
  border: '1px solid $gray100',
  borderRadius: 6,
  padding: 5,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  '&:focus-within': {
    borderColor: '$black',
  },
});

const toolbarSeparatorClass = css({
  height: 1,
  margin: 5,
  backgroundColor: '$gray100',

  '&[data-orientation="vertical"]': {
    width: 1,
    height: 'auto',
  },
});

const toolbarItemClass = css({
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: 'transparent',
  padding: '5px 10px',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  display: 'flex',
  alignItems: 'center',

  '&:focus, &:focus-within': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },

  '&[data-disabled]': {
    opacity: 0.5,
    userSelect: 'none',
  },
});

const toolbarLinkClass = css(toolbarItemClass, {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
});

const toolbarToggleButtonClass = css(toolbarItemClass, {
  '&[data-state="on"]': {
    background: 'black',
    color: 'white',
  },
});

const toolbarToggleGroupClass = css({
  ...RECOMMENDED_CSS__TOOLBAR,
  gap: 5,
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
});

const toolbarToggleItemClass = css(toolbarItemClass, {
  '&[data-state="on"]': {
    background: 'black',
    color: 'white',
  },
});
