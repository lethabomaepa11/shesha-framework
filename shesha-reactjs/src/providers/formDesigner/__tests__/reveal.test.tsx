vi.mock('@/providers/formDesigner/formValidator', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/providers/formDesigner/formValidator')>();
  class FormValidatorStub {
    validateAllComponentsAsync = (): Promise<void> => Promise.resolve();

    validateFormSettingsAsync = (): Promise<[]> => Promise.resolve([]);
  }
  return { ...actual, FormValidator: FormValidatorStub };
});

import { act, renderHook } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { useDesignerReveal } from '..';
import { FormDesignerContext } from '../contexts';
import { FormDesignerInstance } from '../instance';
import { createTestDesigner } from './testDesigner';
import { sampleForm } from './testMarkup';

const wrapperFor = (designer: FormDesignerInstance): FC<PropsWithChildren> => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <FormDesignerContext.Provider value={designer}>{children}</FormDesignerContext.Provider>
  );
  return Wrapper;
};

describe('designer.reveal() and useDesignerReveal()', () => {
  it('stores the panes to open and notifies "reveal"', () => {
    const designer = createTestDesigner(sampleForm());
    const onReveal = vi.fn();
    designer.subscribe('reveal', onReveal);

    designer.reveal('email');

    expect(designer.revealRequest.containerIds).toEqual(['pane-a']);
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it('opens the pane when a reveal names it', () => {
    const designer = createTestDesigner(sampleForm());
    const open = vi.fn();
    renderHook(() => useDesignerReveal(['pane-a', 'pane-b'], open), { wrapper: wrapperFor(designer) });

    act(() => designer.reveal('email'));

    expect(open).toHaveBeenCalledWith('pane-a');
  });

  it('applies a request made before it mounted (inner panes mount after outer ones open)', () => {
    const designer = createTestDesigner(sampleForm());
    designer.reveal('email');
    const open = vi.fn();

    renderHook(() => useDesignerReveal(['pane-a', 'pane-b'], open), { wrapper: wrapperFor(designer) });

    expect(open).toHaveBeenCalledWith('pane-a');
  });

  it('opens each pane once per request, even if the component mounts again', () => {
    const designer = createTestDesigner(sampleForm());
    designer.reveal('email');
    const open = vi.fn();
    const first = renderHook(() => useDesignerReveal(['pane-a'], open), { wrapper: wrapperFor(designer) });
    first.unmount();

    renderHook(() => useDesignerReveal(['pane-a'], open), { wrapper: wrapperFor(designer) });

    expect(open).toHaveBeenCalledTimes(1);
  });

  it('does nothing outside the designer', () => {
    const open = vi.fn();
    renderHook(() => useDesignerReveal(['pane-a'], open));
    expect(open).not.toHaveBeenCalled();
  });
});
