import { useRouter } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NavBar() {
  const currentUser = useSelector((state: any) => state.user);
  const router = useRouter()
  const title = "Home";
  const userShortName = `${currentUser?.profile?.firstName?.charAt(0) ?? "N"}${currentUser?.profile?.lastName?.charAt(0) ?? "A"}`;

  return (
    <View className="p-4 border-b border-muted flex flex-row justify-between items-center bg-background">
      <View className="p-2 ">
        <Text className="text-foreground font-semibold text-xl">{title}</Text>
      </View>
      <TouchableNativeFeedback onPress={() => router.push(`/profile/${currentUser?.id}`)}>
        <Avatar alt="user avatar">
          <AvatarImage source={{
            uri: currentUser.profile?.imageUri
          }} />
          <AvatarFallback className="text-foreground">
            <Text className="text-foreground">{userShortName}</Text>
          </AvatarFallback>
        </Avatar>
      </TouchableNativeFeedback>
    </View>);
}