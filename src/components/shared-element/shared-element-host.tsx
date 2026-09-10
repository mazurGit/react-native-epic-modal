import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { SharedElementHostContext } from '../../context/shared-element-host-context';

export interface SharedElementHostProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

/** Provides the native ancestor tag used by shared-element measurements. */
export const SharedElementHost = forwardRef<
  View,
  PropsWithChildren<SharedElementHostProps>
>(({ children, style, ...viewProps }, forwardedRef) => {
  const hostRef = useRef<View>(null);
  const [hostTag, setHostTag] = useState<number | null>(null);

  useLayoutEffect(() => {
    const tag = findNodeHandle(hostRef.current);
    if (tag !== null) {
      setHostTag(tag);
    }
  }, []);

  const handleHostRef = useCallback(
    (node: View | null) => {
      hostRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  return (
    <SharedElementHostContext.Provider value={hostTag}>
      <View
        ref={handleHostRef}
        style={[StyleSheet.absoluteFill, style]}
        {...viewProps}
      >
        {children}
      </View>
    </SharedElementHostContext.Provider>
  );
});

SharedElementHost.displayName = 'SharedElementHost';
