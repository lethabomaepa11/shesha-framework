import { Component, PropsWithChildren, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { isDefined } from '@/utils/nullables';

interface ILayersErrorBoundaryState {
  error: Error | undefined;
}

/** Keeps a Layers failure inside the Layers tab; the rest of the designer keeps working */
export class LayersErrorBoundary extends Component<PropsWithChildren, ILayersErrorBoundaryState> {
  override state: ILayersErrorBoundaryState = { error: undefined };

  static getDerivedStateFromError(error: unknown): ILayersErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: unknown): void {
    console.warn('The Layers panel failed', error);
  }

  override render(): ReactNode {
    if (isDefined(this.state.error)) {
      return (
        <Result
          status="warning"
          title="Layers couldn't be shown for this form"
          extra={<Button onClick={() => this.setState({ error: undefined })}>Try again</Button>}
        />
      );
    }
    return this.props.children;
  }
}
