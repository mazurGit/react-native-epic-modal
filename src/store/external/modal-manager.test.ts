import { modalManager } from './modal-manager';

describe('ModalManager', () => {
  it('orders entries by priority and then by presentation order', () => {
    const manager = modalManager;
    manager.clear();

    manager.register({ id: 'low', priority: 1 });
    manager.register({ id: 'latest', priority: 10 });
    manager.register({ id: 'same-priority', priority: 10 });
    manager.present('low');
    manager.present('latest');
    manager.present('same-priority');

    expect(manager.getSnapshot().map(({ id }) => id)).toEqual([
      'same-priority',
      'latest',
      'low',
    ]);
  });

  it('notifies subscribers when the collection changes', () => {
    const manager = modalManager;
    manager.clear();
    const listener = jest.fn();
    const unsubscribe = manager.subscribe(listener);

    manager.register({ id: 'modal' });
    manager.present('modal');
    manager.dismiss('modal');
    unsubscribe();
    manager.clear();

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('updates visible entry data without resetting its presentation order', () => {
    const manager = modalManager;
    manager.clear();
    manager.register({ id: 'modal', priority: 1, params: { step: 1 } });
    manager.present('modal');

    manager.update('modal', { params: { step: 2 }, priority: 2 });

    expect(manager.getSnapshot()).toEqual([
      { id: 'modal', priority: 2, params: { step: 2 } },
    ]);
  });

  it('serializes and restores visible entries', () => {
    const manager = modalManager;
    manager.clear();
    manager.register({
      id: 'settings',
      priority: 2,
      params: { tab: 'profile' },
    });
    manager.present('settings');

    const serialized = manager.serialize();
    manager.clear();
    manager.hydrate(serialized);

    expect(manager.getSnapshot()).toEqual([
      { id: 'settings', priority: 2, params: { tab: 'profile' } },
    ]);
  });
});
