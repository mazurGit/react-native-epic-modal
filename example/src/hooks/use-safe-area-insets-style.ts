import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

export type ExtendedEdge = Edge | 'start' | 'end';

const propertySuffixMap: Record<ExtendedEdge, string> = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Start',
  right: 'End',
  start: 'Start',
  end: 'End',
};

const edgeInsetMap: Record<ExtendedEdge, Edge> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
};

export function useSafeAreaInsetsStyle(
  safeAreaEdges: readonly ExtendedEdge[] = [],
  property: 'padding' | 'margin' = 'padding'
) {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce<Record<string, number>>((styles, edge) => {
    const suffix = propertySuffixMap[edge];
    const inset = insets[edgeInsetMap[edge]];

    styles[`${property}${suffix}`] = inset;
    return styles;
  }, {});
}
