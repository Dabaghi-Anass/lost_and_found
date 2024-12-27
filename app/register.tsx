import FacebookIcon from "@/assets/icons/Facebook.png";
import GoogleIcon from "@/assets/icons/Google.png";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Separator from "@/components/separator";
import { Link } from "expo-router";
import { ColorSchemeName, Image, Text, useColorScheme, View } from 'react-native';

function BgImageComponent() {
  const theme: ColorSchemeName = useColorScheme();
  return <Image source={theme === "dark" ? BgImageDark : BgImageLight} style={{ width: '100%', height: 300 }} />;
}
export default function LoginScreen() {
  return (
    <ParallaxScrollView
      HEADER_HEIGHT={300}
      headerImage={<BgImageComponent />}
      className="bg-background"
      contentContainerClassName="bg-background"
    >
      <View>
        <Text className="text-2xl font-bold text-center text-foreground mb-8">
          Join Our Community
        </Text>
        <View className="flex gap-4 mt-4">
          <Input className="border border-foreground rounded" inputClasses="text-foreground" placeholder="first name" placeholderTextColor="gray" />
          <Input className="border border-foreground rounded" placeholder="last name" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="border border-foreground rounded" placeholder="phone number" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="border border-foreground rounded" placeholder="email" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="border border-foreground rounded" placeholder="password" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="border border-foreground rounded" placeholder="confirm password" inputClasses="text-foreground" placeholderTextColor="gray" />
        </View>
        <View className="mt-4 ">
          <AppButton disabled={true} variant="primary">Create New Account</AppButton>
        </View>
        <Separator text="Or" />
        <View className="gap-4">
          <AppButton variant="outline" className="rounded-full flex flex-row gap-4 outline-btn">
            <Image source={GoogleIcon} width={40} height={40} />
            <Text className="text-foreground">Continue With Google</Text>
          </AppButton>
          <AppButton variant="outline" className="rounded-full flex flex-row gap-4 outline-btn">
            <Image source={FacebookIcon} width={40} height={40} />
            <Text className="text-foreground">Continue With Facebook</Text>
          </AppButton>
        </View>
        <View className="flex flex-row items-center justify-center mt-8 gap-2">
          <Text className="text-center text-gray-500 dark:text-white text-xl">Already have an account? </Text>
          <Link href="/login" className="text-primary font-bold text-xl">Sign In</Link>
        </View>
      </View>
    </ParallaxScrollView >
  );
}
