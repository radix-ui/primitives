import * as React from 'react';
import { Popper, styles } from './Popper';
import { Portal } from '@interop-ui/react-portal';

export default { title: 'Popper' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popper>
        <Popper.Anchor>
          <div style={{ backgroundColor: 'hotpink', width: 100, height: 100 }}>
            <button onClick={() => setIsOpen(true)}>open</button>
          </div>
        </Popper.Anchor>

        {isOpen && (
          <Portal>
            <Popper.Content>
              <div style={{ backgroundColor: '#eee', width: 250, height: 150 }}>
                <button onClick={() => setIsOpen(false)}>close</button>
                <Popper.Arrow>
                  <div
                    style={{
                      backgroundColor: 'tomato',
                      width: 20,
                      height: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  />
                </Popper.Arrow>
              </div>
            </Popper.Content>
          </Portal>
        )}
      </Popper>
    </div>
  );
};
