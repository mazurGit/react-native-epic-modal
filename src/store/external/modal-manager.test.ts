import { modalManager } from './modal-manager';

describe('ModalManager', () => {
  it('orders entries by priority and then by presentation order', () => {
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
    manager.present({ id: 'low', priority: 1 });
    manager.present({ id: 'latest', priority: 10 });
    manager.present({
      id: 'same-priority',
      priority: 10,
    });

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
    manager.dismiss('modal');
    unsubscribe();
    manager.clear();

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('updates visible entry data without resetting its presentation order', () => {
    const manager = modalManager;
    manager.clear();
    manager.register({
      id: 'modal',
      render: () => null,
    });
    manager.present({
      id: 'modal',
      priority: 1,
    });

    manager.update('modal', {
      priority: 2,
    });

    expect(manager.getSnapshot()).toEqual([{ id: 'modal', priority: 2 }]);
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
      priority: 2,
    });

    const serialized = manager.serialize();
    manager.clear();
    manager.hydrate(serialized);

    expect(manager.getSnapshot()).toEqual([
      {
        id: 'settings',
        priority: 2,
      },
    ]);
  });
});
