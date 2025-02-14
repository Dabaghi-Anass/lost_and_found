import { logoutUser } from '@/api/auth';
import { uploadAsset } from '@/api/cloudinary';
import { deleteAccount, updateProfile } from '@/api/database';
import DefaultUserImage from '@/assets/images/default-user-image.jpg';
import bgPattern from "@/assets/images/pattern.jpg";
import { AppButton } from '@/components/AppButton';
import { Input } from '@/components/Input';
import SEO from '@/components/seo';
import { Badge } from '@/components/ui/badge';
import BottomModal from '@/components/ui/bottomModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { auth } from '@/database/fire_base';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePushScreen } from '@/hooks/usePushScreen';
import { getImageOrDefaultTo } from '@/lib/utils';
import { setCurrentUser } from '@/redux/global/current-user';
import { Profile } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';
export default function UserProfileEditPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state.user);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const theme = useColorScheme();
  const [userData, setUserData] = useState<Profile | undefined>()
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | undefined>();
  usePushScreen("edit-profile")

  function updateUserData(key: string, value: string) {
    setUserData({
      ...userData,
      [key]: value
    } as any)
  }

  async function handleUpdateProfile() {
    setLoading(true);
    try {
      let imageUri = currentUser?.profile?.imageUri;
      if (imageAsset) {
        imageUri = await uploadAsset(imageAsset);
      }
      if (!userData?.imageUri || userData?.imageUri?.length === 0) {
        imageUri = "";
      }
      const newUserData = { ...userData, imageUri }
      const newProfile = await updateProfile(currentUser?.profileId, newUserData as Profile);
      const cuClone = { ...currentUser } as any;
      cuClone.profile = newProfile;
      dispatch(setCurrentUser(cuClone as any));
    } catch (e: any) {
      Toast.error("Error occured please try again later", "bottom");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setLoading(true);
    try {
      await deleteAccount(currentUser);
    } catch (e: any) {
      Toast.error("Error occured please try again later", "bottom");
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.replace("/login")
      }, 10)
    }
  }
  async function handleUploadImageFromStorage() {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1]
    });
    if (!image.canceled) {
      setImageAsset(image.assets?.[0]);
      updateUserData('imageUri', image.assets?.[0].uri);
    }
  }
  async function handleUploadImageFromCamera() {
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1]
    });
    if (!image.canceled) {
      setImageAsset(image.assets?.[0]);
      updateUserData('imageUri', image.assets?.[0].uri);
    }
  }
  const initUserData = useCallback(() => {
    setUserData(currentUser?.profile)
  }, [currentUser?.profile])
  React.useEffect(() => {
    initUserData()
  }, [currentUser?.profile])
  useFocusEffect(initUserData)
  useFocusEffect(useCallback(() => {
    if (currentUser === null || Object.keys(currentUser).length === 0) router.push("/login");
  }, [currentUser]))
  const user = currentUser;
  if (!currentUser || loading) return <LoadingSpinner visible={true} />
  return (
    <ScrollView className='h-full w-full bg-background'>
      <SEO />
      <View className='w-full h-full md:web:flex-row'>
        <View className='bg-transparent flex items-center justify-center py-16 px-4 relative md:web:w-1/3 md:web:h-full' >
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto max-h-[100vh]' />
          <Image
            source={getImageOrDefaultTo(userData?.imageUri, DefaultUserImage)}
            className='w-32 h-32 rounded-full border-4 border-white scale-110 md:web:scale-150 md:web:mb-8'
          />
          <View className='flex-row gap-4 mt-4'>
            <AppButton
              className='border-2 border-primary'
              variant="secondary" onPress={handleUploadImageFromStorage}>
              <Text className='text-secondary'>From Storage</Text>
            </AppButton>
            {Platform.OS !== 'web' &&
              <AppButton
                className='border-2 border-primary'
                variant="secondary" onPress={handleUploadImageFromCamera}>
                <Text className='text-secondary'>From Camera</Text>
              </AppButton>
            }
            <AppButton
              variant="destructive"
              onPress={() => updateUserData('imageUri', '')}>
              <Text className='text-white'>Remove Image</Text>
            </AppButton>
          </View>
        </View>
        <View className='bg-background min-h-full native:rounded-t-3xl p-4 md:web:w-2/3 w-full web:m-auto'>
          <View className='flex-row w-min items-center justify-between'>
            <Text className='text-foreground text-4xl font-bold font-secondary capitalize max-w-sm web:w-[300px]'>{userData?.firstName} {userData?.lastName}</Text>
            <View className='p-2 gap-4 flex-row items-center justify-center'>
              <Badge variant="secondary">
                <Text className='text-secondary-foreground capitalize'>{user?.role}</Text>
              </Badge>
            </View>
          </View>

          <View className='items-start justify-center gap-8 m-5'>
            <Text className="text-foreground text-2xl font-semibold">Contact Information</Text>
            <View className='items-start justify-center gap-4 web:w-full'>
              <View className='flex-row items-center justify-center gap-4 web:w-full'>
                <Feather name="mail" size={20} color={theme === "dark" ? "white" : "black"} />
                <Input editable={false}
                  placeholder='email' placeholderTextColor={
                    theme === "dark" ? "#ddd" : "#444"
                  }
                  style={{
                    color: theme === "dark" ? "#fff" : "#222"
                  }}
                  className="text-foreground text-xl w-full opacity-50"
                  defaultValue={currentUser?.email || ""} />
              </View>
              <View className='flex-row items-center justify-center gap-4 web:w-full'>
                <FontAwesome name="vcard" size={20} color={theme === "dark" ? "white" : "black"} />
                <Input
                  style={{
                    color: theme === "dark" ? "#fff" : "#222"
                  }}
                  onChangeText={(text) => updateUserData("firstName", text)}
                  placeholder='first name' placeholderTextColor={
                    theme === "dark" ? "#ddd" : "#444"
                  } className="text-foreground text-xl w-full" defaultValue={userData?.firstName || ""} />
              </View>
              <View className='flex-row items-center justify-center gap-4 web:w-full'>
                <FontAwesome name="vcard-o" size={20} color={theme === "dark" ? "white" : "black"} />
                <Input
                  style={{
                    color: theme === "dark" ? "#fff" : "#222"
                  }}
                  onChangeText={(text) => updateUserData("lastName", text)}
                  placeholder='last name' placeholderTextColor={
                    theme === "dark" ? "#ddd" : "#444"
                  } className="text-foreground text-xl w-full" defaultValue={userData?.lastName || ""} />
              </View>
              <View className='flex-row items-center justify-center gap-4 web:w-full'>
                <Feather name="phone" size={20} color={theme === "dark" ? "white" : "black"} />
                <Input
                  style={{
                    color: theme === "dark" ? "#fff" : "#222"
                  }}
                  onChangeText={(text) => updateUserData("phoneNumber", text)}
                  placeholder='phone number' placeholderTextColor={
                    theme === "dark" ? "#ddd" : "#444"
                  } className="text-foreground text-xl w-full" defaultValue={userData?.phoneNumber || ""} />
              </View>
            </View>
          </View>

          <AppButton
            size="lg"
            variant="primary"
            className='gap-4'
            onPress={() => {
              handleUpdateProfile();
              setConfirmationModalVisible(false);
            }}>
            <Text className='text-primary-foreground text-xl'>Submit</Text>
            <AntDesign name="save" size={20} color="white" />
          </AppButton>
          <View className='flex flex-row items-center justify-center py-8 px-4 gap-4'>
            <BottomModal
              title='Are you sure you want to delete your account?'
              visible={confirmationModalVisible}
              onClose={() => setConfirmationModalVisible(false)}>
              <View className='flex-row h-full items-center justify-center gap-4'>
                <AppButton variant="secondary" className='gap-4 border border-muted' onPress={() => setConfirmationModalVisible(false)}>
                  <Text className=' text-slate-800'>Cancel</Text>
                  <AntDesign name="close" size={20} color="black" />
                </AppButton>
                <AppButton variant="destructive" className='gap-4' onPress={async () => {
                  try {
                    if (auth.currentUser) {
                      handleDeleteAccount();
                    } else {
                      Toast.warn("You are not logged in please login and try again", "bottom");
                      await logoutUser()
                      setTimeout(() => {
                        router.replace("/login")
                      }, 10)
                    }
                  } catch (e: any) {
                    Toast.error("Error occured please try again later", "bottom");
                  } finally {
                    setConfirmationModalVisible(false);
                  }
                }}>
                  <Text className='text-white text-xl'>Delete Account</Text>
                </AppButton>
              </View>
            </BottomModal>
            <AppButton variant="destructive" className='gap-4' onPress={() => setConfirmationModalVisible(true)}>
              <Text className='text-white text-xl'>Delete Account</Text>
              <AntDesign name="deleteuser" size={20} color="white" />
            </AppButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}