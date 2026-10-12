import * as React from 'react';

type ExternalOverlayTriggerProps = {
  children?: React.ReactNode;
};

function ExternalOverlayTrigger({ children = 'Trigger overlay' }: ExternalOverlayTriggerProps) {
  const cleanupRef = React.useRef<(() => void) | undefined>(undefined);

  React.useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        cleanupRef.current?.();
        cleanupRef.current = createExternalOverlay();
      }}
    >
      {children}
    </button>
  );
}

function createExternalOverlay() {
  const container = document.createElement('div');
  container.dataset.testid = 'external-overlay';
  container.style.position = 'fixed';
  container.style.top = '12px';
  container.style.right = '12px';
  container.style.zIndex = '2147483647';
  container.style.pointerEvents = 'auto';
  container.style.backgroundColor = 'hsl(0 0% 100%)';
  container.style.border = '1px solid hsl(0 0% 80%)';
  container.style.borderRadius = '4px';
  container.style.padding = '8px';
  container.style.boxShadow = '0 2px 8px hsl(0 0% 0% / 0.1)';

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.testid = 'external-overlay-button';
  button.textContent = 'external overlay';

  const dismissButton = document.createElement('button');
  dismissButton.type = 'button';
  dismissButton.dataset.testid = 'external-overlay-dismiss-button';
  dismissButton.textContent = 'dismiss';

  const stopPropagation = (event: Event) => event.stopPropagation();
  const handleDismiss = (event: Event) => {
    stopPropagation(event);
    cleanup();
  };

  button.addEventListener('mousedown', stopPropagation);
  button.addEventListener('mouseup', stopPropagation);
  button.addEventListener('click', stopPropagation);
  dismissButton.addEventListener('click', handleDismiss);

  container.append(button);
  container.append(dismissButton);
  document.body.append(container);

  function cleanup() {
    button.removeEventListener('mousedown', stopPropagation);
    button.removeEventListener('mouseup', stopPropagation);
    button.removeEventListener('click', stopPropagation);
    dismissButton.removeEventListener('click', handleDismiss);
    container.remove();
  }

  return cleanup;
}

export { ExternalOverlayTrigger };
