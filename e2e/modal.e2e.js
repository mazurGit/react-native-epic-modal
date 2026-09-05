describe('Epic Modal', () => {
  const expectModalToClose = async (modalText) => {
    await waitFor(element(by.text(modalText)))
      .not.toBeVisible()
      .withTimeout(5000);
  };

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('opens and closes a modal', async () => {
    await element(by.id('open-basic-modal')).tap();
    await expect(element(by.text('Basic Modal'))).toBeVisible();

    await element(by.id('close-basic-modal')).tap();
    await expectModalToClose('Basic Modal');
  });

  it('closes only the top modal in a stack', async () => {
    await element(by.id('open-stacked-modals')).tap();
    await expect(
      element(by.text('Third Stacked Modal (Priority 3)'))
    ).toBeVisible();

    await element(by.id('close-stacked-third')).tap();
    await expectModalToClose('Third Stacked Modal (Priority 3)');
    await expect(
      element(by.text('Second Stacked Modal (Priority 2)'))
    ).toBeVisible();
  });

  it('accepts repeated close taps during the exit animation', async () => {
    await element(by.id('open-basic-modal')).tap();
    await element(by.id('close-basic-modal')).multiTap(3);
    await expectModalToClose('Basic Modal');
  });

  it('calls lifecycle callbacks once per presentation', async () => {
    await expect(element(by.id('enter-count'))).toHaveText('Enter count: 0');
    await expect(element(by.id('dismiss-count'))).toHaveText(
      'Dismiss count: 0'
    );

    await element(by.id('open-basic-modal')).tap();
    await expect(element(by.id('enter-count'))).toHaveText('Enter count: 1');

    await element(by.id('close-basic-modal')).multiTap(3);
    await expectModalToClose('Basic Modal');
    await expect(element(by.id('dismiss-count'))).toHaveText(
      'Dismiss count: 1'
    );
  });

  it('dismisses a vertical modal by swiping down', async () => {
    await element(by.id('open-vertical-modal')).tap();
    await expect(element(by.text('Swipe down to dismiss'))).toBeVisible();

    await element(by.text('Swipe down to dismiss')).swipe('down', 'fast', 0.8);
    await expectModalToClose('Swipe down to dismiss');
  });
});
