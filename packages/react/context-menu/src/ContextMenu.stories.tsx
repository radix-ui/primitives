import * as React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuTriggerItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
  ContextMenuArrow,
} from './ContextMenu';
import { css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { classes, TickIcon } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, labelClass, separatorClass, subTriggerClass } = classes;

export default { title: 'Components/ContextMenu' };

export const Styled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200vw',
        height: '200vh',
        gap: 20,
      }}
    >
      <ContextMenu onOpenChange={setOpen}>
        <ContextMenuTrigger
          className={triggerClass}
          style={{ background: open ? 'lightblue' : undefined }}
        >
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className={contentClass} alignOffset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          <ContextMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const Modality = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110vh' }}
    >
      <div style={{ display: 'grid', gridGap: 50 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Modal (default)</h1>
          <ContextMenu onOpenChange={setOpen1}>
            <ContextMenuTrigger
              className={triggerClass}
              style={{ background: open1 ? 'lightblue' : undefined }}
            />
            <ContextMenuContent className={contentClass} alignOffset={-5}>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('undo')}>
                Undo
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('redo')}>
                Redo
              </ContextMenuItem>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenu>
                <ContextMenuTriggerItem className={subTriggerClass}>
                  Submenu →
                </ContextMenuTriggerItem>
                <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('one')}>
                    One
                  </ContextMenuItem>
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('two')}>
                    Two
                  </ContextMenuItem>
                  <ContextMenuSeparator className={separatorClass} />
                  <ContextMenu>
                    <ContextMenuTriggerItem className={subTriggerClass}>
                      Submenu →
                    </ContextMenuTriggerItem>
                    <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('one')}>
                        One
                      </ContextMenuItem>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('two')}>
                        Two
                      </ContextMenuItem>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('three')}>
                        Three
                      </ContextMenuItem>
                      <ContextMenuArrow offset={14} />
                    </ContextMenuContent>
                  </ContextMenu>
                  <ContextMenuSeparator className={separatorClass} />
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('three')}>
                    Three
                  </ContextMenuItem>
                  <ContextMenuArrow offset={14} />
                </ContextMenuContent>
              </ContextMenu>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
                Cut
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('copy')}>
                Copy
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('paste')}>
                Paste
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Non modal</h1>
          <ContextMenu onOpenChange={setOpen2} modal={false}>
            <ContextMenuTrigger
              className={triggerClass}
              style={{ background: open2 ? 'lightblue' : undefined }}
            />
            <ContextMenuContent className={contentClass} alignOffset={-5}>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('undo')}>
                Undo
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('redo')}>
                Redo
              </ContextMenuItem>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenu>
                <ContextMenuTriggerItem className={subTriggerClass}>
                  Submenu →
                </ContextMenuTriggerItem>
                <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('one')}>
                    One
                  </ContextMenuItem>
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('two')}>
                    Two
                  </ContextMenuItem>
                  <ContextMenuSeparator className={separatorClass} />
                  <ContextMenu>
                    <ContextMenuTriggerItem className={subTriggerClass}>
                      Submenu →
                    </ContextMenuTriggerItem>
                    <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('one')}>
                        One
                      </ContextMenuItem>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('two')}>
                        Two
                      </ContextMenuItem>
                      <ContextMenuItem className={itemClass} onSelect={() => console.log('three')}>
                        Three
                      </ContextMenuItem>
                      <ContextMenuArrow offset={14} />
                    </ContextMenuContent>
                  </ContextMenu>
                  <ContextMenuSeparator className={separatorClass} />
                  <ContextMenuItem className={itemClass} onSelect={() => console.log('three')}>
                    Three
                  </ContextMenuItem>
                  <ContextMenuArrow offset={14} />
                </ContextMenuContent>
              </ContextMenu>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
                Cut
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('copy')}>
                Copy
              </ContextMenuItem>
              <ContextMenuItem className={itemClass} onSelect={() => console.log('paste')}>
                Paste
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
      </div>
    </div>
  );
};

export const Submenus = () => {
  const [open, setOpen] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
        <ContextMenu onOpenChange={setOpen} dir={rtl ? 'rtl' : 'ltr'}>
          <ContextMenuTrigger
            className={triggerClass}
            style={{ background: open ? 'lightblue' : undefined }}
          >
            Right Click Here
          </ContextMenuTrigger>
          <ContextMenuContent className={contentClass} sideOffset={5}>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('new-tab')}>
              New Tab
            </ContextMenuItem>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('new-window')}>
              New Window
            </ContextMenuItem>
            <ContextMenuSeparator className={separatorClass} />
            <ContextMenu>
              <ContextMenuTriggerItem className={subTriggerClass}>
                Bookmarks →
              </ContextMenuTriggerItem>
              <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('inbox')}>
                  Inbox
                </ContextMenuItem>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('calendar')}>
                  Calendar
                </ContextMenuItem>
                <ContextMenuSeparator className={separatorClass} />
                <ContextMenu>
                  <ContextMenuTriggerItem className={subTriggerClass}>
                    Modulz →
                  </ContextMenuTriggerItem>
                  <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                    <ContextMenuItem className={itemClass} onSelect={() => console.log('stitches')}>
                      Stitches
                    </ContextMenuItem>
                    <ContextMenuItem className={itemClass} onSelect={() => console.log('composer')}>
                      Composer
                    </ContextMenuItem>
                    <ContextMenuItem className={itemClass} onSelect={() => console.log('radix')}>
                      Radix
                    </ContextMenuItem>
                    <ContextMenuArrow offset={14} />
                  </ContextMenuContent>
                </ContextMenu>
                <ContextMenuSeparator className={separatorClass} />
                <ContextMenuItem className={itemClass} onSelect={() => console.log('notion')}>
                  Notion
                </ContextMenuItem>
                <ContextMenuArrow offset={14} />
              </ContextMenuContent>
            </ContextMenu>
            <ContextMenu>
              <ContextMenuTriggerItem className={subTriggerClass} disabled>
                History →
              </ContextMenuTriggerItem>
              <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('github')}>
                  Github
                </ContextMenuItem>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('google')}>
                  Google
                </ContextMenuItem>
                <ContextMenuItem
                  className={itemClass}
                  onSelect={() => console.log('stack-overflow')}
                >
                  Stack Overflow
                </ContextMenuItem>
                <ContextMenuArrow offset={14} />
              </ContextMenuContent>
            </ContextMenu>
            <ContextMenu>
              <ContextMenuTriggerItem className={subTriggerClass}>Tools →</ContextMenuTriggerItem>
              <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('extensions')}>
                  Extensions
                </ContextMenuItem>
                <ContextMenuItem className={itemClass} onSelect={() => console.log('task-manager')}>
                  Task Manager
                </ContextMenuItem>
                <ContextMenuItem
                  className={itemClass}
                  onSelect={() => console.log('developer-tools')}
                >
                  Developer Tools
                </ContextMenuItem>
                <ContextMenuArrow offset={14} />
              </ContextMenuContent>
            </ContextMenu>
            <ContextMenuSeparator className={separatorClass} />
            <ContextMenuItem className={itemClass} disabled onSelect={() => console.log('print')}>
              Print…
            </ContextMenuItem>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('cast')}>
              Cast…
            </ContextMenuItem>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('find')}>
              Find…
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
};

export const WithLabels = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
      <ContextMenuContent className={contentClass} alignOffset={-5}>
        {foodGroups.map((foodGroup, index) => (
          <ContextMenuGroup key={index}>
            {foodGroup.label && (
              <ContextMenuLabel className={labelClass} key={foodGroup.label}>
                {foodGroup.label}
              </ContextMenuLabel>
            )}
            {foodGroup.foods.map((food) => (
              <ContextMenuItem
                key={food.value}
                className={itemClass}
                disabled={food.disabled}
                onSelect={() => console.log(food.label)}
              >
                {food.label}
              </ContextMenuItem>
            ))}
            {index < foodGroups.length - 1 && <ContextMenuSeparator className={separatorClass} />}
          </ContextMenuGroup>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

export const CheckboxItems = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
        <ContextMenuContent className={contentClass} alignOffset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('show')}>
            Show fonts
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('bigger')}>
            Bigger
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <ContextMenuCheckboxItem
              key={label}
              className={itemClass}
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            >
              {label}
              <ContextMenuItemIndicator>
                <TickIcon />
              </ContextMenuItemIndicator>
            </ContextMenuCheckboxItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
        <ContextMenuContent className={contentClass} alignOffset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('minimize')}>
            Minimize window
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('zoom')}>
            Zoom
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          <ContextMenuRadioGroup value={file} onValueChange={setFile}>
            {files.map((file) => (
              <ContextMenuRadioItem key={file} className={itemClass} value={file}>
                {file}
                <ContextMenuItemIndicator>
                  <TickIcon />
                </ContextMenuItemIndicator>
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
      <ContextMenuContent className={contentClass} alignOffset={-5}>
        <ContextMenuItem className={itemClass} onSelect={() => window.alert('action 1')}>
          I will close
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          onSelect={(event) => {
            event.preventDefault();
            window.alert('action 1');
          }}
        >
          I won't close
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

export const Multiple = () => {
  const [customColors, setCustomColors] = React.useState<{ [index: number]: string }>({});
  const [fadedIndexes, setFadedIndexes] = React.useState<number[]>([]);
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const customColor = customColors[i];
        return (
          <ContextMenu key={i}>
            <ContextMenuContent className={animatedContentClass} alignOffset={-5}>
              <ContextMenuLabel className={labelClass}>Color</ContextMenuLabel>
              <ContextMenuRadioGroup
                value={customColor}
                onValueChange={(color) => setCustomColors((colors) => ({ ...colors, [i]: color }))}
              >
                <ContextMenuRadioItem className={itemClass} value="royalblue">
                  Blue
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem className={itemClass} value="tomato">
                  Red
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenuCheckboxItem
                className={itemClass}
                checked={fadedIndexes.includes(i)}
                onCheckedChange={(faded) =>
                  setFadedIndexes((indexes) =>
                    faded ? [...indexes, i] : indexes.filter((index) => index !== i)
                  )
                }
              >
                Fade
                <ContextMenuItemIndicator>
                  <TickIcon />
                </ContextMenuItemIndicator>
              </ContextMenuCheckboxItem>
            </ContextMenuContent>
            <ContextMenuTrigger>
              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: customColor ? customColor : '#eeeef0',
                  color: customColor ? 'white' : '#666670',
                  fontSize: 32,
                  borderRadius: 5,
                  cursor: 'default',
                  userSelect: 'none',
                  opacity: fadedIndexes.includes(i) ? 0.5 : 1,
                }}
              >
                {i + 1}
              </div>
            </ContextMenuTrigger>
          </ContextMenu>
        );
      })}
    </div>
  );
};

export const Nested = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ContextMenu>
      <ContextMenuTrigger
        className={triggerClass}
        style={{ padding: 100, backgroundColor: 'royalblue' }}
      >
        <ContextMenu>
          <ContextMenuTrigger className={triggerClass} style={{ backgroundColor: 'tomato' }} />{' '}
          <ContextMenuContent className={contentClass} alignOffset={-5}>
            <ContextMenuLabel className={labelClass}>Red box menu</ContextMenuLabel>
            <ContextMenuSeparator className={separatorClass} />
            <ContextMenuItem className={itemClass} onSelect={() => console.log('red action1')}>
              Red action 1
            </ContextMenuItem>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('red action2')}>
              Red action 2
            </ContextMenuItem>
            <ContextMenuSeparator className={separatorClass} />
            <ContextMenu>
              <ContextMenuTriggerItem className={subTriggerClass}>Submenu →</ContextMenuTriggerItem>
              <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
                <ContextMenuItem
                  className={itemClass}
                  onSelect={() => console.log('red sub action 1')}
                >
                  Red sub action 1
                </ContextMenuItem>
                <ContextMenuItem
                  className={itemClass}
                  onSelect={() => console.log('red sub action 2')}
                >
                  Red sub action 2
                </ContextMenuItem>
                <ContextMenuArrow offset={14} />
              </ContextMenuContent>
            </ContextMenu>
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuTrigger>
      <ContextMenuContent className={contentClass} alignOffset={-5}>
        <ContextMenuLabel className={labelClass}>Blue box menu</ContextMenuLabel>
        <ContextMenuSeparator className={separatorClass} />
        <ContextMenuItem className={itemClass} onSelect={() => console.log('blue action1')}>
          Blue action 1
        </ContextMenuItem>
        <ContextMenuItem className={itemClass} onSelect={() => console.log('blue action2')}>
          Blue action 2
        </ContextMenuItem>
        <ContextMenuSeparator className={separatorClass} />
        <ContextMenu>
          <ContextMenuTriggerItem className={subTriggerClass}>Submenu →</ContextMenuTriggerItem>
          <ContextMenuContent className={contentClass} sideOffset={12} alignOffset={-6}>
            <ContextMenuItem
              className={itemClass}
              onSelect={() => console.log('blue sub action 1')}
            >
              Blue sub action 1
            </ContextMenuItem>
            <ContextMenuItem
              className={itemClass}
              onSelect={() => console.log('blue sub action 2')}
            >
              Blue sub action 2
            </ContextMenuItem>
            <ContextMenuArrow offset={14} />
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

const triggerClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 200,
  height: 100,
  border: '2px dashed $black',
  borderRadius: 6,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },
});

const scaleIn = css.keyframes({
  '0%': { transform: 'scale(0) rotateZ(-10deg)' },
  '20%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

const animatedContentClass = css(contentClass, {
  transformOrigin: 'var(--radix-context-menu-content-transform-origin)',
  '&[data-state="open"]': { animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)` },
});
