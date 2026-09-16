describe('Epic Studio', () => {
  const tap = async (id) => {
    await waitFor(element(by.id(id)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(id)).tap();
  };
  const closed = async (id) => {
    // Offscreen content can still have a mounted backdrop during dismissal.
    // Wait for unmount before attempting to interact with the screen below.
    await waitFor(element(by.id(id)))
      .not.toExist()
      .withTimeout(5000);
  };

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('travels through two shared-element destinations and back', async () => {
    await tap('open-player');
    await tap('open-album');
    await expect(element(by.text('First light'))).toBeVisible();
    await tap('close-album');
    await closed('close-album');
    await tap('close-player');
    await closed('close-player');
    await tap('open-player');
    await tap('close-player');
    await closed('close-player');
  });

  it('retains selection and dismisses only the top layer', async () => {
    await tap('jump-layers');
    await tap('open-collection');
    await element(by.text('Deep focus')).tap();
    await tap('open-confirmation');
    await tap('confirm-save');
    await tap('close-success');
    await closed('close-success');
    await tap('close-confirmation');
    await closed('close-confirmation');
    await expect(element(by.text('Save to Deep focus →'))).toBeVisible();
    await tap('close-collection');
    await closed('close-collection');
    await expect(element(by.id('saved-collection'))).toHaveText(
      '✓ Orbit saved to Deep focus'
    );
  });

  it('dismisses all three layers and can reopen the flow', async () => {
    await tap('jump-layers');
    await tap('open-collection');
    await tap('open-confirmation');
    await tap('confirm-save');
    await tap('close-all-layers');
    await closed('close-all-layers');
    await closed('close-confirmation');
    await closed('close-collection');
    await tap('open-collection');
    await tap('close-collection');
  });

  it('previews a transition and dismisses it with a gesture', async () => {
    await tap('jump-motion');
    await waitFor(element(by.id('open-motion-preview')))
      .toBeVisible()
      .whileElement(by.id('showcase-scroll'))
      .scroll(200, 'down');
    await tap('open-motion-preview');
    await element(by.id('motion-preview')).swipe('down', 'fast', 0.8);
    await closed('motion-preview');
    await tap('open-motion-preview');
    await tap('close-motion-preview');
    await closed('motion-preview');
  });
});
