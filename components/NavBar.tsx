import { AppUser } from "@/types/entities.types";
import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  title: string;
  user: AppUser;
}
export default function NavBar({ title, user }: Props) {
  const userShortName = `${user?.profile?.firstName?.charAt(0) ?? "N"}${user?.profile?.lastName?.charAt(0) ?? "A"}`;
  return (
    <View className="p-4 border-b border-muted flex flex-row justify-between items-center bg-background">
      <View className="p-2 ">
        <Text className="text-foreground font-semibold text-xl">{title}</Text>
      </View>
      <View className="rounded-full">
        <Avatar alt="user avatar">
          <AvatarImage source={{
            uri: user?.profile?.imageUri
          }} />
          <AvatarFallback className="text-foreground">
            <Text className="text-foreground">{userShortName}</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    </View>);
}