import * as React from 'react';
import { Menubar } from 'radix-ui';
import { foodGroups } from '@repo/test-data/foods';
import styles from './menubar.stories.module.css';

const subTriggerClass = [styles.item, styles.subTrigger].join(' ');

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
  const [checkedSelection, setCheckedSelection] = React.useState([checkOptions[1]!]);

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
        <Menubar.Root className={styles.root} loop={loop} dir={dir}>
          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
                <Menubar.Item className={styles.item}>New Window</Menubar.Item>
                <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Share <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent className={styles.content} alignOffset={-6}>
                      <Menubar.Item className={styles.item}>Email Link</Menubar.Item>
                      <Menubar.Item className={styles.item}>Messages</Menubar.Item>
                      <Menubar.Item className={styles.item}>Airdrop</Menubar.Item>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.Sub>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Print…</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Item className={styles.item}>Undo</Menubar.Item>
                <Menubar.Item className={styles.item}>Redo</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>

                  <Menubar.Portal>
                    <Menubar.SubContent className={styles.content} alignOffset={-6}>
                      <Menubar.Item className={styles.item}>Search the web…</Menubar.Item>
                      <Menubar.Separator className={styles.separator} />
                      <Menubar.Item className={styles.item}>Find…</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Next</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Previous</Menubar.Item>
                      <Menubar.Sub>
                        <Menubar.SubTrigger className={subTriggerClass}>
                          Advanced <span>→</span>
                        </Menubar.SubTrigger>

                        <Menubar.Portal>
                          <Menubar.SubContent className={styles.content} alignOffset={-6}>
                            <Menubar.Item className={styles.item}>Regex</Menubar.Item>
                            <Menubar.Item className={styles.item}>Replace</Menubar.Item>
                          </Menubar.SubContent>
                        </Menubar.Portal>
                      </Menubar.Sub>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.Sub>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Cut</Menubar.Item>
                <Menubar.Item className={styles.item}>Copy</Menubar.Item>
                <Menubar.Item className={styles.item}>Paste</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>View</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                {checkOptions.map((option) => (
                  <Menubar.CheckboxItem
                    key={option}
                    className={styles.item}
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
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Reload</Menubar.Item>
                <Menubar.Item className={styles.item}>Force Reload</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Toggle Fullscreen</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Hide Sidebar</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>Profiles</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.RadioGroup value={radioSelection} onValueChange={setRadioSelection}>
                  {radioOptions.map((option) => (
                    <Menubar.RadioItem key={option} className={styles.item} value={option}>
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
            <Menubar.Trigger className={styles.trigger}>History</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Label className={styles.label}>Work</Menubar.Label>
                <Menubar.Item className={styles.item}>Radix</Menubar.Item>
                <Menubar.Item className={styles.item}>Github</Menubar.Item>
                <Menubar.Item className={styles.item}>WorkOS</Menubar.Item>
                <Menubar.Label className={styles.label}>Community</Menubar.Label>
                <Menubar.Item className={styles.item}>Twitter</Menubar.Item>
                <Menubar.Item className={styles.item}>Discord</Menubar.Item>
                <Menubar.Item className={styles.item}>Slack</Menubar.Item>
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
        <Menubar.Root className={styles.root} loop={loop} dir={dir}>
          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
                <Menubar.Item className={styles.item}>New Window</Menubar.Item>
                <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Share <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.SubContent className={styles.content} alignOffset={-6}>
                    <Menubar.Item className={styles.item}>Email Link</Menubar.Item>
                    <Menubar.Item className={styles.item}>Messages</Menubar.Item>
                    <Menubar.Item className={styles.item}>Airdrop</Menubar.Item>
                  </Menubar.SubContent>
                </Menubar.Sub>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Print…</Menubar.Item>
              </Menubar.Content>
            </Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Item className={styles.item} disabled>
                  Undo
                </Menubar.Item>
                <Menubar.Item className={styles.item}>Redo</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
                    <Menubar.SubContent className={styles.content} alignOffset={-6}>
                      <Menubar.Item className={styles.item}>Search the web…</Menubar.Item>
                      <Menubar.Separator className={styles.separator} />
                      <Menubar.Item className={styles.item}>Find…</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Next</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Previous</Menubar.Item>
                      <Menubar.Sub>
                        <Menubar.SubTrigger className={subTriggerClass}>
                          Advanced <span>→</span>
                        </Menubar.SubTrigger>

                        <Portal>
                          <Menubar.SubContent className={styles.content} alignOffset={-6}>
                            <Menubar.Item className={styles.item}>Regex</Menubar.Item>
                            <Menubar.Item className={styles.item}>Replace</Menubar.Item>
                          </Menubar.SubContent>
                        </Portal>
                      </Menubar.Sub>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.Sub>

                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass} disabled>
                    Speech <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
                    <Menubar.SubContent className={styles.content} alignOffset={-6}>
                      <Menubar.Item className={styles.item}>Start Speaking</Menubar.Item>
                      <Menubar.Item className={styles.item}>Stop Speaking</Menubar.Item>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.Sub>

                <Menubar.Sub>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Substitutions <span>→</span>
                  </Menubar.SubTrigger>
                  <Portal>
                    <Menubar.SubContent className={styles.content} alignOffset={-6}>
                      <Menubar.Item className={styles.item}>Smart Quotes</Menubar.Item>
                      <Menubar.Item className={styles.item}>Smart Dashes</Menubar.Item>
                    </Menubar.SubContent>
                  </Portal>
                </Menubar.Sub>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Cut</Menubar.Item>
                <Menubar.Item className={styles.item}>Copy</Menubar.Item>
                <Menubar.Item className={styles.item}>Paste</Menubar.Item>
              </Menubar.Content>
            </Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className={styles.trigger}>History</Menubar.Trigger>
            <Portal>
              <Menubar.Content className={styles.content} sideOffset={2}>
                <Menubar.Item className={styles.item}>Radix</Menubar.Item>
                <Menubar.Item className={styles.item}>Github</Menubar.Item>
                <Menubar.Item className={styles.item}>WorkOS</Menubar.Item>
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
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ padding: 200, paddingTop: 50, paddingBottom: 800 }}>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <Menubar.Root className={styles.root}>
        <Menubar.Menu>
          <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
              <Menubar.Item className={styles.item}>New Window</Menubar.Item>
              <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={styles.separator} />

              <Menubar.Item className={styles.item}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2>Open</h2>
      <Menubar.Root defaultValue="file" className={styles.root}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              className={styles.content}
              onFocusOutside={(event) => event.preventDefault()}
              avoidCollisions={false}
              sideOffset={2}
            >
              <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
              <Menubar.Item className={styles.item}>New Window</Menubar.Item>
              <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={styles.separator} />

              <Menubar.Item className={styles.item}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h1 style={{ marginTop: 180 }}>Controlled</h1>
      <h2>Closed</h2>
      <Menubar.Root value="" className={styles.root}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
              <Menubar.Item className={styles.item}>New Window</Menubar.Item>
              <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={styles.separator} />

              <Menubar.Item className={styles.item}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2>Open</h2>
      <Menubar.Root value="file" className={styles.root}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
              <Menubar.Item className={styles.item}>New Window</Menubar.Item>
              <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={styles.separator} />

              <Menubar.Item className={styles.item}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h1 style={{ marginTop: 200 }}>Submenus</h1>
      <Menubar.Root value="edit" className={styles.root}>
        <Menubar.Menu value="file">
          <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
              <Menubar.Item className={styles.item}>New Window</Menubar.Item>
              <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
              <Menubar.Separator className={styles.separator} />

              <Menubar.Item className={styles.item}>Print…</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Sub open>
                <Menubar.SubTrigger className={subTriggerClass}>
                  Find <span>→</span>
                </Menubar.SubTrigger>
                <Menubar.Portal>
                  <Menubar.SubContent
                    className={styles.content}
                    sideOffset={10}
                    alignOffset={-6}
                    avoidCollisions={false}
                  >
                    <Menubar.Item className={styles.item}>Search the web…</Menubar.Item>
                    <Menubar.Separator className={styles.separator} />
                    <Menubar.Item className={styles.item}>Find…</Menubar.Item>
                    <Menubar.Item className={styles.item}>Find Next</Menubar.Item>
                    <Menubar.Item className={styles.item}>Find Previous</Menubar.Item>
                    <Menubar.Sub open>
                      <Menubar.SubTrigger className={subTriggerClass}>
                        Advanced <span>→</span>
                      </Menubar.SubTrigger>

                      <Menubar.Portal>
                        <Menubar.SubContent
                          className={styles.content}
                          sideOffset={10}
                          alignOffset={-6}
                          avoidCollisions={false}
                        >
                          <Menubar.Item className={styles.item}>Regex</Menubar.Item>
                          <Menubar.Item className={styles.item}>Replace</Menubar.Item>
                          <Menubar.Arrow />
                        </Menubar.SubContent>
                      </Menubar.Portal>
                    </Menubar.Sub>
                    <Menubar.Arrow />
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.Sub>

              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2 style={{ marginTop: 250 }}>RTL</h2>
      <div dir="rtl">
        <Menubar.Root value="edit" className={styles.root} dir="rtl">
          <Menubar.Menu value="file">
            <Menubar.Trigger className={styles.trigger}>File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
                <Menubar.Item className={styles.item}>New Tab</Menubar.Item>
                <Menubar.Item className={styles.item}>New Window</Menubar.Item>
                <Menubar.Item className={styles.item}>New Incognito Window</Menubar.Item>
                <Menubar.Separator className={styles.separator} />

                <Menubar.Item className={styles.item}>Print…</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu value="edit">
            <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
                <Menubar.Item className={styles.item} disabled>
                  Undo
                </Menubar.Item>
                <Menubar.Item className={styles.item}>Redo</Menubar.Item>
                <Menubar.Separator className={styles.separator} />
                <Menubar.Sub open>
                  <Menubar.SubTrigger className={subTriggerClass}>
                    Find <span>→</span>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent
                      className={styles.content}
                      sideOffset={10}
                      alignOffset={-6}
                      avoidCollisions={false}
                    >
                      <Menubar.Item className={styles.item}>Search the web…</Menubar.Item>
                      <Menubar.Separator className={styles.separator} />
                      <Menubar.Item className={styles.item}>Find…</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Next</Menubar.Item>
                      <Menubar.Item className={styles.item}>Find Previous</Menubar.Item>
                      <Menubar.Sub open>
                        <Menubar.SubTrigger className={subTriggerClass}>
                          Advanced <span>→</span>
                        </Menubar.SubTrigger>

                        <Menubar.Portal>
                          <Menubar.SubContent
                            className={styles.content}
                            sideOffset={10}
                            alignOffset={-6}
                            avoidCollisions={false}
                          >
                            <Menubar.Item className={styles.item}>Regex</Menubar.Item>
                            <Menubar.Item className={styles.item}>Replace</Menubar.Item>
                            <Menubar.Arrow />
                          </Menubar.SubContent>
                        </Menubar.Portal>
                      </Menubar.Sub>
                      <Menubar.Arrow />
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.Sub>

                <Menubar.Separator className={styles.separator} />
                <Menubar.Item className={styles.item}>Cut</Menubar.Item>
                <Menubar.Item className={styles.item}>Copy</Menubar.Item>
                <Menubar.Item className={styles.item}>Paste</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>
      </div>

      <h2 style={{ marginTop: 250 }}>With labels</h2>
      <Menubar.Root value="food" className={styles.root}>
        <Menubar.Menu value="food">
          <Menubar.Trigger className={styles.trigger}>Food</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              {foodGroups.map((foodGroup, index) => (
                <Menubar.Group key={index}>
                  {foodGroup.label && (
                    <Menubar.Label className={styles.label} key={foodGroup.label}>
                      {foodGroup.label}
                    </Menubar.Label>
                  )}
                  {foodGroup.foods.map((food) => (
                    <Menubar.Item
                      key={food.value}
                      className={styles.item}
                      disabled={food.disabled}
                      onSelect={() => console.log(food.label)}
                    >
                      {food.label}
                    </Menubar.Item>
                  ))}
                  {index < foodGroups.length - 1 && (
                    <Menubar.Separator className={styles.separator} />
                  )}
                </Menubar.Group>
              ))}
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu value="edit">
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>

      <h2 style={{ marginTop: 600 }}>With checkbox and radio items</h2>
      <Menubar.Root value="items" className={styles.root}>
        <Menubar.Menu value="items">
          <Menubar.Trigger className={styles.trigger}>Items</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} onSelect={() => console.log('show')}>
                Show fonts
              </Menubar.Item>
              <Menubar.Item className={styles.item} onSelect={() => console.log('bigger')}>
                Bigger
              </Menubar.Item>
              <Menubar.Item className={styles.item} onSelect={() => console.log('smaller')}>
                Smaller
              </Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
                <Menubar.CheckboxItem
                  key={label}
                  className={styles.item}
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
              <Menubar.Separator className={styles.separator} />
              <Menubar.RadioGroup value={file} onValueChange={setFile}>
                {files.map((file) => (
                  <Menubar.RadioItem key={file} className={styles.item} value={file}>
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
          <Menubar.Trigger className={styles.trigger}>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className={styles.content} avoidCollisions={false} sideOffset={2}>
              <Menubar.Item className={styles.item} disabled>
                Undo
              </Menubar.Item>
              <Menubar.Item className={styles.item}>Redo</Menubar.Item>
              <Menubar.Separator className={styles.separator} />
              <Menubar.Item className={styles.item}>Cut</Menubar.Item>
              <Menubar.Item className={styles.item}>Copy</Menubar.Item>
              <Menubar.Item className={styles.item}>Paste</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M2 20 L12 28 30 4" />
  </svg>
);
