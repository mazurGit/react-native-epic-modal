let activeHost: object | undefined;

export function claimModalHost(host: object) {
  if (activeHost && activeHost !== host) {
    throw new Error(
      'Only one ModalHost can be mounted at a time. ModalProvider already ' +
        'mounts one, so place a single ModalProvider near the application root.'
    );
  }

  activeHost = host;

  return () => {
    if (activeHost === host) activeHost = undefined;
  };
}
