import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

export function useDrawerState(page: string) {
  const navigation = useNavigation()
  const init = useCallback(() => {
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
  useFocusEffect(init)
}