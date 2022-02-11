import * as React from 'react';
import * as Menubar from '.';

export default { title: 'Components/Menubar' };

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
        <Menubar.Root>
          <Menubar.Menu>
            <Menubar.Trigger>A - Menu 1</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item>Menu 1 - Item 1</Menubar.Item>
              <Menubar.Menu>
                <Menubar.TriggerItem>Menu 1 - Nested Menu</Menubar.TriggerItem>
                <Menubar.Content>
                  <Menubar.Item>Menu 1 - Nested Menu Item</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Item>Menu 1 - Item 2</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>B - Menu 2</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item>Menu 2 - Item 1</Menubar.Item>
              <Menubar.Menu>
                <Menubar.TriggerItem>Menu 2 - Nested Menu</Menubar.TriggerItem>
                <Menubar.Content>
                  <Menubar.Item>Menu 2 - Nested Menu Item</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Item>Menu 2 - Item 2</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>C - Menu 3</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item>Menu 3 - Item 1</Menubar.Item>
              <Menubar.Menu>
                <Menubar.TriggerItem>Menu 3 - Nested Menu</Menubar.TriggerItem>
                <Menubar.Content>
                  <Menubar.Item>Menu 3 - Nested Menu Item</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Item>Menu 3 - Item 2</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
      </div>
    </div>
  );
};
