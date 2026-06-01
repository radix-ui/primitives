import * as React from 'react';
import * as Client from './client';
import * as Server from './server';

export default function Page() {
  return (
    <>
      <p>All components should be rendered as links</p>

      <h2>Client.LinkButton</h2>

      <Client.LinkButton href="/">children</Client.LinkButton>

      <h2>Client.Button as Client.Link</h2>

      <Client.Button asChild>
        <Client.Link href="/">children</Client.Link>
      </Client.Button>

      <h2>Client.Button as Server.Link</h2>

      <Client.Button asChild>
        <Server.Link href="/">children</Server.Link>
      </Client.Button>

      <h2>Client.Button as Client.LinkSlottable</h2>

      <Client.Button asChild>
        <Client.LinkSlottable href="/">children</Client.LinkSlottable>
      </Client.Button>

      <h2>Client.Button as Server.LinkSlottable</h2>

      <Client.Button asChild>
        <Server.LinkSlottable href="/">children</Server.LinkSlottable>
      </Client.Button>

      <h2>Client.ButtonSlottable as Server.Link</h2>

      <Client.ButtonSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Client.ButtonSlottable>

      <h2>Client.ButtonSlottable as Client.Link</h2>

      <Client.ButtonSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Client.ButtonSlottable>

      <h2>Client.ButtonNestedSlottable as Server.Link</h2>

      <Client.ButtonNestedSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Client.ButtonNestedSlottable>

      <h2>Client.ButtonNestedSlottable as Client.Link</h2>

      <Client.ButtonNestedSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Client.ButtonNestedSlottable>

      <h2>Client.IconButtonNestedSlottable as Server.Link</h2>

      <Client.IconButtonNestedSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Client.IconButtonNestedSlottable>

      <h2>Client.IconButtonNestedSlottable as Client.Link</h2>

      <Client.IconButtonNestedSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Client.IconButtonNestedSlottable>

      <hr />

      <h2>Server.LinkButton</h2>

      <Server.LinkButton href="/">children</Server.LinkButton>

      <h2>Server.Button as Server.Link</h2>

      <Server.Button asChild>
        <Server.Link href="/">children</Server.Link>
      </Server.Button>

      <h2>Server.Button as Client.Link</h2>

      <Server.Button asChild>
        <Client.Link href="/">children</Client.Link>
      </Server.Button>

      <h2>Server.Button as Server.LinkSlottable</h2>

      <Server.Button asChild>
        <Server.LinkSlottable href="/">children</Server.LinkSlottable>
      </Server.Button>

      <h2>Server.Button as Client.LinkSlottable</h2>

      <Server.Button asChild>
        <Client.LinkSlottable href="/">children</Client.LinkSlottable>
      </Server.Button>

      <h2>Server.ButtonSlottable as Client.Link</h2>

      <Server.ButtonSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Server.ButtonSlottable>

      <h2>Server.ButtonSlottable as Server.Link</h2>

      <Server.ButtonSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Server.ButtonSlottable>

      <h2>Server.ButtonNestedSlottable as Client.Link</h2>

      <Server.ButtonNestedSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Server.ButtonNestedSlottable>

      <h2>Server.ButtonNestedSlottable as Server.Link</h2>

      <Server.ButtonNestedSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Server.ButtonNestedSlottable>

      <h2>Server.IconButtonNestedSlottable as Server.Link</h2>

      <Server.IconButtonNestedSlottable asChild>
        <Server.Link href="/">children</Server.Link>
      </Server.IconButtonNestedSlottable>

      <h2>Server.IconButtonNestedSlottable as Client.Link</h2>

      <Server.IconButtonNestedSlottable asChild>
        <Client.Link href="/">children</Client.Link>
      </Server.IconButtonNestedSlottable>
    </>
  );
}
