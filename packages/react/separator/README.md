# `react-separator`

## Installation

```sh
$ yarn add @interop-ui/react-separator
# or
$ npm install @interop-ui/react-separator
```

## Usage

```js
import * as React from 'react';
import { Separator, styles } from '@interop-ui/react-separator';

function MyComponent(props) {
  return (
    <div className="row">
      <main className="column">
        <section>
          <h2>A really cool section full of great content</h2>
        </section>
        <Separator style={styles.root} />
        <section>
          <h2>More content, loosely related to the content above</h2>
        </section>
      </main>
      <Separator style={styles.root} orientation="vertical" />
      <aside className="column">
        <h2>Other stuff</h2>
      </aside>
    </div>
  );
}
```
