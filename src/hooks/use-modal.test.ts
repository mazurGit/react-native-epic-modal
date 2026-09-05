import type { IModalComponent } from '../components/modal/types';
import { removeModalById, upsertModal } from './use-modal';

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

    const stack = upsertModal(upsertModal([], first), second);

    expect(upsertModal(stack, updated)).toEqual([updated, second]);
  });

  it('removes only the modal with the requested id', () => {
    const second: IModalComponent = {
      id: 'second',
      props: { name: 'second' },
      ref: null,
    };
    const stack = [first, second];

    expect(removeModalById(stack, 'first')).toEqual([second]);
    expect(removeModalById(stack, 'missing')).toBe(stack);
  });
});
