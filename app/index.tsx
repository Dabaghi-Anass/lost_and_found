// import { auth } from "@/database/fire_base";
import { useStorageState } from "@/hooks/useStorageState";
import { Redirect } from "expo-router";


export default function HomeScreen() {
  const [userId, setUserId] = useStorageState("userID", "");
  if (false) return <Redirect href="/login" />;
  return <Redirect href="/home" />;
}
