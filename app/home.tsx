import ScrollScreen from "@/components/scroll-screen";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";


export default function HomeScreen() {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state.user);
  console.log({ currentUser });
  return <ScrollScreen className="bg-background">
  </ScrollScreen>
}
