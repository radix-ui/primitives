import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <html lang="en">
        <body style={{ margin: 0, padding: '2em 3em' }}>
          <h1>SSR / RSC testing</h1>
          <div style={{ display: 'flex', gap: '10em' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <Link href="/accessible-icon">AccessibleIcon</Link>
              <Link href="/accordion">Accordion</Link>
              <Link href="/alert-dialog">AlertDialog</Link>
              <Link href="/avatar">Avatar</Link>
              <Link href="/checkbox">Checkbox</Link>
              <Link href="/collapsible">Collapsible</Link>
              <Link href="/context-menu">ContextMenu</Link>
              <Link href="/dialog">Dialog</Link>
              <Link href="/dropdown-menu">DropdownMenu</Link>
              <Link href="/form">Form</Link>
              <Link href="/hover-card">HoverCard</Link>
              <Link href="/id">Id</Link>
              <Link href="/label">Label</Link>
              <Link href="/menubar">Menubar</Link>
              <Link href="/navigation-menu">NavigationMenu</Link>
              <Link href="/popover">Popover</Link>
              <Link href="/portal">Portal</Link>
              <Link href="/progress">Progress</Link>
              <Link href="/radio-group">RadioGroup</Link>
              <Link href="/roving-focus-group">RovingFocusGroup</Link>
              <Link href="/scroll-area">ScrollArea</Link>
              <Link href="/select">Select</Link>
              <Link href="/separator">Separator</Link>
              <Link href="/slider">Slider</Link>
              <Link href="/slot">Slot</Link>
              <Link href="/switch">Switch</Link>
              <Link href="/tabs">Tabs</Link>
              <Link href="/toast">Toast</Link>
              <Link href="/toggle-group">ToggleGroup</Link>
              <Link href="/toolbar">Toolbar</Link>
              <Link href="/tooltip">Tooltip</Link>
              <Link href="/visually-hidden">VisuallyHidden</Link>
            </div>

            <div>{children}</div>
          </div>
        </body>
      </html>
    </React.StrictMode>
  );
}

export const metadata: Metadata = {
  title: 'SSR testing',
};
