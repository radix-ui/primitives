import * as React from 'react';

import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope, type Scope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

/* -------------------------------------------------------------------------------------------------
 * List
 * ----------------------------------------------------------------------------------------------- */

const LIST_NAME = 'List';

type ScopedProps<P> = P & { __scopeList?: Scope };

const [createListContext, createListScope] = createContextScope(LIST_NAME, [
  createRovingFocusGroupScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();

type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;

type ListContextValue = {
  orientation: RovingFocusGroupProps['orientation'];
  dir: RovingFocusGroupProps['dir'];
  multiselect: boolean;
  selectedKeys: Set<string>;
  onSelect(key: string): void;
};

const [ListProvider, useListContext] = createListContext<ListContextValue>(LIST_NAME);

type ListElement = React.ElementRef<typeof Primitive.div>;
type ListProps = React.ComponentPropsWithoutRef<typeof Primitive.div> & {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
  multiselect?: boolean;

  selectedKeys?: string[];
  onSelectedKeysChange?: (selectedKeys: string[]) => void;
  defaultSelectedKeys?: string[];
};

const List = React.forwardRef<ListElement, ScopedProps<ListProps>>((props, forwardedRef) => {
  const {
    __scopeList,
    orientation = 'vertical',
    loop = true,
    dir,

    multiselect = false,

    selectedKeys: selectedKeysProp,
    onSelectedKeysChange,
    defaultSelectedKeys = [],

    ...domProps
  } = props;

  // RovingFocus scope for focus management
  const rovingFocusScope = useRovingFocusGroupScope(__scopeList);

  // useControllableState for selected keys
  const [selectedKeys, setSelectedKeys] = useControllableState<string[]>({
    prop: selectedKeysProp,
    onChange: onSelectedKeysChange,
    defaultProp: defaultSelectedKeys,
  });

  const handleSelect = React.useCallback(
    (key: string) => {
      setSelectedKeys((prevValue) => {
        const prevSet = new Set(prevValue ?? []);
        if (!multiselect) {
          // single-select
          return [key];
        } else {
          // multi-select
          if (prevSet.has(key)) {
            prevSet.delete(key);
          } else {
            prevSet.add(key);
          }
          return Array.from(prevSet);
        }
      });
    },
    [multiselect, setSelectedKeys]
  );

  // Convert direction + set up the context
  const direction = useDirection(dir);

  // Convert arrays to sets for internal usage
  const selectedKeysSet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);

  return (
    <ListProvider
      scope={__scopeList}
      orientation={orientation}
      dir={direction}
      multiselect={multiselect}
      selectedKeys={selectedKeysSet}
      onSelect={handleSelect}
    >
      <RovingFocusGroup.Root
        asChild
        {...rovingFocusScope}
        orientation={orientation}
        dir={direction}
        loop={loop}
      >
        <Primitive.div
          ref={forwardedRef}
          role="listbox"
          aria-multiselectable={multiselect || undefined}
          data-orientation={orientation}
          {...domProps}
        />
      </RovingFocusGroup.Root>
    </ListProvider>
  );
});
List.displayName = LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * ListItem
 * ----------------------------------------------------------------------------------------------- */

type ListItemElement = React.ElementRef<typeof Primitive.div>;
type ListItemProps = React.ComponentPropsWithoutRef<typeof Primitive.div> & {
  id: string;
};

const ListItem = React.forwardRef<ListItemElement, ScopedProps<ListItemProps>>(
  (props, forwardedRef) => {
    const { id, __scopeList, ...domProps } = props;
    const { selectedKeys, onSelect, orientation } = useListContext(LIST_NAME, __scopeList);

    const isSelected = selectedKeys.has(id);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        const { key } = event;
        if (key === 'Enter') {
          onSelect(id);
        }
      },
      [onSelect, id]
    );

    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeList);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope}>
        <Primitive.div
          ref={forwardedRef}
          role="option"
          aria-selected={isSelected || undefined}
          tabIndex={-1}
          data-orientation={orientation}
          onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
          onClick={composeEventHandlers(props.onClick, () => onSelect(id))}
          {...domProps}
        />
      </RovingFocusGroup.Item>
    );
  }
);
ListItem.displayName = 'ListItem';

/* -------------------------------------------------------------------------------------------------
 * ListGroup
 * ----------------------------------------------------------------------------------------------- */

type ListGroupElement = React.ElementRef<typeof Primitive.div>;
type ListGroupProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;

const ListGroup = React.forwardRef<ListGroupElement, ScopedProps<ListGroupProps>>(
  (props, forwardedRef) => {
    const { __scopeList, ...domProps } = props;

    return <Primitive.div ref={forwardedRef} role="group" {...domProps} />;
  }
);
ListGroup.displayName = 'ListGroup';

/* -------------------------------------------------------------------------------------------------
 * Exports
 * ----------------------------------------------------------------------------------------------- */

export const createListPrimitiveScope = createListScope();

const Root = List;
const Group = ListGroup;
const Item = ListItem;

export {
  createListScope,
  //
  List,
  ListGroup,
  ListItem,
  //
  Root,
  Group,
  Item,
};

export type { ListProps, ListItemProps };
