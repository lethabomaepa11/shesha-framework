import { IConfigurableFormComponent } from '@/providers/form/models';
import type { IComponentContainerInfo } from '@/providers/form/utils';
import { isNotNullOrWhiteSpace } from '@/utils/nullables';

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/** Same rule as the designer's getComponentDisplayName: the label, then the component name, then the type */
export const getComponentDisplayText = (component: IConfigurableFormComponent): string => {
  const { label, componentName, type } = component;
  if (typeof label === 'string' && isNotNullOrWhiteSpace(label))
    return label;
  if (isNotNullOrWhiteSpace(componentName))
    return componentName;
  return `${type} (no name)`;
};

const PANE_NOUNS: Readonly<Record<string, string>> = {
  tabs: 'Tab',
  columns: 'Column',
  steps: 'Step',
  header: 'Header',
  content: 'Content',
  stepFooter: 'Footer',
  customHeader: 'Header',
};

const readText = (source: object, key: string): string | undefined => {
  const value: unknown = (source as Record<string, unknown>)[key];
  return typeof value === 'string' && isNotNullOrWhiteSpace(value) ? value : undefined;
};

/** Label of a pane row: its own title, label or name, otherwise e.g. "Column 2" or "Header" */
export const getPaneLabel = (pane: IComponentContainerInfo): string => {
  const ownText = readText(pane.source, 'title') ?? readText(pane.source, 'label') ?? readText(pane.source, 'name');
  if (ownText !== undefined)
    return ownText;
  const noun = PANE_NOUNS[pane.propertyName] ?? capitalize(pane.propertyName);
  return pane.index !== undefined ? `${noun} ${pane.index + 1}` : noun;
};

/** Plural used in "Drop it into one of the tabs." */
export const getPaneGroupNoun = (panes: readonly IComponentContainerInfo[]): string => {
  const names = new Set(panes.map((pane) => pane.propertyName));
  if (names.size === 1) {
    if (names.has('tabs'))
      return 'tabs';
    if (names.has('steps'))
      return 'steps';
    if (names.has('columns'))
      return 'columns';
  }
  return 'sections';
};
