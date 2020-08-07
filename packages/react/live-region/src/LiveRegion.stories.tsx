import * as React from 'react';
import { LiveRegion } from './LiveRegion';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';

export default { title: 'LiveRegion' };

export function Basic() {
  const [count, setCount] = React.useState(1);

  return (
    <>
      {count > 0 && <button onClick={() => setCount((count) => count - 1)}>remove</button>}
      <button onClick={() => setCount((count) => count + 1)}>add</button>

      {[...Array(count)].map((_, index) => (
        <LiveRegion key={index} type={index % 2 ? 'assertive' : 'polite'}>
          Message {index}
        </LiveRegion>
      ))}
    </>
  );
}

export function StatusChange() {
  const [friendIsOnline, setFriendIsOnline] = React.useState(false);
  const interval = React.useRef<number | null>(null);

  React.useEffect(() => {
    interval.current = window.setInterval(() => {
      setFriendIsOnline((s) => !s);
    }, getRandomInt(6000, 10000));
    return () => window.clearInterval(interval.current!);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1 }}>
      <VisuallyHidden>
        <LiveRegion>Your friend is {friendIsOnline ? 'online' : 'offline'}</LiveRegion>
      </VisuallyHidden>
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          background: friendIsOnline ? 'forestgreen' : 'crimson',
          borderRadius: 5,
        }}
      />{' '}
      Friend status: {friendIsOnline ? 'Online' : 'Offline'}
    </div>
  );
}

function getRandomInt(min = 1, max = 100) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
