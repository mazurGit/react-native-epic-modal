jest.mock('react-native-reanimated', () => ({
  interpolate: (value: number, input: number[], output: number[]) =>
    output[0]! +
    ((value - input[0]!) / (input[1]! - input[0]!)) * (output[1]! - output[0]!),
}));

import { getAnimationConfig } from './utils';

describe('getAnimationConfig', () => {
  const progress = { value: 0.5 } as never;

  it('uses the measured height for a vertical slide', () => {
    const styles = getAnimationConfig(progress, 'vertical', 390, 844);

    expect(styles.slide).toEqual({
      transform: [{ translateY: 422 }],
    });
  });

  it('uses the measured width for a horizontal slide', () => {
    const styles = getAnimationConfig(progress, 'horizontal', 390, 844);

    expect(styles.slide).toEqual({
      transform: [{ translateX: 195 }],
    });
  });

  it('maps progress to fade and zoom styles', () => {
    const styles = getAnimationConfig(progress, 'horizontal', 390, 844);

    expect(styles.fade).toEqual({ opacity: 0.5 });
    expect(styles.zoom).toEqual({
      transform: [{ scale: 0.5 }],
      opacity: 0.5,
    });
  });
});
