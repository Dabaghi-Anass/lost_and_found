// import { loginUser, loginUserWithGoogle } from "@/api/auth";
import GoogleIcon from "@/assets/icons/Google.png";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Separator from '@/components/separator';
// import { auth } from "@/database/fire_base";
// import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ColorSchemeName, Image, Text, useColorScheme, View } from "react-native";
function BgImageComponent() {
  const theme: ColorSchemeName = useColorScheme();
  return <Image source={theme === "dark" ? BgImageDark : BgImageLight} style={{ width: '100%', height: 300 }} />;
}
export default function LoginScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("anass.debbaghi123@gmail.com");
  const [password, setPassword] = useState<string>("Anassking1");

  const isValid = (): boolean => {
    if (userName.length === 0 || password.length === 0) return false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(userName);
  }

  async function handleLogin() {
    // if (!isValid()) return;
    // const user: User | undefined = await loginUser(userName, password);
    // if (!user) {
    //   alert("Invalid credentials");
    // } else {
    //   router.push("/home");
    // }
  }
  async function handleGoogleLogin() {
    // const user: User | undefined = await loginUserWithGoogle();
    // if (!user) {
    //   alert("Invalid credentials");
    // } else {
    //   router.push("/home");
    // }
  }

  // async function testGoogleSignIn() {
  //   await GoogleSignin.hasPlayServices();
  //   const userInfo = await GoogleSignin.signIn();
  //   console.log(userInfo);
  // }
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: "1084224482940-0tca57vop8urajama857sq3bgedjkctg.apps.googleusercontent.com"
  //   });
  // }, [])

  return (
    <ParallaxScrollView
      HEADER_HEIGHT={300}
      headerImage={<BgImageComponent />}
      className="bg-background"
      contentContainerClassName="bg-background"
    >
      <View>
        <Text className="text-2xl font-bold text-center mb-8 text-foreground">
          Who Are You Sweet Heart?
        </Text>
        <Text className="text-2xl font-bold text-center mb-8 text-foreground">
          {userName + "\n"}
          {password}
        </Text>
        <View className="flex gap-4 mt-4 ">
          <Input placeholder="email or phone number"
            value={userName}
            onChangeText={setUserName}
            className="border border-foreground rounded"
            inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input placeholder="password"
            value={password}
            onChangeText={setPassword}
            className="border border-foreground rounded"
            inputClasses="text-foreground" placeholderTextColor="gray" />
        </View>
        <View className="mt-4">
          <AppButton
            disabled={!isValid()}
            onPress={handleLogin} variant="primary">Login</AppButton>
        </View>
        <Separator text="Or" />
        <View className="gap-4">
          <AppButton variant="outline" className="rounded-full flex flex-row gap-4 outline-btn" onPress={handleGoogleLogin}>
            <Image source={GoogleIcon} width={40} height={40} />
            <Text className="text-foreground">Continue With Google</Text>
          </AppButton>
        </View>
        <View className="flex flex-row items-center justify-center mt-8">
          <Text className="text-center text-gray-500 dark:text-white text-xl">Don't have an account? </Text>
          <Link href="/register" className="text-primary font-bold text-xl">Sign Up</Link>
        </View>
      </View>
    </ParallaxScrollView>
  );
}
