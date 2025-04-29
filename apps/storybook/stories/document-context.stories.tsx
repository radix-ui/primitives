import * as React from 'react';
import { createPortal } from 'react-dom';
import { DocumentContext } from 'radix-ui/internal';
import { Dialog, DropdownMenu, Tooltip } from 'radix-ui';
import styles from './document-context.stories.module.css';

export default { title: 'Utilities/DocumentContext' };

export const Default = () => {
  const [portalElement, setPortalElement] = React.useState<HTMLElement | null>(null);
  const [count, setCount] = React.useState(0);

  const openContentInPopup = async () => {
    const popup = window.open(
      '',
      'Popup Test',
      'height=600,width=600,left=300,top=300,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
    if (!popup) return;

    // Copy all parent window styles and fonts
    // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/#copy-style-sheets-to-the-picture-in-picture-window
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
        const style = document.createElement('style');

        style.textContent = cssRules;
        popup.document.head.appendChild(style);
      } catch (e) {
        console.error(e);
        const link = document.createElement('link');
        if (styleSheet.href === null) {
          return;
        }

        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        link.media = styleSheet.media.toString();
        link.href = styleSheet.href;
        popup.document.head.appendChild(link);
      }
    });

    setPortalElement(popup.document.body);

    // Detect when window is closed by user
    popup.addEventListener('pagehide', () => {
      setPortalElement(null);
    });
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          padding: 32,
          background: 'yellow',
        }}
      >
        <h1>This section will be portalled to another document/window</h1>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={styles.trigger}>
            Dropdown with dialog test
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={styles.content} sideOffset={5}>
              <Dialog.Root>
                <Dialog.Trigger className={styles.item} asChild>
                  <DropdownMenu.Item onSelect={(event) => event.preventDefault()}>
                    Open dialog
                  </DropdownMenu.Item>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Content className={styles.dialog}>
                    <Dialog.Title>Nested dropdown</Dialog.Title>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger
                        className={styles.trigger}
                        style={{ width: '100%', marginBottom: 20 }}
                      >
                        Open
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className={styles.content} sideOffset={5}>
                          <DropdownMenu.Item
                            className={styles.item}
                            onSelect={() => console.log('undo')}
                          >
                            Undo
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={styles.item}
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
              <DropdownMenu.Item className={styles.item}>Test</DropdownMenu.Item>
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button>Tooltip test</button>
            </Tooltip.Trigger>
            <Tooltip.Content>Tooltip content</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={openContentInPopup} type="button">
        Open in Popup
      </button>
      <mark>{count}</mark>

      {portalElement
        ? createPortal(
            <DocumentContext.DocumentProvider document={portalElement.ownerDocument}>
              {content}
            </DocumentContext.DocumentProvider>,
            portalElement
          )
        : content}
    </div>
  );
};
