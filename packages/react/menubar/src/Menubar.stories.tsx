import * as React from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { css } from '../../../../stitches.config';
import { classes, TickIcon } from '../../menu/src/Menu.stories';
import { foodGroups } from '../../../../test-data/foods';

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
  const [loop, setLoop] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [portalled, setPortalled] = React.useState(false);

  const dir = rtl ? 'rtl' : 'ltr';
  const Portal = portalled ? Menubar.Portal : React.Fragment;

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

        <label>
          <input
            type="checkbox"
            checked={portalled}
            onChange={(event) => setPortalled(event.currentTarget.checked)}
          />
          Portalled
        </label>
      </div>
      <div dir={dir}>
        <Menubar.Root className={rootClass()} loop={loop} dir={dir}>
          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Share <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                    <Menubar.Item className={itemClass()}>Email Link</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Messages</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Airdrop</Menubar.Item>
                  </Menubar.SubContent>
                </Menubar.SubMenu>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
              </Menubar.Content>
            </Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Item className={itemClass()} disabled>
                  Undo
                </Menubar.Item>
                <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
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

                        <Portal>
                          <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                            <Menubar.Item className={itemClass()}>Regex</Menubar.Item>
                            <Menubar.Item className={itemClass()}>Replace</Menubar.Item>
                          </Menubar.SubContent>
                        </Portal>
                      </Menubar.SubMenu>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.SubMenu>

                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()} disabled>
                    Speech <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
                    <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                      <Menubar.Item className={itemClass()}>Start Speaking</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Stop Speaking</Menubar.Item>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.SubMenu>

                <Menubar.SubMenu>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Substitutions <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
                    <Menubar.SubContent className={contentClass()} alignOffset={-6}>
                      <Menubar.Item className={itemClass()}>Smart Quotes</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Smart Dashes</Menubar.Item>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.SubMenu>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
                <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
                <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
              </Menubar.Content>
            </Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={triggerClass()}>History</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={contentClass()} sideOffset={2}>
                <Menubar.Item className={itemClass()}>Radix</Menubar.Item>
                <Menubar.Item className={itemClass()}>Github</Menubar.Item>
                <Menubar.Item className={itemClass()}>WorkOS</Menubar.Item>
              </Menubar.Content>
            </Portal>
          </Menubar.Menu>
        </Menubar.Root>
      </div>
    </div>
  );
};

export const Chromatic = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState<boolean | 'indeterminate'>(false) },
    { label: 'Italic', state: React.useState<boolean | 'indeterminate'>(true) },
    { label: 'Underline', state: React.useState<boolean | 'indeterminate'>(false) },
    {
      label: 'Strikethrough',
      state: React.useState<boolean | 'indeterminate'>(false),
      disabled: true,
    },
  ];
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ padding: 200, paddingTop: 50, paddingBottom: 800 }}>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <Menubar.Root className={rootClass()}>
        <Menubar.Menu>
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />

              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2>Open</h2>
      <Menubar.Root defaultValue="file" className={rootClass()}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              className={contentClass()}
              onFocusOutside={(event) => event.preventDefault()}
              avoidCollisions={false}
              sideOffset={2}
            >
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />

              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h1 style={{ marginTop: 180 }}>Controlled</h1>
      <h2>Closed</h2>
      <Menubar.Root value="" className={rootClass()}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />

              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2>Open</h2>
      <Menubar.Root value="file" className={rootClass()}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />

              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h1 style={{ marginTop: 200 }}>Submenus</h1>
      <Menubar.Root value="edit" className={rootClass()}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
              <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />

              <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.SubMenu open>
                <Menubar.SubTrigger className={subTriggerClass()}>
                  Find <span>→</span>
                </Menubar.SubTrigger>
                <Menubar.Portal>
                  <Menubar.SubContent
                    className={contentClass()}
                    sideOffset={10}
                    alignOffset={-6}
                    avoidCollisions={false}
                  >
                    <Menubar.Item className={itemClass()}>Search the web…</Menubar.Item>
                    <Menubar.Separator className={separatorClass()} />
                    <Menubar.Item className={itemClass()}>Find…</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Find Next</Menubar.Item>
                    <Menubar.Item className={itemClass()}>Find Previous</Menubar.Item>
                    <Menubar.SubMenu open>
                      <Menubar.SubTrigger className={subTriggerClass()}>
                        Advanced <span>→</span>
                      </Menubar.SubTrigger>

                      <Menubar.Portal>
                        <Menubar.SubContent
                          className={contentClass()}
                          sideOffset={10}
                          alignOffset={-6}
                          avoidCollisions={false}
                        >
                          <Menubar.Item className={itemClass()}>Regex</Menubar.Item>
                          <Menubar.Item className={itemClass()}>Replace</Menubar.Item>
                          <Menubar.Arrow />
                        </Menubar.SubContent>
                      </Menubar.Portal>
                    </Menubar.SubMenu>
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
      </Menubar.Root>

      <h2 style={{ marginTop: 250 }}>RTL</h2>
      <div dir="rtl">
        <Menubar.Root value="edit" className={rootClass()} dir="rtl">
          <Menubar.Menu value="file">
            <Menubar.Trigger className={triggerClass()}>File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
                <Menubar.Item className={itemClass()}>New Tab</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Window</Menubar.Item>
                <Menubar.Item className={itemClass()}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />

                <Menubar.Item className={itemClass()}>Print…</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu value="edit">
            <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
                <Menubar.Item className={itemClass()} disabled>
                  Undo
                </Menubar.Item>
                <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
                <Menubar.Separator className={separatorClass()} />
                <Menubar.SubMenu open>
                  <Menubar.SubTrigger className={subTriggerClass()}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent
                      className={contentClass()}
                      sideOffset={10}
                      alignOffset={-6}
                      avoidCollisions={false}
                    >
                      <Menubar.Item className={itemClass()}>Search the web…</Menubar.Item>
                      <Menubar.Separator className={separatorClass()} />
                      <Menubar.Item className={itemClass()}>Find…</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Find Next</Menubar.Item>
                      <Menubar.Item className={itemClass()}>Find Previous</Menubar.Item>
                      <Menubar.SubMenu open>
                        <Menubar.SubTrigger className={subTriggerClass()}>
                          Advanced <span>→</span>
                        </Menubar.SubTrigger>

                        <Menubar.Portal>
                          <Menubar.SubContent
                            className={contentClass()}
                            sideOffset={10}
                            alignOffset={-6}
                            avoidCollisions={false}
                          >
                            <Menubar.Item className={itemClass()}>Regex</Menubar.Item>
                            <Menubar.Item className={itemClass()}>Replace</Menubar.Item>
                            <Menubar.Arrow />
                          </Menubar.SubContent>
                        </Menubar.Portal>
                      </Menubar.SubMenu>
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
        </Menubar.Root>
      </div>

      <h2 style={{ marginTop: 250 }}>With labels</h2>
      <Menubar.Root value="food" className={rootClass()}>
        <Menubar.Menu value="food">
          <Menubar.Trigger className={triggerClass()}>Food</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              {foodGroups.map((foodGroup, index) => (
                <Menubar.Group key={index}>
                  {foodGroup.label && (
                    <Menubar.Label className={labelClass()} key={foodGroup.label}>
                      {foodGroup.label}
                    </Menubar.Label>
                  )}
                  {foodGroup.foods.map((food) => (
                    <Menubar.Item
                      key={food.value}
                      className={itemClass()}
                      disabled={food.disabled}
                      onSelect={() => console.log(food.label)}
                    >
                      {food.label}
                    </Menubar.Item>
                  ))}
                  {index < foodGroups.length - 1 && (
                    <Menubar.Separator className={separatorClass()} />
                  )}
                </Menubar.Group>
              ))}
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2 style={{ marginTop: 600 }}>With checkbox and radio items</h2>
      <Menubar.Root value="items" className={rootClass()}>
        <Menubar.Menu value="items">
          <Menubar.Trigger className={triggerClass()}>Items</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} onSelect={() => console.log('show')}>
                Show fonts
              </Menubar.Item>
              <Menubar.Item className={itemClass()} onSelect={() => console.log('bigger')}>
                Bigger
              </Menubar.Item>
              <Menubar.Item className={itemClass()} onSelect={() => console.log('smaller')}>
                Smaller
              </Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
                <Menubar.CheckboxItem
                  key={label}
                  className={itemClass()}
                  checked={checked}
                  onCheckedChange={setChecked}
                  disabled={disabled}
                >
                  {label}
                  <Menubar.ItemIndicator>
                    <TickIcon />
                  </Menubar.ItemIndicator>
                </Menubar.CheckboxItem>
              ))}
              <Menubar.Separator className={separatorClass()} />
              <Menubar.RadioGroup value={file} onValueChange={setFile}>
                {files.map((file) => (
                  <Menubar.RadioItem key={file} className={itemClass()} value={file}>
                    {file}
                    <Menubar.ItemIndicator>
                      <TickIcon />
                    </Menubar.ItemIndicator>
                  </Menubar.RadioItem>
                ))}
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={triggerClass()}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={contentClass()} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={itemClass()} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={itemClass()}>Redo</Menubar.Item>
              <Menubar.Separator className={separatorClass()} />
              <Menubar.Item className={itemClass()}>Cut</Menubar.Item>
              <Menubar.Item className={itemClass()}>Copy</Menubar.Item>
              <Menubar.Item className={itemClass()}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

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
