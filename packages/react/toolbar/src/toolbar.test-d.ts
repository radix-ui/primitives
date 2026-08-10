import type {
  ToolbarProps,
  ToolbarSeparatorProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarToggleGroupSingleProps,
  ToolbarToggleGroupMultipleProps,
  ToolbarToggleItemProps,
} from './index';

type ToolbarToggleGroupProps = ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps;

type _Toolbar = AssertOptionalPropsAcceptUndefined<ToolbarProps>;
type _ToolbarSeparator = AssertOptionalPropsAcceptUndefined<ToolbarSeparatorProps>;
type _ToolbarButton = AssertOptionalPropsAcceptUndefined<ToolbarButtonProps>;
type _ToolbarLink = AssertOptionalPropsAcceptUndefined<ToolbarLinkProps>;
type _ToolbarToggleGroup = AssertOptionalPropsAcceptUndefined<ToolbarToggleGroupProps>;
type _ToolbarToggleGroupSingle = AssertOptionalPropsAcceptUndefined<ToolbarToggleGroupSingleProps>;
type _ToolbarToggleGroupMultiple =
  AssertOptionalPropsAcceptUndefined<ToolbarToggleGroupMultipleProps>;
type _ToolbarToggleItem = AssertOptionalPropsAcceptUndefined<ToolbarToggleItemProps>;
