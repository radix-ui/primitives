import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as ContextMenu from '@radix-ui/react-context-menu';
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
      <ContextMenu.Root onOpenChange={setOpen}>
        <ContextMenu.Trigger
          className={triggerClass()}
          style={{ background: open ? 'lightblue' : undefined }}
        >
          Right click here
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={contentClass()} alignOffset={-5}>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </ContextMenu.Item>
            <ContextMenu.Separator className={separatorClass()} />
            <ContextMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
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
      <div style={{ display: 'grid', gap: 50 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Modal (default)</h1>
          <ContextMenu.Root onOpenChange={setOpen1}>
            <ContextMenu.Trigger
              className={triggerClass()}
              style={{ background: open1 ? 'lightblue' : undefined }}
            />
            <ContextMenu.Portal>
              <ContextMenu.Content className={contentClass()} alignOffset={-5}>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                  Undo
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                  Redo
                </ContextMenu.Item>
                <ContextMenu.Separator className={separatorClass()} />
                <ContextMenu.Sub>
                  <ContextMenu.SubTrigger className={subTriggerClass()}>
                    Submenu →
                  </ContextMenu.SubTrigger>
                  <ContextMenu.SubContent
                    className={contentClass()}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                      One
                    </ContextMenu.Item>
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                      Two
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={separatorClass()} />
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className={subTriggerClass()}>
                        Submenu →
                      </ContextMenu.SubTrigger>
                      <ContextMenu.SubContent
                        className={contentClass()}
                        sideOffset={12}
                        alignOffset={-6}
                      >
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('one')}
                        >
                          One
                        </ContextMenu.Item>
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('two')}
                        >
                          Two
                        </ContextMenu.Item>
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('three')}
                        >
                          Three
                        </ContextMenu.Item>
                        <ContextMenu.Arrow offset={14} />
                      </ContextMenu.SubContent>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator className={separatorClass()} />
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('three')}>
                      Three
                    </ContextMenu.Item>
                    <ContextMenu.Arrow offset={14} />
                  </ContextMenu.SubContent>
                </ContextMenu.Sub>
                <ContextMenu.Separator className={separatorClass()} />
                <ContextMenu.Item
                  className={itemClass()}
                  disabled
                  onSelect={() => console.log('cut')}
                >
                  Cut
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
                  Copy
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
                  Paste
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </ContextMenu.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Non modal</h1>
          <ContextMenu.Root onOpenChange={setOpen2} modal={false}>
            <ContextMenu.Trigger
              className={triggerClass()}
              style={{ background: open2 ? 'lightblue' : undefined }}
            />
            <ContextMenu.Portal>
              <ContextMenu.Content className={contentClass()} alignOffset={-5}>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                  Undo
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                  Redo
                </ContextMenu.Item>
                <ContextMenu.Separator className={separatorClass()} />
                <ContextMenu.Sub>
                  <ContextMenu.SubTrigger className={subTriggerClass()}>
                    Submenu →
                  </ContextMenu.SubTrigger>
                  <ContextMenu.SubContent
                    className={contentClass()}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                      One
                    </ContextMenu.Item>
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                      Two
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={separatorClass()} />
                    <ContextMenu.Sub defaultOpen>
                      <ContextMenu.SubTrigger className={subTriggerClass()}>
                        Submenu →
                      </ContextMenu.SubTrigger>
                      <ContextMenu.SubContent
                        className={contentClass()}
                        sideOffset={12}
                        alignOffset={-6}
                      >
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('one')}
                        >
                          One
                        </ContextMenu.Item>
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('two')}
                        >
                          Two
                        </ContextMenu.Item>
                        <ContextMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('three')}
                        >
                          Three
                        </ContextMenu.Item>
                        <ContextMenu.Arrow offset={14} />
                      </ContextMenu.SubContent>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator className={separatorClass()} />
                    <ContextMenu.Item className={itemClass()} onSelect={() => console.log('three')}>
                      Three
                    </ContextMenu.Item>
                    <ContextMenu.Arrow offset={14} />
                  </ContextMenu.SubContent>
                </ContextMenu.Sub>
                <ContextMenu.Separator className={separatorClass()} />
                <ContextMenu.Item
                  className={itemClass()}
                  disabled
                  onSelect={() => console.log('cut')}
                >
                  Cut
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
                  Copy
                </ContextMenu.Item>
                <ContextMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
                  Paste
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </ContextMenu.Root>
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
        <ContextMenu.Root onOpenChange={setOpen} dir={rtl ? 'rtl' : 'ltr'}>
          <ContextMenu.Trigger
            className={triggerClass()}
            style={{ background: open ? 'lightblue' : undefined }}
          >
            Right Click Here
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className={contentClass()}>
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('new-tab')}>
                New Tab
              </ContextMenu.Item>
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('new-window')}>
                New Window
              </ContextMenu.Item>
              <ContextMenu.Separator className={separatorClass()} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={subTriggerClass()}>
                  Bookmarks →
                </ContextMenu.SubTrigger>
                <ContextMenu.SubContent className={contentClass()} sideOffset={12} alignOffset={-6}>
                  <ContextMenu.Item className={itemClass()} onSelect={() => console.log('index')}>
                    Inbox
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('calendar')}
                  >
                    Calendar
                  </ContextMenu.Item>
                  <ContextMenu.Separator className={separatorClass()} />
                  <ContextMenu.Sub>
                    <ContextMenu.SubTrigger className={subTriggerClass()}>
                      Modulz →
                    </ContextMenu.SubTrigger>
                    <ContextMenu.SubContent
                      className={contentClass()}
                      sideOffset={12}
                      alignOffset={-6}
                    >
                      <ContextMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('stitches')}
                      >
                        Stitches
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('composer')}
                      >
                        Composer
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('radix')}
                      >
                        Radix
                      </ContextMenu.Item>
                      <ContextMenu.Arrow offset={14} />
                    </ContextMenu.SubContent>
                  </ContextMenu.Sub>
                  <ContextMenu.Separator className={separatorClass()} />
                  <ContextMenu.Item className={itemClass()} onSelect={() => console.log('notion')}>
                    Notion
                  </ContextMenu.Item>
                  <ContextMenu.Arrow offset={14} />
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={subTriggerClass()} disabled>
                  History →
                </ContextMenu.SubTrigger>
                <ContextMenu.SubContent className={contentClass()} sideOffset={12} alignOffset={-6}>
                  <ContextMenu.Item className={itemClass()} onSelect={() => console.log('github')}>
                    Github
                  </ContextMenu.Item>
                  <ContextMenu.Item className={itemClass()} onSelect={() => console.log('google')}>
                    Google
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('stack-overflow')}
                  >
                    Stack Overflow
                  </ContextMenu.Item>
                  <ContextMenu.Arrow offset={14} />
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={subTriggerClass()}>
                  Tools →
                </ContextMenu.SubTrigger>
                <ContextMenu.SubContent className={contentClass()} sideOffset={12} alignOffset={-6}>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('extensions')}
                  >
                    Extensions
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('task-manager')}
                  >
                    Task Manager
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('developer-tools')}
                  >
                    Developer Tools
                  </ContextMenu.Item>
                  <ContextMenu.Arrow offset={14} />
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Separator className={separatorClass()} />
              <ContextMenu.Item
                className={itemClass()}
                disabled
                onSelect={() => console.log('print')}
              >
                Print…
              </ContextMenu.Item>
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('cast')}>
                Cast…
              </ContextMenu.Item>
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('find')}>
                Find…
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
    </div>
  );
};

export const WithLabels = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger className={triggerClass()}>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={contentClass()} alignOffset={-5}>
          {foodGroups.map((foodGroup, index) => (
            <ContextMenu.Group key={index}>
              {foodGroup.label && (
                <ContextMenu.Label className={labelClass()} key={foodGroup.label}>
                  {foodGroup.label}
                </ContextMenu.Label>
              )}
              {foodGroup.foods.map((food) => (
                <ContextMenu.Item
                  key={food.value}
                  className={itemClass()}
                  disabled={food.disabled}
                  onSelect={() => console.log(food.label)}
                >
                  {food.label}
                </ContextMenu.Item>
              ))}
              {index < foodGroups.length - 1 && (
                <ContextMenu.Separator className={separatorClass()} />
              )}
            </ContextMenu.Group>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
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
      <ContextMenu.Root>
        <ContextMenu.Trigger className={triggerClass()}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={contentClass()} alignOffset={-5}>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('show')}>
              Show fonts
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('bigger')}>
              Bigger
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </ContextMenu.Item>
            <ContextMenu.Separator className={separatorClass()} />
            {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
              <ContextMenu.CheckboxItem
                key={label}
                className={itemClass()}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              >
                {label}
                <ContextMenu.ItemIndicator>
                  <TickIcon />
                </ContextMenu.ItemIndicator>
              </ContextMenu.CheckboxItem>
            ))}
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className={triggerClass()}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={contentClass()} alignOffset={-5}>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('minimize')}>
              Minimize window
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('zoom')}>
              Zoom
            </ContextMenu.Item>
            <ContextMenu.Item className={itemClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </ContextMenu.Item>
            <ContextMenu.Separator className={separatorClass()} />
            <ContextMenu.RadioGroup value={file} onValueChange={setFile}>
              {files.map((file) => (
                <ContextMenu.RadioItem key={file} className={itemClass()} value={file}>
                  {file}
                  <ContextMenu.ItemIndicator>
                    <TickIcon />
                  </ContextMenu.ItemIndicator>
                </ContextMenu.RadioItem>
              ))}
            </ContextMenu.RadioGroup>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger className={triggerClass()}>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={contentClass()} alignOffset={-5}>
          <ContextMenu.Item className={itemClass()} onSelect={() => window.alert('action 1')}>
            I will close
          </ContextMenu.Item>
          <ContextMenu.Item
            className={itemClass()}
            onSelect={(event) => {
              event.preventDefault();
              window.alert('action 1');
            }}
          >
            I won't close
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
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
          <ContextMenu.Root key={i}>
            <ContextMenu.Portal>
              <ContextMenu.Content className={animatedContentClass()} alignOffset={-5}>
                <ContextMenu.Label className={labelClass()}>Color</ContextMenu.Label>
                <ContextMenu.RadioGroup
                  value={customColor}
                  onValueChange={(color) =>
                    setCustomColors((colors) => ({ ...colors, [i]: color }))
                  }
                >
                  <ContextMenu.RadioItem className={itemClass()} value="royalblue">
                    Blue
                    <ContextMenu.ItemIndicator>
                      <TickIcon />
                    </ContextMenu.ItemIndicator>
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem className={itemClass()} value="tomato">
                    Red
                    <ContextMenu.ItemIndicator>
                      <TickIcon />
                    </ContextMenu.ItemIndicator>
                  </ContextMenu.RadioItem>
                </ContextMenu.RadioGroup>
                <ContextMenu.Separator className={separatorClass()} />
                <ContextMenu.CheckboxItem
                  className={itemClass()}
                  checked={fadedIndexes.includes(i)}
                  onCheckedChange={(faded) =>
                    setFadedIndexes((indexes) =>
                      faded ? [...indexes, i] : indexes.filter((index) => index !== i)
                    )
                  }
                >
                  Fade
                  <ContextMenu.ItemIndicator>
                    <TickIcon />
                  </ContextMenu.ItemIndicator>
                </ContextMenu.CheckboxItem>
              </ContextMenu.Content>
            </ContextMenu.Portal>
            <ContextMenu.Trigger>
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
            </ContextMenu.Trigger>
          </ContextMenu.Root>
        );
      })}
    </div>
  );
};

export const Nested = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className={triggerClass()}
        style={{ padding: 100, backgroundColor: 'royalblue' }}
      >
        <ContextMenu.Root>
          <ContextMenu.Trigger className={triggerClass()} style={{ backgroundColor: 'tomato' }} />{' '}
          <ContextMenu.Portal>
            <ContextMenu.Content className={contentClass()} alignOffset={-5}>
              <ContextMenu.Label className={labelClass()}>Red box menu</ContextMenu.Label>
              <ContextMenu.Separator className={separatorClass()} />
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('red action1')}>
                Red action 1
              </ContextMenu.Item>
              <ContextMenu.Item className={itemClass()} onSelect={() => console.log('red action2')}>
                Red action 2
              </ContextMenu.Item>
              <ContextMenu.Separator className={separatorClass()} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={subTriggerClass()}>
                  Submenu →
                </ContextMenu.SubTrigger>
                <ContextMenu.SubContent className={contentClass()} sideOffset={12} alignOffset={-6}>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('red sub action 1')}
                  >
                    Red sub action 1
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('red sub action 2')}
                  >
                    Red sub action 2
                  </ContextMenu.Item>
                  <ContextMenu.Arrow offset={14} />
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={contentClass()} alignOffset={-5}>
          <ContextMenu.Label className={labelClass()}>Blue box menu</ContextMenu.Label>
          <ContextMenu.Separator className={separatorClass()} />
          <ContextMenu.Item className={itemClass()} onSelect={() => console.log('blue action1')}>
            Blue action 1
          </ContextMenu.Item>
          <ContextMenu.Item className={itemClass()} onSelect={() => console.log('blue action2')}>
            Blue action 2
          </ContextMenu.Item>
          <ContextMenu.Separator className={separatorClass()} />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className={subTriggerClass()}>Submenu →</ContextMenu.SubTrigger>
            <ContextMenu.SubContent className={contentClass()} sideOffset={12} alignOffset={-6}>
              <ContextMenu.Item
                className={itemClass()}
                onSelect={() => console.log('blue sub action 1')}
              >
                Blue sub action 1
              </ContextMenu.Item>
              <ContextMenu.Item
                className={itemClass()}
                onSelect={() => console.log('blue sub action 2')}
              >
                Blue sub action 2
              </ContextMenu.Item>
              <ContextMenu.Arrow offset={14} />
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
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

const scaleIn = keyframes({
  '0%': { transform: 'scale(0) rotateZ(-10deg)' },
  '20%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

const animatedContentClass = css(contentClass, {
  transformOrigin: 'var(--radix-context-menu-content-transform-origin)',
  '&[data-state="open"]': { animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)` },
});
