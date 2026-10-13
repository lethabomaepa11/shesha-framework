import { FC } from 'react';
import { Button } from 'antd';
import { CopyOutlined, DeleteFilled, SnippetsOutlined } from '@ant-design/icons';
import { useFormDesigner, useFormDesignerReadOnly, useFormDesignerSelectedComponent } from '@/providers/formDesigner';
import { useComponentClipboard } from './clipboard/useComponentClipboard';

export const ComponentTitleButtons: FC = ({}) => {
  const component = useFormDesignerSelectedComponent();
  const readOnly = useFormDesignerReadOnly();
  const { deleteComponent, duplicateComponent } = useFormDesigner();
  const clipboard = useComponentClipboard();

  const onDeleteClick = (): void => {
    if (!readOnly && component)
      deleteComponent({ componentId: component.id });
  };

  const onDuplicateClick = (): void => {
    if (!readOnly && component)
      duplicateComponent({ componentId: component.id });
  };

  return component && !readOnly
    ? (
      <>
        <Button
          type="text"
          icon={<SnippetsOutlined />}
          onClick={() => void clipboard.copyToClipboard(component.id, false)}
          size="small"
          title="Copy component (Ctrl+C)"
        />
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={onDuplicateClick}
          size="small"
          title="Duplicate component"
        />
        <Button
          type="text"
          icon={<DeleteFilled color="red" />}
          onClick={onDeleteClick}
          size="small"
          danger
          title="Delete component"
        />
      </>
    )
    : undefined;
};
