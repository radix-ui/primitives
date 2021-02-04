import * as React from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarItem } from './Toolbar';
import { css } from '../../../../stitches.config';
import { ToggleButton } from '@radix-ui/react-toggle-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
} from '@radix-ui/react-dropdown-menu';

import { styledComponents } from '../../menu/src/Menu.stories';

const { StyledRoot: StyledDropDownMenu, StyledItem: StyledDropdownItem } = styledComponents;

export default { title: 'Components/Toolbar' };

export const Styled = () => {
  return (
    <>
      <ToolbarExample title="Horizontal"></ToolbarExample>
      <ToolbarExample title="Vertical" orientation="vertical"></ToolbarExample>
    </>
  );
};

const ToolbarExample = ({ title, orientation }: any) => {
  const anchorRef = React.useRef<HTMLAnchorElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uniqueInputID = 'input-' + (Math.random() * 10).toFixed(0);

  return (
    <>
      <h1>{title}</h1>
      <Toolbar
        className={toolbarClass}
        orientation={orientation}
        loop={true}
        aria-label={`${title} toolbar`}
      >
        <ToolbarItem className={toolbarItemClass} as={ToggleButton}>
          Toggle
        </ToolbarItem>
        <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
        <ToolbarGroup className={toolbarGroupClass}>
          <div className="toolbar-label">A group</div>
          <label className={toolbarItemClass} htmlFor={uniqueInputID}>
            <span>Input: </span>
            <ToolbarItem
              ref={inputRef}
              id={uniqueInputID}
              defaultValue="42"
              as={'input'}
              style={{ maxWidth: 50 }}
            ></ToolbarItem>
          </label>
          <ToolbarItem
            className={toolbarItemClass}
            as={'button'}
            onClick={(event) => window.alert('The answer is: ' + inputRef.current?.value)}
          >
            Submit
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarSeparator className={toolbarSeparatorClass}></ToolbarSeparator>
        <DropdownMenu>
          <ToolbarItem className={toolbarItemClass} as={DropdownMenuTrigger}>
            Menu
          </ToolbarItem>
          <DropdownMenuContent as={StyledDropDownMenu} sideOffset={5}>
            <DropdownMenuItem as={StyledDropdownItem} onSelect={() => window.alert('undo')}>
              Undo
            </DropdownMenuItem>
            <DropdownMenuItem as={StyledDropdownItem} onSelect={() => window.alert('redo')}>
              Redo
            </DropdownMenuItem>
            <DropdownMenuArrow />
          </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarItem
          className={toolbarItemClass}
          as={'div'}
          onClick={() => window.alert('Oh oh! How did this happen?')}
          disabled
        >
          Disabled
        </ToolbarItem>
        <ToolbarItem
          as={'a'}
          className={linkClass}
          href="https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/examples/toolbar/toolbar.html"
          target="_blank"
          ref={anchorRef}
          onKeyDown={(event) => {
            if (event.key === ' ') {
              anchorRef.current?.click();
            }
          }}
        >
          Examle
        </ToolbarItem>
      </Toolbar>
    </>
  );
};

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

const toolbarGroupClass = css({
  ...RECOMMENDED_CSS__TOOLBAR,
  gap: 5,
  '.toolbar-label': {
    padding: 0,
    color: '$gray100',
    textAlign: 'center',
  },

  '&[data-orientation="horizontal"]': {
    '.toolbar-label': {
      alignSelf: 'center',
    },
  },
});

const toolbarSeparatorClass = css({
  width: 1,
  margin: 5,
  backgroundColor: '$gray100',

  '&[data-orientation="vertical"]': {
    height: 1,
    width: 'auto',
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

  '&[data-state="on"]': {
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.7)',
  },

  '&[data-disabled]': {
    opacity: 0.5,
    userSelect: 'none',
  },
});

const linkClass = css(toolbarItemClass, {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
});
