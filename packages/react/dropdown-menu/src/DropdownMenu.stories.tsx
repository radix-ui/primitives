import * as React from 'react';
import { css } from '../../../../stitches.config';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Dialog from '@radix-ui/react-dialog';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { foodGroups } from '../../../../test-data/foods';
import { classes, TickIcon } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, labelClass, separatorClass, subTriggerClass } = classes;

export default { title: 'Components/DropdownMenu' };

export const Styled = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentClass()} sideOffset={5}>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenu.Item>
          <DropdownMenu.Separator className={separatorClass()} />
          <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
);

export const Modality = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110vh' }}
    >
      <div style={{ display: 'grid', gap: 50 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Modal (default)</h1>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={contentClass()} sideOffset={5}>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                  Undo
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                  Redo
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className={subTriggerClass()}>
                    Submenu →
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent
                    className={contentClass()}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                      One
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                      Two
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={itemClass()}
                      onSelect={() => console.log('three')}
                    >
                      Three
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow offset={14} />
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Item
                  className={itemClass()}
                  disabled
                  onSelect={() => console.log('cut')}
                >
                  Cut
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
                  Copy
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
                  Paste
                </DropdownMenu.Item>
                <DropdownMenu.Arrow />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Non modal</h1>
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={contentClass()} sideOffset={5}>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                  Undo
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                  Redo
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className={subTriggerClass()}>
                    Submenu →
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent
                    className={contentClass()}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                      One
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                      Two
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={itemClass()}
                      onSelect={() => console.log('three')}
                    >
                      Three
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow offset={14} />
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Item
                  className={itemClass()}
                  disabled
                  onSelect={() => console.log('cut')}
                >
                  Cut
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
                  Copy
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
                  Paste
                </DropdownMenu.Item>
                <DropdownMenu.Arrow />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
        <DropdownMenu.Root dir={rtl ? 'rtl' : 'ltr'}>
          <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={contentClass()} sideOffset={5}>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('new-tab')}>
                New Tab
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('new-window')}>
                New Window
              </DropdownMenu.Item>
              <DropdownMenu.Separator className={separatorClass()} />
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className={subTriggerClass()}>
                  Bookmarks →
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent
                  className={contentClass()}
                  sideOffset={12}
                  alignOffset={-6}
                >
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('index')}>
                    Inbox
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('calendar')}
                  >
                    Calendar
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className={separatorClass()} />
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger className={subTriggerClass()}>
                      Modulz →
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent
                      className={contentClass()}
                      sideOffset={12}
                      alignOffset={-6}
                    >
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('stitches')}
                      >
                        Stitches
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('composer')}
                      >
                        Composer
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('radix')}
                      >
                        Radix
                      </DropdownMenu.Item>
                      <DropdownMenu.Arrow offset={14} />
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Separator className={separatorClass()} />
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('notion')}>
                    Notion
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow offset={14} />
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className={subTriggerClass()} disabled>
                  History →
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent
                  className={contentClass()}
                  sideOffset={12}
                  alignOffset={-6}
                >
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('github')}>
                    Github
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('google')}>
                    Google
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('stack-overflow')}
                  >
                    Stack Overflow
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow offset={14} />
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className={subTriggerClass()}>
                  Tools →
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent
                  className={contentClass()}
                  sideOffset={12}
                  alignOffset={-6}
                >
                  <DropdownMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('extensions')}
                  >
                    Extensions
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('task-manager')}
                  >
                    Task Manager
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={itemClass()}
                    onSelect={() => console.log('developer-tools')}
                  >
                    Developer Tools
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow offset={14} />
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator className={separatorClass()} />
              <DropdownMenu.Item
                className={itemClass()}
                disabled
                onSelect={() => console.log('print')}
              >
                Print…
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('cast')}>
                Cast…
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('find')}>
                Find…
              </DropdownMenu.Item>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export const WithLabels = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentClass()} sideOffset={5}>
          {foodGroups.map((foodGroup, index) => (
            <DropdownMenu.Group key={index}>
              {foodGroup.label && (
                <DropdownMenu.Label className={labelClass()} key={foodGroup.label}>
                  {foodGroup.label}
                </DropdownMenu.Label>
              )}
              {foodGroup.foods.map((food) => (
                <DropdownMenu.Item
                  key={food.value}
                  className={itemClass()}
                  disabled={food.disabled}
                  onSelect={() => console.log(food.label)}
                >
                  {food.label}
                </DropdownMenu.Item>
              ))}
              {index < foodGroups.length - 1 && (
                <DropdownMenu.Separator className={separatorClass()} />
              )}
            </DropdownMenu.Group>
          ))}
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
);

export const NestedComposition = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5}>
            <Dialog.Root>
              <Dialog.Trigger className={itemClass()} asChild>
                <DropdownMenu.Item onSelect={(event) => event.preventDefault()}>
                  Open dialog
                </DropdownMenu.Item>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Content className={dialogClass()} style={{ zIndex: 2147483647 }}>
                  <Dialog.Title>Nested dropdown</Dialog.Title>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      className={triggerClass()}
                      style={{ width: '100%', marginBottom: 20 }}
                    >
                      Open
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className={contentClass()} sideOffset={5}>
                        <DropdownMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('undo')}
                        >
                          Undo
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className={itemClass()}
                          onSelect={() => console.log('redo')}
                        >
                          Redo
                        </DropdownMenu.Item>
                        <DropdownMenu.Arrow />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                  <Dialog.Close>Close</Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <DropdownMenu.Item className={itemClass()}>Test</DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export const SingleItemAsDialogTrigger = () => {
  const dropdownTriggerRef = React.useRef<React.ElementRef<typeof DropdownMenu.Trigger>>(null);
  const dropdownTriggerRef2 = React.useRef<React.ElementRef<typeof DropdownMenu.Trigger>>(null);
  const isDialogOpenRef = React.useRef(false);

  function handleModalDialogClose(event: Event) {
    // focus dropdown trigger for accessibility so user doesn't lose their place in the document
    dropdownTriggerRef.current?.focus();
    event.preventDefault();
  }

  function handleNonModalDialogClose(event: Event) {
    // focus dropdown trigger for accessibility so user doesn't lose their place in the document
    dropdownTriggerRef2.current?.focus();
    event.preventDefault();
    isDialogOpenRef.current = false;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h1>Modal</h1>
      <Dialog.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={triggerClass()} ref={dropdownTriggerRef}>
            Open
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className={contentClass()} sideOffset={5}>
              <Dialog.Trigger className={itemClass()} asChild>
                <DropdownMenu.Item>Delete</DropdownMenu.Item>
              </Dialog.Trigger>
              <DropdownMenu.Item className={itemClass()}>Test</DropdownMenu.Item>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Content className={dialogClass()} onCloseAutoFocus={handleModalDialogClose}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>

      <h1>Non-modal</h1>
      <Dialog.Root modal={false}>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={triggerClass()} ref={dropdownTriggerRef2}>
            Open
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={contentClass()}
              sideOffset={5}
              onCloseAutoFocus={(event) => {
                // prevent focusing dropdown trigger when it closes from a dialog trigger
                if (isDialogOpenRef.current) event.preventDefault();
              }}
            >
              <Dialog.Trigger className={itemClass()} asChild>
                <DropdownMenu.Item onSelect={() => (isDialogOpenRef.current = true)}>
                  Delete
                </DropdownMenu.Item>
              </Dialog.Trigger>
              <DropdownMenu.Item className={itemClass()}>Test</DropdownMenu.Item>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Content className={dialogClass()} onCloseAutoFocus={handleNonModalDialogClose}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>`
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export const MultipleItemsAsDialogTriggers = () => {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [switchAccountsOpen, setSwitchAccountsOpen] = React.useState(false);
  const [deleteOpen2, setDeleteOpen2] = React.useState(false);
  const [switchAccountsOpen2, setSwitchAccountsOpen2] = React.useState(false);
  const dropdownTriggerRef = React.useRef<React.ElementRef<typeof DropdownMenu.Trigger>>(null);
  const dropdownTriggerRef2 = React.useRef<React.ElementRef<typeof DropdownMenu.Trigger>>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h1>Modal</h1>
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen(false);
            setSwitchAccountsOpen(false);
          }
        }}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={triggerClass()} ref={dropdownTriggerRef}>
            Open
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className={contentClass()} sideOffset={5}>
              <Dialog.Trigger asChild className={itemClass()}>
                <DropdownMenu.Item onSelect={() => setSwitchAccountsOpen(true)}>
                  Switch Accounts
                </DropdownMenu.Item>
              </Dialog.Trigger>
              <Dialog.Trigger asChild className={itemClass()}>
                <DropdownMenu.Item onSelect={() => setDeleteOpen(true)}>Delete</DropdownMenu.Item>
              </Dialog.Trigger>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Content
          className={dialogClass()}
          onCloseAutoFocus={(event) => {
            // focus dropdown trigger for accessibility so user doesn't lose their place in the document
            dropdownTriggerRef.current?.focus();
            event.preventDefault();
          }}
        >
          {switchAccountsOpen && <Dialog.Title>Switch accounts</Dialog.Title>}
          {deleteOpen && <Dialog.Title>Are you sure?</Dialog.Title>}
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>

      <h1>Non-modal</h1>
      <Dialog.Root
        modal={false}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen2(false);
            setSwitchAccountsOpen2(false);
          }
        }}
      >
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={triggerClass()} ref={dropdownTriggerRef2}>
            Open
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={contentClass()}
              sideOffset={5}
              onCloseAutoFocus={(event) => {
                // prevent focusing dropdown trigger when it closes from a dialog trigger
                if (deleteOpen2 || switchAccountsOpen2) event.preventDefault();
              }}
            >
              <Dialog.Trigger asChild className={itemClass()}>
                <DropdownMenu.Item onSelect={() => setSwitchAccountsOpen2(true)}>
                  Switch Accounts
                </DropdownMenu.Item>
              </Dialog.Trigger>
              <Dialog.Trigger asChild className={itemClass()}>
                <DropdownMenu.Item onSelect={() => setDeleteOpen2(true)}>Delete</DropdownMenu.Item>
              </Dialog.Trigger>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Content
          className={dialogClass()}
          onCloseAutoFocus={(event) => {
            // focus dropdown trigger for accessibility so user doesn't lose their place in the document
            dropdownTriggerRef2.current?.focus();
            event.preventDefault();
          }}
        >
          {switchAccountsOpen2 && <Dialog.Title>Switch accounts</Dialog.Title>}
          {deleteOpen2 && <Dialog.Title>Are you sure?</Dialog.Title>}
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export const CheckboxItems = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('show')}>
              Show fonts
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('bigger')}>
              Bigger
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
              <DropdownMenu.CheckboxItem
                key={label}
                className={itemClass()}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              >
                {label}
                <DropdownMenu.ItemIndicator>
                  <TickIcon />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.CheckboxItem>
            ))}
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('minimize')}>
              Minimize window
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('zoom')}>
              Zoom
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.RadioGroup value={file} onValueChange={setFile}>
              {files.map((file) => (
                <DropdownMenu.RadioItem key={file} className={itemClass()} value={file}>
                  {file}
                  <DropdownMenu.ItemIndicator>
                    <TickIcon />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentClass()} sideOffset={5}>
          <DropdownMenu.Item className={itemClass()} onSelect={() => window.alert('action 1')}>
            I will close
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass()}
            onSelect={(event) => {
              event.preventDefault();
              window.alert('action 1');
            }}
          >
            I won't close
          </DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
);

export const WithTooltip = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}>
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentClass()} sideOffset={5}>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenu.Item>
          <DropdownMenu.Separator className={separatorClass()} />
          <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
);

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

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
    <div style={{ padding: 200, paddingBottom: 800 }}>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h2>Open</h2>
      <DropdownMenu.Root defaultOpen modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={contentClass()}
            sideOffset={5}
            avoidCollisions={false}
            onFocusOutside={(event) => event.preventDefault()}
          >
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
      <DropdownMenu.Root defaultOpen modal={false}>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={contentClass()}
            sideOffset={5}
            avoidCollisions={false}
            onFocusOutside={(event) => event.preventDefault()}
          >
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      </DropdownMenu.Root>

      <h1 style={{ marginTop: 200 }}>Controlled</h1>
      <h2>Closed</h2>
      <DropdownMenu.Root open={false} modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h2>Open</h2>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      </DropdownMenu.Root>

      <h1 style={{ marginTop: 200 }}>Submenus</h1>
      <h2>Open</h2>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Sub open>
              <DropdownMenu.SubTrigger className={subTriggerClass()}>
                Submenu →
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent
                className={contentClass()}
                sideOffset={12}
                alignOffset={-6}
                avoidCollisions={false}
              >
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                  One
                </DropdownMenu.Item>

                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                  Two
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Sub open>
                  <DropdownMenu.SubTrigger className={subTriggerClass()}>
                    Submenu →
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent
                    className={contentClass()}
                    sideOffset={12}
                    alignOffset={-6}
                    avoidCollisions={false}
                  >
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                      One
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                      Two
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={itemClass()}
                      onSelect={() => console.log('three')}
                    >
                      Three
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow offset={14} />
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator className={separatorClass()} />
                <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('three')}>
                  Three
                </DropdownMenu.Item>
                <DropdownMenu.Arrow offset={14} />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.Item className={itemClass()} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenu.Item>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
      </DropdownMenu.Root>

      <h2 style={{ marginTop: 275 }}>RTL</h2>
      <div dir="rtl">
        <DropdownMenu.Root open dir="rtl" modal={false}>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                Undo
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                Redo
              </DropdownMenu.Item>
              <DropdownMenu.Separator className={separatorClass()} />
              <DropdownMenu.Sub open>
                <DropdownMenu.SubTrigger className={subTriggerClass()}>
                  Submenu →
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent
                  className={contentClass()}
                  sideOffset={12}
                  alignOffset={-6}
                  avoidCollisions={false}
                >
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('one')}>
                    One
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('two')}>
                    Two
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className={separatorClass()} />
                  <DropdownMenu.Sub open>
                    <DropdownMenu.SubTrigger className={subTriggerClass()}>
                      Submenu →
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent
                      className={contentClass()}
                      sideOffset={12}
                      alignOffset={-6}
                      avoidCollisions={false}
                    >
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('one')}
                      >
                        One
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('two')}
                      >
                        Two
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={itemClass()}
                        onSelect={() => console.log('three')}
                      >
                        Three
                      </DropdownMenu.Item>
                      <DropdownMenu.Arrow offset={14} />
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Separator className={separatorClass()} />
                  <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('three')}>
                    Three
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow offset={14} />
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator className={separatorClass()} />
              <DropdownMenu.Item
                className={itemClass()}
                disabled
                onSelect={() => console.log('cut')}
              >
                Cut
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('copy')}>
                Copy
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('paste')}>
                Paste
              </DropdownMenu.Item>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
          <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        </DropdownMenu.Root>
      </div>

      <h1 style={{ marginTop: 275 }}>Positioning</h1>
      <h2>No collisions</h2>
      <h3>Side & Align</h3>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  align={align}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>

      <h3>Arrow offset</h3>
      <h4>Positive</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  align={align}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow
                    className={chromaticArrowClass()}
                    width={20}
                    height={10}
                    offset={5}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  align={align}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow
                    className={chromaticArrowClass()}
                    width={20}
                    height={10}
                    offset={-10}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>

      <h3>Side offset</h3>
      <h4>Positive</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  sideOffset={5}
                  align={align}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  sideOffset={-10}
                  align={align}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>

      <h3>Align offset</h3>
      <h4>Positive</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  align={align}
                  alignOffset={20}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass()}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
              <DropdownMenu.Trigger className={chromaticTriggerClass()} />
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={chromaticContentClass()}
                  side={side}
                  align={align}
                  alignOffset={-10}
                  avoidCollisions={false}
                >
                  <p style={{ textAlign: 'center' }}>
                    {side}
                    <br />
                    {align}
                  </p>
                  <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))
        )}
      </div>

      <h2>Collisions</h2>
      <p>See instances on the periphery of the page.</p>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <DropdownMenu.Root key={`${side}-${align}`} open modal={false}>
            <DropdownMenu.Trigger
              className={chromaticTriggerClass()}
              style={{
                position: 'absolute',
                [side]: 10,
                ...((side === 'right' || side === 'left') &&
                  (align === 'start'
                    ? { bottom: 10 }
                    : align === 'center'
                    ? { top: 'calc(50% - 15px)' }
                    : { top: 10 })),
                ...((side === 'top' || side === 'bottom') &&
                  (align === 'start'
                    ? { right: 10 }
                    : align === 'center'
                    ? { left: 'calc(50% - 15px)' }
                    : { left: 10 })),
              }}
            />
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={chromaticContentClass()} side={side} align={align}>
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenu.Arrow className={chromaticArrowClass()} width={20} height={10} />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ))
      )}

      <h1>With labels</h1>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            {foodGroups.map((foodGroup, index) => (
              <DropdownMenu.Group key={index}>
                {foodGroup.label && (
                  <DropdownMenu.Label className={labelClass()} key={foodGroup.label}>
                    {foodGroup.label}
                  </DropdownMenu.Label>
                )}
                {foodGroup.foods.map((food) => (
                  <DropdownMenu.Item
                    key={food.value}
                    className={itemClass()}
                    disabled={food.disabled}
                    onSelect={() => console.log(food.label)}
                  >
                    {food.label}
                  </DropdownMenu.Item>
                ))}
                {index < foodGroups.length - 1 && (
                  <DropdownMenu.Separator className={separatorClass()} />
                )}
              </DropdownMenu.Group>
            ))}
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h1 style={{ marginTop: 600 }}>With checkbox and radio items</h1>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('show')}>
              Show fonts
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('bigger')}>
              Bigger
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorClass()} />
            {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
              <DropdownMenu.CheckboxItem
                key={label}
                className={itemClass()}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              >
                {label}
                <DropdownMenu.ItemIndicator>
                  <TickIcon />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.CheckboxItem>
            ))}
            <DropdownMenu.Separator className={separatorClass()} />
            <DropdownMenu.RadioGroup value={file} onValueChange={setFile}>
              {files.map((file) => (
                <DropdownMenu.RadioItem key={file} className={itemClass()} value={file}>
                  {file}
                  <DropdownMenu.ItemIndicator>
                    <TickIcon />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h1 style={{ marginTop: 500 }}>Nested composition</h1>

      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger className={triggerClass()}>Open</DropdownMenu.Trigger>

        <DropdownMenu.Content className={contentClass()} sideOffset={5} avoidCollisions={false}>
          <Dialog.Root open modal={false}>
            <Dialog.Trigger className={itemClass()} asChild>
              <DropdownMenu.Item onSelect={(event) => event.preventDefault()}>
                Open dialog
              </DropdownMenu.Item>
            </Dialog.Trigger>

            <Dialog.Content
              style={{
                position: 'absolute',
                top: 0,
                left: 150,
                width: 300,
                padding: 20,
                backgroundColor: 'whitesmoke',
                border: '1px solid black',
              }}
            >
              <Dialog.Title style={{ marginTop: 0 }}>Dropdown in nested dialog</Dialog.Title>
              <DropdownMenu.Root open modal={false}>
                <DropdownMenu.Trigger className={triggerClass()} style={{ width: '100%' }}>
                  Open
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={contentClass()}
                    sideOffset={5}
                    avoidCollisions={false}
                  >
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('undo')}>
                      Undo
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className={itemClass()} onSelect={() => console.log('redo')}>
                      Redo
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Dialog.Content>
          </Dialog.Root>
          <DropdownMenu.Item className={itemClass()}>Test</DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <h1 style={{ marginTop: 500 }}>State attributes</h1>
      <h2>Closed</h2>
      <DropdownMenu.Root open={false} modal={false}>
        <DropdownMenu.Trigger className={triggerAttrClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={contentAttrClass()}
            sideOffset={5}
            avoidCollisions={false}
          />
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <h2>Open</h2>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger className={triggerAttrClass()}>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={contentAttrClass()}
            sideOffset={5}
            avoidCollisions={false}
          >
            <DropdownMenu.Item className={itemAttrClass()} onSelect={() => console.log('show')}>
              Show fonts
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemAttrClass()} onSelect={() => console.log('bigger')}>
              Bigger
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemAttrClass()} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={separatorAttrClass()} />
            {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
              <DropdownMenu.CheckboxItem
                key={label}
                className={checkboxItemAttrClass()}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              >
                {label}
                <DropdownMenu.ItemIndicator className={itemIndicatorAttrClass()}>
                  <TickIcon />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.CheckboxItem>
            ))}
            <DropdownMenu.Separator className={separatorAttrClass()} />
            <DropdownMenu.RadioGroup
              className={radioGroupAttrClass()}
              value={file}
              onValueChange={setFile}
            >
              {files.map((file) => (
                <DropdownMenu.RadioItem key={file} className={radioItemAttrClass()} value={file}>
                  {file}
                  <DropdownMenu.ItemIndicator className={itemIndicatorAttrClass()}>
                    <TickIcon />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Arrow className={arrowAttrClass()} />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: 'transparent',
  padding: '5px 10px',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },
});

const gridClass = css({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(3, 50px)',
  columnGap: 150,
  rowGap: 100,
  padding: 100,
  border: '1px solid black',
});

const dialogClass = css({
  position: 'fixed',
  background: 'white',
  border: '1px solid black',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: 30,
});

const chromaticTriggerClass = css({
  boxSizing: 'border-box',
  width: 30,
  height: 30,
  backgroundColor: 'tomato',
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticContentClass = css({
  boxSizing: 'border-box',
  display: 'grid',
  placeContent: 'center',
  width: 60,
  height: 60,
  backgroundColor: 'royalblue',
  color: 'white',
  fontSize: 10,
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticArrowClass = css({
  fill: 'black',
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '[data-disabled]': { borderStyle: 'dashed' },

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
};
const triggerAttrClass = css(styles);
const contentAttrClass = css(styles);
const itemAttrClass = css(styles);
const itemIndicatorAttrClass = css(styles);
const checkboxItemAttrClass = css(styles);
const radioGroupAttrClass = css(styles);
const radioItemAttrClass = css(styles);
const separatorAttrClass = css(styles);
const arrowAttrClass = css(styles);
