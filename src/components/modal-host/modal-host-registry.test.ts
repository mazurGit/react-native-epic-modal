import { claimModalHost } from './modal-host-registry';

describe('modal host registry', () => {
  it('rejects a second active modal host', () => {
    const release = claimModalHost({});

    expect(() => claimModalHost({})).toThrow(
      'Only one ModalHost can be mounted at a time'
    );

    release();
  });

  it('allows another host after the active host unmounts', () => {
    const releaseFirst = claimModalHost({});
    releaseFirst();

    const releaseSecond = claimModalHost({});
    expect(releaseSecond).toEqual(expect.any(Function));
    releaseSecond();
  });

  it('does not let stale cleanup release the current host', () => {
    const firstHost = {};
    const releaseFirst = claimModalHost(firstHost);
    releaseFirst();
    const releaseSecond = claimModalHost({});

    releaseFirst();
    expect(() => claimModalHost({})).toThrow(
      'Only one ModalHost can be mounted at a time'
    );

    releaseSecond();
  });
});
