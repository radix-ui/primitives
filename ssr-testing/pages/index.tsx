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
          <Link href="/collapsible">Collapsible</Link>
        </li>
        <li>
          <Link href="/dialog">Dialog</Link>
        </li>
        <li>
          <Link href="/popover">Popover</Link>
        </li>
      </ul>
    </main>
  );
}
