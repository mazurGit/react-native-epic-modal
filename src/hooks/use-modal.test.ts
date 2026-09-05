import type { IModalComponent } from '../components/modal/types';
import {
  registerModalById,
  removeModalById,
  updateModalById,
} from './use-modal';

describe('modal state helpers', () => {
  const first: IModalComponent = {
    id: 'first',
    props: { name: 'first' },
    ref: null,
  };

  it('adds a modal and updates it without changing its stack position', () => {
    const second: IModalComponent = {
      id: 'second',
      props: { name: 'second' },
      ref: null,
    };
    const updated: IModalComponent = {
      ...first,
      props: { name: 'updated' },
    };

    const stack = registerModalById(
      registerModalById({ byId: {}, order: [] }, first),
      second
    );

    expect(registerModalById(stack, updated)).toEqual({
      byId: { first: updated, second },
      order: ['first', 'second'],
    });
  });

  it('removes only the modal with the requested id', () => {
    const second: IModalComponent = {
      id: 'second',
      props: { name: 'second' },
      ref: null,
    };
    const stack = { byId: { first, second }, order: ['first', 'second'] };

    expect(removeModalById(stack, 'first')).toEqual({
      byId: { second },
      order: ['second'],
    });
    expect(removeModalById(stack, 'missing')).toBe(stack);
  });

  it('updates props without changing the modal position or ref', () => {
    const second: IModalComponent = {
      id: 'second',
      props: { name: 'second' },
      ref: null,
    };
    const stack = { byId: { first, second }, order: ['first', 'second'] };
    const updated = updateModalById(stack, 'first', { name: 'updated' });

    expect(updated).toEqual({
      byId: { first: { ...first, props: { name: 'updated' } }, second },
      order: ['first', 'second'],
    });
    expect(updateModalById(stack, 'missing', { name: 'updated' })).toBe(stack);
  });
});
