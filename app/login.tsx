// import { loginUser, loginUserWithGoogle } from "@/api/auth";
import { getUserByAuthUserId, getUserById, loginUser } from "@/api/auth";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Separator from '@/components/separator';
import { useStorageState } from "@/hooks/useStorageState";
import { setCurrentUser } from "@/redux/global/current-user";
// import { auth } from "@/database/fire_base";
// import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { Link, useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ColorSchemeName, Image, Text, useColorScheme, View } from "react-native";
import { useDispatch } from "react-redux";
function BgImageComponent() {
  const theme: ColorSchemeName = useColorScheme();
  return <Image source={theme === "dark" ? BgImageDark : BgImageLight} style={{ width: '100%', height: 300 }} />;
}
export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useStorageState("userID", "");
  const isValid = (): boolean => {
    if (userName.length === 0 || password.length === 0) return false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(userName);
  }

  async function handleLogin() {
    setLoading(true);
    if (!isValid()) {
      setLoading(false);
      return;
    };
    const user: User | undefined = await loginUser(userName, password);
    if (!user) {
      setError("Invalid Email Or Password");
    } else {
      setError(null);
      setUserId(user.uid);
      dispatch(setCurrentUser(getUserByAuthUserId(user.uid)));
      setLoading(false);
      router.push("/home");
    }
    setLoading(false);
  }
  const initUser = async () => {
    const user = await getUserById(userId);
    if (user) {
      dispatch(setCurrentUser(user));
      router.push("/home");
    }
  }
  useEffect(() => {
    setError(null);
  }, [userName, password]);
  useEffect(() => {
    initUser()
  }, []);
  return (
    <ParallaxScrollView
      HEADER_HEIGHT={300}
      headerImage={<BgImageComponent />}
      className="bg-background"
      contentContainerClassName="bg-background"
    >
      <View className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <Text className="text-2xl font-bold text-center mb-8 text-foreground">
          Who Are You Sweet Heart?
        </Text>
        {error &&
          <Text className="text-2xl font-bold text-center p-4 rounded-lg bg-red-600 text-white">{error}</Text>
        }
        <View className="flex gap-4 mt-4 ">
          <Input placeholder="email or phone number"
            value={userName}
            onChangeText={setUserName}
            className="rounded"
            inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input placeholder="password"
            value={password}
            onChangeText={setPassword}
            className="rounded"
            inputClasses="text-foreground" placeholderTextColor="gray" />
        </View>
        <View className="mt-4">
          <AppButton
            loading={loading}
            disabled={!isValid()}
            onPress={handleLogin} variant="primary">Login</AppButton>
        </View>
        <Separator text="Or" />
        <View className="flex flex-row items-center justify-center mt-8">
          <Text className="text-center text-gray-500 dark:text-white text-xl">Don't have an account? </Text>
          <Link href="/register" className="text-primary font-bold text-xl">Sign Up</Link>
        </View>
      </View>
    </ParallaxScrollView>
  );
}
