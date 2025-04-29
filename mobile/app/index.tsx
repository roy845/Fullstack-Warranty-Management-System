import usePersistLogin from "@/src/hooks/usePersistLogin";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { InteractionManager, LogBox } from "react-native";

export default function Index() {
  const router = useRouter();
  const { auth, isLoading, persist } = usePersistLogin();

  LogBox.ignoreAllLogs();
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!isLoading) {
        if (auth?.accessToken && persist) {
          router.replace("/warranties/create");
        } else {
          router.replace("/login");
        }
      }
    });

    return () => task.cancel();
  }, [auth, isLoading]);

  return <></>;
}
