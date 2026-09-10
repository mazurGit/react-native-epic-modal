import { modalManager } from './modal-manager';
import { createRef } from 'react';
import type { ModalRef } from '../../components/modal-bridge/modal-bridge';

const registration = (id: string) => ({
  id,
  props: {},
  ref: createRef<ModalRef>(),
});

describe('ModalManager', () => {
  it('orders entries by presentation order', () => {
    const manager = modalManager;
    manager.clear();

    manager.register(registration('low'));
    manager.register(registration('latest'));
    manager.register(registration('same-priority'));
    manager.present('low');
    manager.present('latest');
    manager.present('same-priority');

    expect(manager.getSnapshot().map(({ id }) => id)).toEqual([
      'low',
      'latest',
      'same-priority',
    ]);
  });

  it('notifies subscribers when the collection changes', () => {
    const manager = modalManager;
    manager.clear();
    const listener = jest.fn();
    const unsubscribe = manager.subscribe(listener);

    manager.register(registration('modal'));
    manager.present('modal');
    unsubscribe();
    manager.clear();

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
