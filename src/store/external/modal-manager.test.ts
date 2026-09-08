import { modalManager } from './modal-manager';

describe('ModalManager', () => {
  it('orders entries by priority and then by presentation order', () => {
    const manager = modalManager;
    manager.clear();
    const render = () => null;

    manager.register({ id: 'low', priority: 1, render });
    manager.register({ id: 'latest', priority: 10, render });
    manager.register({ id: 'same-priority', priority: 10, render });
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

    manager.register({ id: 'modal', render: () => null });
    manager.present('modal');
    manager.dismiss('modal');
    unsubscribe();
    manager.clear();

    expect(listener).toHaveBeenCalledTimes(3);
  });
});
