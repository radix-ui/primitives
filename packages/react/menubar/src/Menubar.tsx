import * as React from 'react';
// @ts-ignore
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const MenubarRoot: React.FC = (props) => (
  <nav>
    <div role="menubar" {...props} />
  </nav>
);
const MenubarMenu: React.FC = (props) => <div {...props} />;
const MenubarTrigger: React.FC = (props) => <div {...props} />;
const MenubarContent: React.FC = (props) => <div {...props} />;
const MenubarItem: React.FC = (props) => <MenubarItemImpl {...props} />;
const MenubarItemImpl: React.FC = (props) => <div {...props} />;
const MenubarArrow: React.FC = (props) => <div {...props} />;

export {
  MenubarRoot as Root,
  MenubarMenu as Menu,
  MenubarItem as Item,
  MenubarContent as Content,
  MenubarTrigger as Trigger,
  MenubarArrow as Arrow,
};
