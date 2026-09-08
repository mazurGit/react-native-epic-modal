import { modalManager } from './modal-manager';

describe('ModalManager', () => {
  it('orders entries by presentation order', () => {
    const manager = modalManager;
    manager.clear();

    manager.register({ id: 'low', render: () => null });
    manager.register({
      id: 'latest',
      render: () => null,
    });
    manager.register({
      id: 'same-priority',
      render: () => null,
    });
    manager.present({ id: 'low' });
    manager.present({ id: 'latest' });
    manager.present({ id: 'same-priority' });

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

    manager.register({ id: 'modal', render: () => null });
    manager.present({ id: 'modal' });
    manager.notify('modal');
    manager.dismiss('modal');
    unsubscribe();
    manager.clear();

    expect(listener).toHaveBeenCalledTimes(4);
  });

  it('serializes and restores visible entries', () => {
    const manager = modalManager;
    manager.clear();
    manager.register({
      id: 'settings',
      render: () => null,
    });
    manager.present({
      id: 'settings',
    });

    const serialized = manager.serialize();
    manager.clear();
    manager.hydrate(serialized);

    expect(manager.getSnapshot()).toEqual([
      {
        id: 'settings',
      },
    ]);
  });
});
