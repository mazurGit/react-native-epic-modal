describe('Photo gallery', () => {
  const tap = async (id) => {
    await waitFor(element(by.id(id)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(id)).tap();
  };
  const close = async () => {
    await tap('gallery-close');
    await waitFor(element(by.id('gallery-close')))
      .not.toExist()
      .withTimeout(5000);
  };

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await tap('tab-gallery');
  });

  it('repeatedly opens every photo and returns to the grid', async () => {
    for (let pass = 0; pass < 2; pass++) {
      for (const id of ['forest', 'mountains', 'coast', 'canopy']) {
        await tap(`gallery-open-${id}`);
        await waitFor(element(by.id('gallery-close')))
          .toBeVisible()
          .withTimeout(3000);
        await device.takeScreenshot(`gallery-${pass}-${id}`);
        await close();
      }
    }
  });

  it('browses forward and back, closes, and reopens both source photos', async () => {
    await tap('gallery-open-forest');
    await tap('gallery-next');
    await tap('gallery-previous');
    await tap('gallery-next');
    await close();
    for (const id of ['forest', 'mountains']) {
      await tap(`gallery-open-${id}`);
      await close();
    }
  });
});
