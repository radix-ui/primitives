import * as Menu from '@repo/test-registry/components/menu';

export default function Page() {
  return (
    <div>
      <Menu.Basic />
      <hr />
      <Menu.Submenus />
      <hr />
      <Menu.Typeahead />
      <hr />
      <Menu.WithLabels />
    </div>
  );
}
