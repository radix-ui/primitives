import * as React from 'react';
import { Menu } from './Menu';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Menu' };

export const Styled = () => (
  <Menu as={StyledRoot}>
    <Menu.Item as={StyledItem} onSelect={() => window.alert('undo')}>
      Undo
    </Menu.Item>
    <Menu.Item as={StyledItem} onSelect={() => window.alert('redo')}>
      Redo
    </Menu.Item>
    <Menu.Separator as={StyledSeparator} />
    <Menu.Item as={StyledItem} disabled onSelect={() => window.alert('cut')}>
      Cut
    </Menu.Item>
    <Menu.Item as={StyledItem} onSelect={() => window.alert('copy')}>
      Copy
    </Menu.Item>
    <Menu.Item as={StyledItem} onSelect={() => window.alert('paste')}>
      Paste
    </Menu.Item>
  </Menu>
);

const StyledRoot = styled('div', {
  display: 'inline-block',
  boxSizing: 'border-box',
  minWidth: 130,
  backgroundColor: '$white',
  border: '1px solid $gray100',
  borderRadius: 6,
  padding: 5,
  boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.1)',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
});

const StyledItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  cursor: 'default',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  height: 25,
  padding: '0 25px',
  color: 'black',
  borderRadius: 3,

  '&:focus': {
    outline: 'none',
    backgroundColor: 'black',
    color: 'white',
  },

  '&[data-disabled]': {
    color: '$gray100',
  },
});

const StyledSeparator = styled('div', {
  height: 1,
  margin: 5,
  backgroundColor: '$gray100',
});
