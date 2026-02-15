import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app.tsx';
import './globals.css';

const rootElement = document.getElementById('root')!;
// @ts-expect-error
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement,
);
