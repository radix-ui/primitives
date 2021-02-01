import * as React from 'react';
import { Toolbar, ToolbarGroup, ToolbarLabel, ToolbarSeparator, ToolbarItem } from './Toolbar';
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

const {
  StyledRoot: StyledDropDownMenu,
  StyledItem: StyledDropdownItem,
  StyledLabel,
} = styledComponents;

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

  return (
    <>
      <h1>{title}</h1>
      <Toolbar
        className={StyledToolbar}
        orientation={orientation}
        loop={true}
        aria-label={`${title} toolbar`}
      >
        <ToolbarItem className={StyledToolbarItem} as={ToggleButton}>
          Toggle
        </ToolbarItem>
        <ToolbarSeparator className={StyledToolbarSeparator}></ToolbarSeparator>
        <ToolbarGroup className={StyledToolbarGroup}>
          <ToolbarLabel as={StyledLabel}>A group</ToolbarLabel>
          <label className={StyledToolbarItem} htmlFor="input">
            <span>Input: </span>
            <ToolbarItem
              ref={inputRef}
              id="input"
              value="42"
              as={'input'}
              style={{ maxWidth: 50 }}
            ></ToolbarItem>
          </label>
          <ToolbarItem
            className={StyledToolbarItem}
            as={'button'}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                window.alert('The answer is: ' + inputRef.current?.value);
              }
            }}
          >
            Submit
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarSeparator className={StyledToolbarSeparator}></ToolbarSeparator>
        <DropdownMenu>
          <ToolbarItem className={StyledToolbarItem} as={DropdownMenuTrigger}>
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
        <ToolbarItem className={StyledToolbarItem} as={ToggleButton} disabled>
          Disabled
        </ToolbarItem>
        <ToolbarItem
          as={'a'}
          className={StyledLink}
          href="https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/examples/toolbar/toolbar.html"
          target="_blank"
          ref={anchorRef}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              if (!!anchorRef && !!anchorRef.current) {
                anchorRef.current?.click();
              }
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

const StyledToolbar = css({
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

const StyledToolbarGroup = css({
  ...RECOMMENDED_CSS__TOOLBAR,
  gap: 5,
  '[data-radix-toolbar-label]': {
    padding: 0,
  },

  '&[data-orientation="horizontal"]': {
    '[data-radix-toolbar-label]': {
      alignSelf: 'center',
    },
  },
});

const StyledToolbarSeparator = css({
  width: 1,
  margin: 5,
  backgroundColor: '$gray100',

  '&[data-orientation="vertical"]': {
    height: 1,
    width: 'auto',
  },
});

const StyledToolbarItem = css({
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: 'transparent',
  padding: '5px 10px',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  '&:focus, &:focus-within': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },

  '&[data-state="on"]': {
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.7)',
  },

  '&[data-disabled]': {
    opacity: 0.5,
    pointerEvents: 'none',
    userSelect: 'none',
  },
});

const StyledLink = css(StyledToolbarItem, {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
});
