import { pop, push, resetScreens } from "@/redux/global/app-navigation";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export function usePushScreen(screenName?: string, param?: string, reset?: boolean) {
  const screens = useSelector((state: any) => state.appNavigation)
  const dispatch = useDispatch()
  function goBack() {
    if (canGoBack()) {
      const path = `/${screens.at(-2)}` as any
      dispatch(pop())
      router.replace(path)
    }
  }
  function canGoBack() {
    return screens.length > 1
  }
  const init = useCallback(() => {
    if (!screenName) return
    if (reset) {
      dispatch(resetScreens())
    }
    if (screens[screens.length - 1] !== screenName) {
      const path = param ? "/" + param : ""
      dispatch(push(screenName + path));
    }

  }, [screenName])

  useFocusEffect(init)
  return { screens, goBack, canGoBack }
}