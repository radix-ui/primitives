import * as React from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { css } from '../../../../stitches.config';
import { classes, TickIcon } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, separatorClass, labelClass, subTriggerClass } = classes;

export default { title: 'Components/Menubar' };

export const Styled = () => {
  const [loop, setLoop] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const dir = rtl ? 'rtl' : 'ltr';
  const checkOptions = [
    'Always Show Bookmarks Bar',
    'Always Show Toolbar in Fullscreen',
    'Always Show Full URLs',
  ];
  const [checkedSelection, setCheckedSelection] = React.useState<string[]>([checkOptions[1]]);

  const radioOptions = ['Andy', 'Benoît', 'Colm', 'Jenna', 'Pedro'];
  const [radioSelection, setRadioSelection] = React.useState(radioOptions[1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 50,
      }}
    >
      <div style={{ display: 'flex', gap: 25, marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>

        <label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(event) => setLoop(event.currentTarget.checked)}
          />
          Loop
        </label>
      </div>

      <div dir={dir}>
        <Menubar.Root className={rootClass()} loop={loop} dir={dir}>
          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Share <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                      <Menubar.Item className={itemClass()}>Email Link</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Messages</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Airdrop</Menubar.Item>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.SubMenu>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Item className={itemClass()}>Undo</Menubar.Item>
                <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>

                  <Menubar.Portal>
                    <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                      <Menubar.Item className={itemClass()}>Search the web…</Menubar.Item>
                      <Menubar.Separator className={separatorClass()} />
                      <Menubar.Item className={itemClass()}>Find…</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Find Next</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Find Previous</Menubar.Item>
                      <Menubar.SubMenu>
                        <Menubar.SubTrigger className={subTriggerClass()}>
                          Advanced <span>→</span>
                        </Menubar.SubTrigger>

                        <Menubar.Portal>
                          <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                            <Menubar.Item className={itemClass()}>Regex</Menubar.Item>
                            <Menubar.Item className={itemClass()}>Replace</Menubar.Item>
                          </Menubar.SubContent>
                        </Menubar.Portal>
                      </Menubar.SubMenu>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.SubMenu>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
                <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
                <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>View</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                {checkOptions.map((option) => (
                  <Menubar.CheckboxItem
                    key={option}
                    className={itemClass()}
                    checked={checkedSelection.includes(option)}
                    onCheckedChange={() =>
                      setCheckedSelection((current) =>
                        current.includes(option)
                          ? current.filter((el) => el !== option)
                          : current.concat(option)
                      )
                    }
                  >
                    {option}
                    <Menubar.ItemIndicator style={{ marginLeft: 10 }}>
                      <TickIcon />
                    </Menubar.ItemIndicator>
                  </Menubar.CheckboxItem>
                ))}
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Reload</Menubar.Item>
                <Menubar.Item className={itemClass()}>Force Reload</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Toggle Fullscreen</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Hide Sidebar</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>Profiles</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.RadioGroup value={radioSelection} onValueChange={setRadioSelection}>
                  {radioOptions.map((option) => (
                    <Menubar.RadioItem key={option} className={itemClass()} value={option}>
                      {option}
                      <Menubar.ItemIndicator style={{ marginLeft: 10 }}>
                        <TickIcon />
                      </Menubar.ItemIndicator>
                    </Menubar.RadioItem>
                  ))}
                </Menubar.RadioGroup>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>History</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Label className={labelClass()}>Work</Menubar.Label>
                <Menubar.Item className={itemClass()}>Radix</Menubar.Item>
                <Menubar.Item className={itemClass()}>Github</Menubar.Item>
                <Menubar.Item className={itemClass()}>WorkOS</Menubar.Item>
                <Menubar.Label className={labelClass()}>Community</Menubar.Label>
                <Menubar.Item className={itemClass()}>Twitter</Menubar.Item>
                <Menubar.Item className={itemClass()}>Discord</Menubar.Item>
                <Menubar.Item className={itemClass()}>Slack</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>
      </div>
    </div>
  );
};

export const Cypress = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}
    >
      <Menubar.Root className={rootClass()}>
        <Menubar.Menu>
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} sideOffset={2}>
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.SubMenu>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  Share <span>→</span>
                </Menubar.SubTrigger>
                <Menubar.SubContent className={contentClass()} sideOffset={10} alignOffset={-6}>
                  <Menubar.Item className={itemClass()}>Email Link</Menubar.Item>
                  <Menubar.Item className={itemClass()}>Messages</Menubar.Item>
                  <Menubar.Item className={itemClass()}>Airdrop</Menubar.Item>
                  <Menubar.Arrow />
                </Menubar.SubContent>
              </Menubar.SubMenu>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} sideOffset={2}>
              <Menubar.Item className={itemClass()}>Undo</Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.SubMenu>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  Find <span>→</span>
                </Menubar.SubTrigger>
                <Menubar.Portal>
                  <Menubar.SubContent className={contentClass()} sideOffset={10} alignOffset={-6}>
                    <Menubar.Item className={itemClass()}>Search the web…</Menubar.Item>
                    <Menubar.Separator className={separatorClass()} />
                    <Menubar.Item className={itemClass()}>Find…</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Find Next</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Find Previous</Menubar.Item>
                    <Menubar.Arrow />
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.SubMenu>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={triggerClass()}>History</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} sideOffset={2}>
              <Menubar.Item className={itemClass()}>Radix</Menubar.Item>
              <Menubar.Item className={itemClass()}>Github</Menubar.Item>
              <Menubar.Item className={itemClass()}>WorkOS</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  );
};

const rootClass = css({
  border: '1px solid $gray100',
  borderRadius: 6,
  padding: 2,
});

const triggerClass = css({
  padding: '6px 16px',
  border: 0,
  backgroundColor: 'transparent',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
  borderRadius: 4,
  outline: 'none',
  '&[data-highlighted]': {
    backgroundColor: '$gray100',
  },
  '&[data-state="open"]': { backgroundColor: '$black', color: 'white' },
});
