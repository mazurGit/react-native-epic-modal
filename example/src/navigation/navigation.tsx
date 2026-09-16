import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../common/constants/colors.constants';
import { Gallery } from '../screens/gallery/gallery';
import { Showcase } from '../screens/screens';

type RootTabParamList = {
  Studio: undefined;
  Gallery: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

function StudioTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'options' : 'options-outline'}
      color={color}
      size={size}
    />
  );
}

function GalleryTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'images' : 'images-outline'}
      color={color}
      size={size}
    />
  );
}

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    border: colors.line,
    primary: colors.lime,
    text: colors.text,
  },
};

export function Navigation() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          tabBarActiveTintColor: colors.lime,
        }}
      >
        <Tab.Screen
          name="Studio"
          component={Showcase}
          options={{
            title: 'Interaction studio',
            tabBarButtonTestID: 'tab-studio',
            tabBarIcon: StudioTabIcon,
          }}
        />
        <Tab.Screen
          name="Gallery"
          component={Gallery}
          options={{
            title: 'Photo gallery',
            tabBarButtonTestID: 'tab-gallery',
            tabBarIcon: GalleryTabIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
