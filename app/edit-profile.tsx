import { uploadAsset } from '@/api/cloudinary';
import { updateProfile } from '@/api/database';
import DefaultUserImage from '@/assets/images/default-user-image.jpg';
import bgPattern from "@/assets/images/pattern.png";
import { AppButton } from '@/components/AppButton';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { Input } from '@/components/Input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getImageOrDefaultTo } from '@/lib/utils';
import { setCurrentUser } from '@/redux/global/current-user';
import { AppUser, Profile } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
export default function UserProfileEditPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state.user);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const theme = useColorScheme();
  const [userData, setUserData] = useState<Profile | undefined>()
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | undefined>();
  function openConfirmationModal() {
    setConfirmationModalVisible(true);
  }

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
      const newProfile = await updateProfile(currentUser.profileId, newUserData as Profile);
      const cuClone = { ...currentUser } as any;
      cuClone.profile = newProfile;
      dispatch(setCurrentUser(cuClone as any));
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteAccount() {
    setLoading(true);
    try {
      Alert.alert('Error', 'Failed to delete account');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
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

  if (!currentUser || loading) return <LoadingSpinner visible={true} />
  return (
    <FlatList
      refreshing={loading}
      onRefresh={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }}
      keyExtractor={item => item.id || Math.random().toString()}
      data={[currentUser]}
      renderItem={({ item: user }: { item: AppUser }) => (<View className='w-full h-full'>
        <View className='bg-transparent flex items-center justify-center py-4 px-4 relative' >
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto' />
          <Image
            source={getImageOrDefaultTo(userData?.imageUri, DefaultUserImage)}
            className='w-32 h-32 rounded-full border-4 border-white'
          />
          <View className='flex-row gap-4 mt-4'>
            <AppButton
              className='border-2 border-primary'
              variant="secondary" onPress={handleUploadImageFromStorage}>
              <Text className='text-secondary'>From Storage</Text>
            </AppButton>
            <AppButton
              className='border-2 border-primary'
              variant="secondary" onPress={handleUploadImageFromCamera}>
              <Text className='text-secondary'>From Camera</Text>
            </AppButton>
            <AppButton
              variant="destructive"
              onPress={() => updateUserData('imageUri', '')}>
              <Text className='text-white'>Remove Image</Text>
            </AppButton>
          </View>
        </View>
        <View className='bg-background min-h-full rounded-t-3xl p-4'>
          <View className='flex-row w-min items-center justify-between'>
            <Text className='text-foreground text-4xl font-bold font-secondary capitalize max-w-sm web:w-[300px] text-center'>{userData?.firstName} {userData?.lastName}</Text>
            <View className='p-2 gap-4 flex-row items-center justify-center'>
              <Badge variant="secondary">
                <Text className='text-secondary-foreground capitalize'>{user?.role}</Text>
              </Badge>
            </View>
          </View>


          <View className='items-start justify-center gap-8 m-5'>
            <Text className="text-foreground text-2xl font-semibold">Contact Information</Text>
            <View className='items-start justify-center gap-4'>
              <View className='flex-row items-center justify-center gap-4'>
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
              <View className='flex-row items-center justify-center gap-4'>
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
              <View className='flex-row items-center justify-center gap-4'>
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
              <View className='flex-row items-center justify-center gap-4'>
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
            <ConfirmationModal
              title='Delete Account'
              description='Are you sure you want to delete your account?'
              onOpen={openConfirmationModal}
              trigger={(open) => <AppButton variant="destructive" className='gap-4' onPress={() => open?.()}>
                <Text className='text-white text-xl'>Delete Account</Text>
                <AntDesign name="deleteuser" size={20} color="white" />
              </AppButton>}
              open={confirmationModalVisible}
              onAccept={() => {
                handleDeleteAccount();
                setConfirmationModalVisible(false);
                router.replace('/login')
              }}
              onClose={() => {
                setConfirmationModalVisible(false);
              }}
            />
          </View>
        </View>
      </View>
      )} />
  );
}