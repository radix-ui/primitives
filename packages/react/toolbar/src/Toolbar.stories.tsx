import * as React from 'react';
import {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
  ToolbarRadioGroup,
  ToolbarRadioItem,
} from './Toolbar';
import { css } from '../../../../stitches.config';
import { ToggleButton } from '@radix-ui/react-toggle-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
} from '@radix-ui/react-dropdown-menu';

import { classes } from '../../menu/src/Menu.stories';
const { rootClass: dropdownMenuRootClass, itemClass: dropdownMenuItemClass } = classes;

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
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const ToolbarExample = ({ title, orientation }: any) => (
  <div style={{ padding: 1, margin: -1 }}>
    <h1>{title}</h1>
    <Toolbar
      className={toolbarClass}
      orientation={orientation}
      loop={true}
      aria-label={`${title} toolbar`}
    >
      <ToolbarButton className={toolbarItemClass}>Button</ToolbarButton>
      <ToolbarButton className={toolbarItemClass} disabled>
        Button (disabled)
      </ToolbarButton>
      <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
      <ToolbarLink
        className={toolbarLinkClass}
        href="https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/examples/toolbar/toolbar.html"
        target="_blank"
      >
        Link
      </ToolbarLink>
      <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
      <ToolbarButton className={toolbarToggleButtonClass} as={ToggleButton}>
        Toggle
      </ToolbarButton>
      <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
      <ToolbarRadioGroup className={toolbarRadioGroupClass}>
        <ToolbarRadioItem value="left" className={toolbarRadioItemClass}>
          Left
        </ToolbarRadioItem>
        <ToolbarRadioItem value="center" className={toolbarRadioItemClass}>
          Center
        </ToolbarRadioItem>
        <ToolbarRadioItem value="right" className={toolbarRadioItemClass}>
          Right
        </ToolbarRadioItem>
      </ToolbarRadioGroup>
      <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
      <DropdownMenu>
        <ToolbarButton className={toolbarItemClass} as={DropdownMenuTrigger}>
          Menu
        </ToolbarButton>
        <DropdownMenuContent className={dropdownMenuRootClass} sideOffset={5}>
          <DropdownMenuItem className={dropdownMenuItemClass}>Undo</DropdownMenuItem>
          <DropdownMenuItem className={dropdownMenuItemClass}>Redo</DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>
    </Toolbar>
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

const toolbarRadioGroupClass = css({
  ...RECOMMENDED_CSS__TOOLBAR,
  gap: 5,
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
});

const toolbarRadioItemClass = css(toolbarItemClass, {
  '&[data-state="checked"]': {
    background: 'black',
    color: 'white',
  },
});
