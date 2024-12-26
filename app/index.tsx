import { auth } from "@/database/fire_base";
import { Redirect } from "expo-router";


export default function HomeScreen() {
  const currentUser = auth.currentUser;
  if (!currentUser) return <Redirect href="/login" />;
  return <Redirect href="/home" />;
}
