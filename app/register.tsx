import { registerUser } from "@/api/auth";
import { saveUser } from "@/api/database";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Separator from "@/components/separator";
import { useStorageState } from "@/hooks/useStorageState";
import { setCurrentUser } from "@/redux/global/current-user";
import { AppUserBuilder } from "@/types/entities/AppUser";
import { ProfileBuilder } from "@/types/entities/profile";
import { Role } from "@/types/utils.types";
import { UserSchema } from "@/zod-schemas/schemas";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ColorSchemeName, Image, Text, useColorScheme, View } from 'react-native';
import { useDispatch } from "react-redux";
import { ZodIssue } from "zod";

function BgImageComponent() {
  const theme: ColorSchemeName = useColorScheme();
  return <Image source={theme === "dark" ? BgImageDark : BgImageLight} style={{ width: '100%', height: 300 }} />;
}
export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [userId, setUserId] = useStorageState<string>("userID", "");
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const isValid = () => {
    return errors.size === 0 && (userDetails.firstName && userDetails.lastName && userDetails.phoneNumber && userDetails.email && userDetails.password && userDetails.confirmPassword);
  }
  const validateFormData = () => {
    try {
      setErrors(new Map());
      const userDetailsClone = UserSchema.parse(userDetails);
    } catch (e: any) {
      const errorsMap: Map<string, string> = new Map();
      e.errors.forEach((error: ZodIssue) => {
        errorsMap.set(`${error.path[0]}`, `${error.path[0]} ${error.message}`);
      });
      setErrors(errorsMap);
    }
  }
  const updateField = (key: string, value: string) => {
    setError(null);
    setUserDetails((prev) => ({ ...prev, [key]: value }));
  }

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const userProfile = ProfileBuilder
        .builder()
        .setFirstName(userDetails.firstName)
        .setLastName(userDetails.lastName)
        .setPhoneNumber(userDetails.phoneNumber)
        .build();
      const authUser = await registerUser(userDetails.email.trim(), userDetails.password.trim());

      if (!authUser) {
        throw new Error("An error occurred while creating your account");
      }

      const user = AppUserBuilder
        .builder()
        .setAuthUserId(authUser.uid)
        .setProfile(userProfile)
        .setRole(Role.USER)
        .build();
      const savedUser = await saveUser(user);
      setUserId(savedUser.id as string);
      dispatch(setCurrentUser(savedUser));
      router.push("/home");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }
  useEffect(() => {
    if (userDetails.firstName || userDetails.lastName || userDetails.phoneNumber || userDetails.email || userDetails.password || userDetails.confirmPassword) {
      validateFormData();
    }
  }, [userDetails]);
  return (
    <ParallaxScrollView
      HEADER_HEIGHT={300}
      headerImage={<BgImageComponent />}
      className="bg-background"
      contentContainerClassName="bg-background"
    >
      <View className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <Text className="text-2xl font-bold text-center text-foreground mb-8">
          Join Our Community
        </Text>
        {error &&
          <Text className="text-2xl font-bold text-center p-4 rounded-lg bg-red-600 text-white">{error}</Text>
        }
        <View className="flex gap-4 mt-4">
          <Input className="rounded" error={errors.get("firstName")} onChangeText={(text) => updateField("firstName", text)} inputClasses="text-foreground" placeholder="first name" placeholderTextColor="gray" />
          <Input className="rounded" error={errors.get("lastName")} onChangeText={(text) => updateField("lastName", text)} placeholder="last name" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="rounded" error={errors.get("phoneNumber")} onChangeText={(text) => updateField("phoneNumber", text)} placeholder="phone number" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="rounded" error={errors.get("email")} onChangeText={(text) => updateField("email", text)} placeholder="email" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="rounded" error={errors.get("password")} onChangeText={(text) => updateField("password", text)} placeholder="password" inputClasses="text-foreground" placeholderTextColor="gray" />
          <Input className="rounded" error={errors.get("confirmPassword")} onChangeText={(text) => updateField("confirmPassword", text)} placeholder="confirm password" inputClasses="text-foreground" placeholderTextColor="gray" />
        </View>
        <View className="mt-4 ">
          <AppButton
            disabled={!isValid()}
            variant="primary"
            loading={loading}
            onPress={handleCreateUser}
          >Create New Account</AppButton>
        </View>
        <Separator text="Or" />
        <View className="flex flex-row items-center justify-center mt-8 gap-2">
          <Text className="text-center text-gray-500 dark:text-white text-xl">Already have an account? </Text>
          <Link href="/login" className="text-primary font-bold text-xl">Sign In</Link>
        </View>
      </View>
    </ParallaxScrollView >
  );
}
