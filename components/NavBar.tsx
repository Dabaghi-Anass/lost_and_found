import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  title: string;
  userAvatar: string;
}
export default function NavBar({ title, userAvatar }: Props) {
  return (
    <View className="p-4 border-b border-muted flex flex-row justify-between items-center bg-background">
      <View className="p-2 ">
        <Text className="text-foreground font-semibold text-xl">{title}</Text>
      </View>
      <View className="rounded-full">
        <Avatar alt="user avatar">
          <AvatarImage source={{
            uri: userAvatar
          }} />
          <AvatarFallback className="text-red-500">
            <Text className="text-foreground">AD</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    </View>);
}