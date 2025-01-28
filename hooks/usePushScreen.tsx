import { pop, push, resetScreens } from "@/redux/global/app-navigation";
import { setInitialUrl } from "@/redux/global/appInitialUrl";
import * as Linking from 'expo-linking';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function usePushScreen(screenName?: string, param?: string, reset?: boolean) {
  const screens = useSelector((state: any) => state.appNavigation)
  const url = Linking.useURL()
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
  useEffect(() => {
    if (url) dispatch(setInitialUrl(url))
  }, [url])
  return { screens, goBack, canGoBack }
}