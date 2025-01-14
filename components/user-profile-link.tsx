import DefaultImage from "@/assets/images/default-user-image.jpg";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";
export function UserProfileLink() {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  if (!user?.profile) return <></>;
  return (
    <TouchableOpacity onPress={() => {
      router.push(`/profile/${user.id}`);
    }} className="w-full flex items-center justify-center p-8">
      <Image
        style={{
          width: 150,
          height: 150,
          borderRadius: 100,
        }}
        source={{ uri: user.profile?.imageUri || DefaultImage }} alt="user image" />
      <View className="flex-row gap-2 items-center">
        <Text className="text-foreground text-xl lg:text-3xl font-secondary font-bold my-4">{user.profile?.firstName} {user.profile?.lastName}</Text>
        <Badge variant="default">
          <Text className="text-primary-foreground">{user.role}</Text>
        </Badge>
      </View>
    </TouchableOpacity>
  );
}