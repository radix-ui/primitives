import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styles from './AlertDialog.stories.module.css';

export default { title: 'Components/AlertDialog' };

export const Styled = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.overlay} />
      <AlertDialog.Content className={styles.content}>
        <AlertDialog.Title className={styles.title}>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description className={styles.description}>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialog.Description>
        <AlertDialog.Action className={styles.action}>yolo, do it</AlertDialog.Action>
        <AlertDialog.Cancel className={styles.cancel}>maybe not</AlertDialog.Cancel>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  const [housePurchased, setHousePurchased] = React.useState(false);

  return (
    <div>
      <div>
        <img src="https://i.ibb.co/K54hsKt/house.jpg" alt="a large white house with a red roof" />
      </div>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger
          onClick={(e) => {
            if (housePurchased) {
              e.preventDefault();
              setHousePurchased(false);
            }
          }}
        >
          {housePurchased ? 'You bought the house! Sell it!' : 'Buy this house'}
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.content}>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              Houses are very expensive and it looks like you only have €20 in the bank. Maybe
              consult with a financial advisor?
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action} onClick={() => setHousePurchased(true)}>
              buy it anyway
            </AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>
              good point, I'll reconsider
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export const Chromatic = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      height: '100vh',
    }}
  >
    <div>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <AlertDialog.Root>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.chromaticContent}>
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <h2>Open</h2>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={styles.overlay}
            style={{ left: 0, bottom: '50%', width: '25%' }}
          />
          <AlertDialog.Content
            className={styles.chromaticContent}
            style={{ top: '25%', left: '12%' }}
          >
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>

    <div>
      <h1>Uncontrolled with reordered parts</h1>
      <h2>Closed</h2>
      <AlertDialog.Root>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.chromaticContent}>
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
      </AlertDialog.Root>

      <h2>Open</h2>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={styles.overlay}
            style={{ left: '25%', bottom: '50%', width: '25%' }}
          />
          <AlertDialog.Content
            className={styles.chromaticContent}
            style={{ top: '25%', left: '37%' }}
          >
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
      </AlertDialog.Root>
    </div>

    <div>
      <h1>Controlled</h1>
      <h2>Closed</h2>
      <AlertDialog.Root open={false}>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.chromaticContent}>
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <h2>Open</h2>
      <AlertDialog.Root open>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={styles.overlay}
            style={{ left: '50%', bottom: '50%', width: '25%' }}
          />
          <AlertDialog.Content
            className={styles.chromaticContent}
            style={{ top: '25%', left: '62%' }}
          >
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>

    <div>
      <h1>Controlled with reordered parts</h1>
      <h2>Closed</h2>
      <AlertDialog.Root open={false}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.chromaticContent}>
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
      </AlertDialog.Root>

      <h2>Open</h2>
      <AlertDialog.Root open>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={styles.overlay}
            style={{ left: '75%', bottom: '50%', width: '25%' }}
          />
          <AlertDialog.Content
            className={styles.chromaticContent}
            style={{ top: '25%', left: '88%' }}
          >
            <AlertDialog.Title className={styles.title}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.action}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancel}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
        <AlertDialog.Trigger className={styles.trigger}>delete everything</AlertDialog.Trigger>
      </AlertDialog.Root>
    </div>

    <div>
      <h1>State attributes</h1>
      <h2>Closed</h2>
      <AlertDialog.Root>
        <AlertDialog.Trigger className={styles.triggerAttr}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlayAttr} />
          <AlertDialog.Content className={styles.contentAttr}>
            <AlertDialog.Title className={styles.titleAttr}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.descriptionAttr}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.actionAttr}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancelAttr}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <h2>Open</h2>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger className={styles.triggerAttr}>delete everything</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlayAttr} style={{ top: '50%' }} />
          <AlertDialog.Content className={styles.contentAttr} style={{ top: '75%' }}>
            <AlertDialog.Title className={styles.titleAttr}>Title</AlertDialog.Title>
            <AlertDialog.Description className={styles.descriptionAttr}>
              Description
            </AlertDialog.Description>
            <AlertDialog.Action className={styles.actionAttr}>Confirm</AlertDialog.Action>
            <AlertDialog.Cancel className={styles.cancelAttr}>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };
