import type { MenuProps } from 'antd';
import { IFlatComponentsStructure } from '@/providers/form/models';
import { IContainerOwnership } from '@/providers/formDesigner/structure/containers';
import { isDefined } from '@/utils/nullables';
import { getMoveDownAction, getMoveOutAction, getMoveUpAction, RowActionState } from './model/rowActions';
import { ILayerNode } from './model/types';

export const LAYER_MENU_ACTIONS = [
  'move-up', 'move-down', 'move-out', 'copy', 'cut', 'paste-after', 'paste-inside', 'copy-settings', 'paste-settings', 'duplicate', 'delete',
] as const;
export type LayerMenuAction = typeof LAYER_MENU_ACTIONS[number];

export const isLayerMenuAction = (value: string): value is LayerMenuAction => (LAYER_MENU_ACTIONS as readonly string[]).includes(value);

type MenuItem = NonNullable<MenuProps['items']>[number];

const moveItem = (key: LayerMenuAction, label: string, state: RowActionState, shortcut?: string): MenuItem => ({
  key,
  label: state.enabled ? label : <span title={state.reason}>{label}</span>,
  disabled: !state.enabled,
  ...(shortcut !== undefined ? { extra: shortcut } : {}),
});

/** Components always have a menu; a pane's only item is Paste inside */
export const hasRowMenu = (node: ILayerNode): boolean => node.kind === 'component' || isDefined(node.dropContainerId);

/** Row menu. Components: moves, clipboard, Duplicate and Delete. Panes: Paste inside. Disabled moves say why */
export const buildRowMenuItems = (markup: IFlatComponentsStructure, ownership: IContainerOwnership, node: ILayerNode): MenuItem[] => {
  const pasteInside: MenuItem[] = isDefined(node.dropContainerId) ? [{ key: 'paste-inside', label: 'Paste inside' }] : [];
  if (node.kind === 'pane')
    return pasteInside;
  return [
    moveItem('move-up', 'Move up', getMoveUpAction(markup, node.id), 'Alt+↑'),
    moveItem('move-down', 'Move down', getMoveDownAction(markup, node.id), 'Alt+↓'),
    moveItem('move-out', 'Move out of container', getMoveOutAction(markup, ownership, node.id)),
    { type: 'divider' },
    { key: 'copy', label: 'Copy', extra: 'Ctrl+C' },
    { key: 'cut', label: 'Cut', extra: 'Ctrl+X' },
    { key: 'paste-after', label: 'Paste after', extra: 'Ctrl+Shift+V' },
    ...pasteInside,
    { key: 'copy-settings', label: 'Copy settings', extra: 'Ctrl+Alt+C' },
    { key: 'paste-settings', label: 'Paste settings', extra: 'Ctrl+Alt+V' },
    { type: 'divider' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete', danger: true },
  ];
};
