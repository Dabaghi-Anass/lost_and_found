import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function useDrawerState(page: string) {
  const navigation = useNavigation()
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    if (page === "auth") {
      parent.setOptions({
        drawerLockMode: "locked-closed"
      })
    } else {
      parent.setOptions({
        drawerLockMode: "unlocked"
      })
    }
  }, [page])
}