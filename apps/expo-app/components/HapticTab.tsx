import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import {PlatformPressable} from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import {Platform} from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={async (ev) => {
        if (Platform.OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {
            throw new Error('Failed to perform haptic feedback');
          }
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
