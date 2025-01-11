import Logo from "@/assets/images/app_logo_small.png";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Link, useNavigation, useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export default function NavBar() {
  const currentUser = useSelector((state: any) => state.user);
  const expoRouter = useRouter()
  const userShortName = `${currentUser?.profile?.firstName?.charAt(0) ?? "N"}${currentUser?.profile?.lastName?.charAt(0) ?? "A"}`;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const openOrCloseDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }
  const screenName = useSelector((state: any) => state.screenName);
  if (screenName === "auth") return null;
  return (
    <View className="p-4 border-b border-muted flex flex-row justify-between items-center bg-background w-full">
      {/*hamburger menu*/}
      <View className="flex-row items-center max-w-min max-h-min gap-4">
        <Pressable onPress={openOrCloseDrawer}>
          <AntDesign name="menu-fold" size={24} color={Colors[colorScheme].text} />
        </Pressable>
        <Link href="/home" className="flex-row place-items-end max-w-min max-h-min">
          <Image source={Logo} alt="lost and found" className="w-[50px] h-[25px] mt-1" />
        </Link>
      </View>
      <Text className="capitalize text-xl text-foreground font-bold">{screenName}</Text>
      <View className='flex-row items-center gap-4'>
        {
          navigation.canGoBack() &&
          <Pressable onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color={Colors[colorScheme].text} />
          </Pressable>
        }
        <Pressable onPress={() => expoRouter.push(`/profile/${currentUser?.id}`)}>
          <Avatar alt="user avatar">
            <AvatarImage source={{
              uri: currentUser.profile?.imageUri
            }} />
            <AvatarFallback className="text-foreground">
              <Text className="text-foreground">{userShortName}</Text>
            </AvatarFallback>
          </Avatar>
        </Pressable>
      </View>

    </View>
  );
}