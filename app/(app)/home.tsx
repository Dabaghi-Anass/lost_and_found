import Screen from "@/components/screen";
import { LinearGradient } from 'expo-linear-gradient';
import { RelativePathString, useRouter } from "expo-router";
import { Text, TouchableNativeFeedback } from "react-native";
import { useSelector } from "react-redux";


export default function HomeScreen() {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state.currentUser);
  console.log({ currentUser });
  return <Screen className="bg-background">
    <TouchableNativeFeedback onPress={() => {
      router.replace('/declare-item/lost' as RelativePathString);
    }}>
      <LinearGradient
        className="w-full flex items-center justify-center bg-accent h-1/2"
        colors={['#ffb554', '#ffe18f']}
      >
        <Text className="font-secondary text-accent-foreground text-4xl font-bold">I Have Lost An Item</Text>
      </LinearGradient>
    </TouchableNativeFeedback >
    <TouchableNativeFeedback onPress={() => {
      router.replace('/declare-item/found' as RelativePathString);
    }}>
      <LinearGradient
        className="w-full flex items-center justify-center bg-accent h-1/2"
        colors={['#a61cfc', '#370fff']}
      >
        <Text className="font-secondary text-primary-foreground text-4xl font-bold">I Have Found An Item</Text>
      </LinearGradient>
    </TouchableNativeFeedback>
  </Screen>
}
