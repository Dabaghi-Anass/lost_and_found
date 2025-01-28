import { registerUser } from "@/api/auth";
import { uploadAsset } from "@/api/cloudinary";
import { saveUser } from "@/api/database";
import BgImageDark from "@/assets/images/bg_auth_dark.png";
import BgImageLight from "@/assets/images/bg_auth_light.png";
import DefaultUserImage from "@/assets/images/default-user-image.jpg";
import bgPattern from "@/assets/images/pattern.jpg";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/Input";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SEO from "@/components/seo";
import Separator from "@/components/separator";
import { getImageOrDefaultTo } from "@/lib/utils";
import { setCurrentUser } from "@/redux/global/current-user";
import { setCurrentScreenName } from "@/redux/global/currentScreenName";
import { AppUserBuilder } from "@/types/entities/AppUser";
import { ProfileBuilder } from "@/types/entities/profile";
import { Role } from "@/types/utils.types";
import { UserSchema } from "@/zod-schemas/schemas";
import * as ImagePicker from 'expo-image-picker';
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ColorSchemeName, Image, Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
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

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [userImage, setUserImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const currentUser = useSelector((state: any) => state.user);
  const isValid = () => {
    return errors.size === 0 && (userDetails.firstName && userDetails.lastName && userDetails.phoneNumber && userDetails.email && userDetails.password && userDetails.confirmPassword);
  }
  const validateFormData = () => {
    try {
      setErrors(new Map());
      UserSchema.parse(userDetails);
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
      let userImageFromServer = null;
      if (userImage) {
        userImageFromServer = await uploadAsset(userImage);

      }
      const userProfile = ProfileBuilder
        .builder()
        .setFirstName(userDetails.firstName)
        .setLastName(userDetails.lastName)
        .setPhoneNumber(userDetails.phoneNumber)
        .setImageUri(userImageFromServer)
        .build();
      const authUser = await registerUser(userDetails.email.trim(), userDetails.password.trim());

      if (!authUser) {
        throw new Error("An error occurred while creating your account");
      }

      const user = AppUserBuilder
        .builder()
        .setAuthUserId(authUser.uid)
        .setEmail(userDetails.email)
        .setProfile(userProfile)
        .setRole(Role.USER)
        .build();
      const savedUser = await saveUser(user);
      dispatch(setCurrentUser(savedUser));
      reset()
      setTimeout(() => {
        router.push("/profile/" + savedUser?.id as any);
      }, 10)
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }
  function reset() {
    setUserDetails({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserImage(result.assets[0]);
    }
  };
  useEffect(() => {
    if (userDetails.firstName || userDetails.lastName || userDetails.phoneNumber || userDetails.email || userDetails.password || userDetails.confirmPassword) {
      validateFormData();
    }
  }, [userDetails]);
  useEffect(() => {
    dispatch(setCurrentScreenName("auth"));
  }, [userDetails]);

  useFocusEffect(useCallback(() => {
    if (currentUser && Object.keys(currentUser).length > 0) router.replace("/items");
  }, [currentUser]))
  return (
    <View className="h-screen w-full md:web:flex-row bg-background">
      <ParallaxScrollView
        HEADER_HEIGHT={300}
        headerImage={<BgImageComponent />}
        className="bg-background w-full h-full web:max-w-screen-md web:m-auto "
        contentContainerClassName="bg-background"
      >
        <SEO />
        {currentScreen === 0 ?
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
              <Input className="rounded" error={errors.get("password")} onChangeText={(text) => updateField("password", text)} placeholder="password" inputClasses="text-foreground" placeholderTextColor="gray" secureTextEntry />
              <Input className="rounded" error={errors.get("confirmPassword")} onChangeText={(text) => updateField("confirmPassword", text)} placeholder="confirm password" inputClasses="text-foreground" placeholderTextColor="gray" secureTextEntry />
            </View>
            <View className="mt-4 ">
              <AppButton
                disabled={!isValid()}
                variant="primary"
                loading={loading}
                onPress={() => setCurrentScreen(1)}
              >Create New Account</AppButton>
            </View>
            <Separator text="Or" />
            <View className="flex flex-row items-center justify-center mt-8 gap-2">
              <Text className="text-center text-gray-500 dark:text-white text-xl">Already have an account? </Text>
              <Link href="/login" className="text-primary font-bold text-xl">Sign In</Link>
            </View>
          </View> :
          <View style={styles.container} className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {userImage && (
              <Image source={getImageOrDefaultTo(userImage.uri, DefaultUserImage)} style={styles.image} />
            )}
            <View className="flex gap-4 mt-4">
              <AppButton
                loading={loading}
                onPress={() => {
                  setUserImage(null);
                  handleCreateUser();
                }}
                variant="secondary"
                size="sm"
              >
                <Text>Skip</Text>
              </AppButton>
              <AppButton
                loading={loading}
                variant="secondary"
                onPress={pickImage}
              >
                <Text className="text-lg">Pick Image From Gallery</Text>
              </AppButton>
              {userImage &&
                <AppButton
                  loading={loading}
                  onPress={handleCreateUser}
                  variant="primary"
                >
                  Submit
                </AppButton>
              }

            </View>
          </View>
        }
      </ParallaxScrollView>
      {Platform.OS === "web" &&
        <View className="w-0 lg:w-2/3 lg:h-full bg-background">
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto max-h-[100vh] web:max-h-[100%]' />
        </View>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

