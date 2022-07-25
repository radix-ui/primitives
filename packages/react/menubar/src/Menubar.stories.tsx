import * as React from 'react';
import * as Menubar from '.';
import { css } from '../../../../stitches.config';
import { classes } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, separatorClass, subTriggerClass } = classes;

export default { title: 'Components/Menubar', excludeStories: ['TEXT'] };

const FIRST_MENU = 'Menu 1';
const MIDDLE_MENU = 'Menu 2';
const LAST_MENU = 'Menu 3';
const NESTED_MENU = 'Nested Menu';
const FIRST_ITEM = 'Item 1';
const SECOND_ITEM = 'Item 2';
const SEPARATOR = ' - ';
const FIRST_MENU_LETTER = 'A';
const MIDDLE_MENU_LETTER = 'B';
const LAST_MENU_LETTER = 'C';

export const Test = () => {
  const [rtl, setRtl] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <label style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
        <Menubar.Root>
          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>
              {FIRST_MENU_LETTER}
              {SEPARATOR}
              {FIRST_MENU}
            </Menubar.Trigger>
            <Menubar.Content className={contentClass()}>
              <Menubar.Item className={itemClass()}>
                {FIRST_MENU}
                {SEPARATOR}
                {FIRST_ITEM}
              </Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.SubMenu>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  {FIRST_MENU}
                  {SEPARATOR}
                  {NESTED_MENU}
                </Menubar.SubTrigger>
                <Menubar.SubContent className={contentClass()}>
                  <Menubar.Item className={itemClass()}>
                    {FIRST_MENU}
                    {SEPARATOR}
                    {NESTED_MENU}
                    {SEPARATOR}
                    {FIRST_ITEM}
                  </Menubar.Item>
                  <Menubar.Arrow />
                </Menubar.SubContent>
              </Menubar.SubMenu>
              <Menubar.Item className={itemClass()}>
                {FIRST_MENU}
                {SEPARATOR}
                {SECOND_ITEM}
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>
              {MIDDLE_MENU_LETTER}
              {SEPARATOR}
              {MIDDLE_MENU}
            </Menubar.Trigger>
            <Menubar.Content className={contentClass()}>
              <Menubar.Item className={itemClass()}>
                {MIDDLE_MENU}
                {SEPARATOR}
                {FIRST_ITEM}
              </Menubar.Item>
              <Menubar.SubMenu>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  {MIDDLE_MENU}
                  {SEPARATOR}
                  {NESTED_MENU}
                </Menubar.SubTrigger>
                <Menubar.SubContent className={contentClass()}>
                  <Menubar.Item className={itemClass()}>
                    {MIDDLE_MENU}
                    {SEPARATOR}
                    {NESTED_MENU}
                    {SEPARATOR}
                    {FIRST_ITEM}
                  </Menubar.Item>
                </Menubar.SubContent>
              </Menubar.SubMenu>
              <Menubar.Item className={itemClass()}>
                {MIDDLE_MENU}
                {SEPARATOR}
                {SECOND_ITEM}
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>
              {LAST_MENU_LETTER}
              {SEPARATOR}
              {LAST_MENU}
            </Menubar.Trigger>
            <Menubar.Content className={contentClass()}>
              <Menubar.Item className={itemClass()}>
                {LAST_MENU}
                {SEPARATOR}
                {FIRST_ITEM}
              </Menubar.Item>
              <Menubar.SubMenu>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  {LAST_MENU}
                  {SEPARATOR}
                  {NESTED_MENU}
                </Menubar.SubTrigger>
                <Menubar.SubContent>
                  <Menubar.Item className={itemClass()}>
                    {LAST_MENU}
                    {SEPARATOR}
                    {NESTED_MENU}
                    {SEPARATOR}
                    {FIRST_ITEM}
                  </Menubar.Item>
                </Menubar.SubContent>
              </Menubar.SubMenu>
              <Menubar.Item className={itemClass()}>
                {LAST_MENU}
                {SEPARATOR}
                {SECOND_ITEM}
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
      </div>
    </div>
  );
};

const defaultBorderRadius = 6;
const triggerClass = css({
  border: '1px solid $black',
  backgroundColor: 'transparent',
  padding: '5px 10px',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },

  '&:first-child': {
    borderTopLeftRadius: defaultBorderRadius,
    borderBottomLeftRadius: defaultBorderRadius,
    borderRight: 0,
  },

  '&:last-child': {
    borderTopRightRadius: defaultBorderRadius,
    borderBottomRightRadius: defaultBorderRadius,
    borderLeft: 0,
  },
});

export const TEXT = {
  FIRST_MENU,
  MIDDLE_MENU,
  LAST_MENU,
  NESTED_MENU,
  FIRST_ITEM,
  SECOND_ITEM,
  SEPARATOR,
  FIRST_MENU_LETTER,
  MIDDLE_MENU_LETTER,
  LAST_MENU_LETTER,
};
