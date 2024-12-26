import WheelImage from "@/assets/images/wheel.png";
import Screen from "@/components/screen";
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function RotatingWheel() {
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      rotation.value = 0;
    })
    .onUpdate((e) => {
      rotation.value = e.translationY;
    }).onEnd(() => {
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.Image source={WheelImage} style={[{
        width: 200,
        height: 200,
        top: 0,
      }, animatedStyles]} />
    </GestureDetector>
  );

}


function Ball() {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: Math.random(), y: Math.random() });
  const start = useSharedValue({ x: Math.random(), y: Math.random() });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? '#e3073b' : '#ff003c',
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );

}
export default function HomeScreen() {
  return <Screen>
    <GestureHandlerRootView>
      <View className="flex h-full">
        <Ball />
        <RotatingWheel />
      </View>
    </GestureHandlerRootView>
  </Screen>
}


const styles = StyleSheet.create({
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
});