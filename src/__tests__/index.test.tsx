jest.mock('../components/modal-provider/modal-provider', () => ({
  ModalProvider: () => null,
}));

jest.mock('../components/components', () => ({
  Modal: () => null,
}));

import { Modal, ModalProvider } from '../index';

describe('public API', () => {
  it('exports the modal provider and modal component', () => {
    expect(ModalProvider).toBeDefined();
    expect(Modal).toBeDefined();
  });
});
