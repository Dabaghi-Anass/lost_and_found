// import { loginUser, loginUserWithGoogle } from "@/api/auth";
import { loginUser } from "@/api/auth";
import { getUserByAuthUserId } from "@/api/database";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import bgPattern from "@/assets/images/pattern.jpg";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SEO from "@/components/seo";
import Separator from '@/components/separator';
import { setCurrentUser } from "@/redux/global/current-user";
import { setCurrentScreenName } from "@/redux/global/currentScreenName";
import * as Linking from 'expo-linking';
import { Link, SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { ColorSchemeName, Image, Platform, Text, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
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
  const currentUser = useSelector((state: any) => state.user);
  const { url: initialUrl } = useSelector((state: any) => state.initialUrl);
  const isValid = (): boolean => {
    if (userName.length === 0 || password.length === 0) return false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(userName);
  }


  SplashScreen.preventAutoHideAsync().catch(() => {
    console.log("Error preventing auto hide");
  });

  async function handleLogin() {
    setLoading(true);
    if (!isValid()) {
      setLoading(false);
      return;
    };
    try {
      const user: User | undefined = await loginUser(userName, password);
      if (!user) {
        setError("Invalid Email Or Password");
      } else {
        setError(null);
        const userDocument = await getUserByAuthUserId(user?.uid);
        dispatch(setCurrentUser(userDocument));
        setUserName("");
        setPassword("");
        setLoading(false);
        if (Platform.OS === "web") window.location.reload();
        else router.replace("/home");
      }
    } catch (e: any) {
      Toast.error("Error occured please try again later", "bottom");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setError(null);
  }, [userName, password]);
  useEffect(() => {
    dispatch(setCurrentScreenName("auth"));
  }, [userName]);
  useFocusEffect(useCallback(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      const url = initialUrl;
      if (url) {
        const { path } = Linking.parse(url);
        if (path) {
          router.replace(`/${path}` as any);
        } else {
          setTimeout(() => {
            router.replace("/items");
          }, 0)
        }
      } else {
        setTimeout(() => {
          router.replace("/items");
        }, 0)
      }
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 10)
    } else {
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 10)
    }
  }, [currentUser]))
  return (
    <View className="h-screen w-full md:web:flex-row bg-background">
      <ParallaxScrollView
        HEADER_HEIGHT={300}
        headerImage={<BgImageComponent />}
        className="bg-background w-full web:max-w-screen-sm h-full web:m-auto"
        contentContainerClassName="bg-background"
      >
        <View className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <SEO />
          <Text className="text-2xl font-bold text-center mb-8 text-foreground">
            Identify Yourself To Continue
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
              secureTextEntry
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
      {Platform.OS === "web" &&
        <View className="w-0 lg:w-2/3 lg:h-full bg-background">
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto max-h-[100vh] web:max-h-[100%]' />
        </View>
      }
    </View>
  );
}
