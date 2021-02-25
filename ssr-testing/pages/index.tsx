import * as React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>SSR testing</h1>
      <ul>
        <li>
          <Link href="/id">Id</Link>
        </li>
        <li>
          <Link href="/accordion">Accordion</Link>
        </li>
        <li>
          <Link href="/alert-dialog">AlertDialog</Link>
        </li>
        <li>
          <Link href="/collapsible">Collapsible</Link>
        </li>
        <li>
          <Link href="/dialog">Dialog</Link>
        </li>
        <li>
          <Link href="/label">Label</Link>
        </li>
        <li>
          <Link href="/popover">Popover</Link>
        </li>
        <li>
          <Link href="/roving-focus-group">RovingFocusGroup</Link>
        </li>
        <li>
          <Link href="/tabs">Tabs</Link>
        </li>
        <li>
          <Link href="/tooltip">Tooltip</Link>
        </li>
      </ul>
    </main>
  );
}
