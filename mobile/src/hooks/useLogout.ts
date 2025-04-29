import { Router, useRouter } from "expo-router";
import { logout } from "../api/serverApi";
import { useAuth } from "../context/authContext";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { ErrorEnum } from "../constants/errorConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogout = () => {
  const { setAuth, setPersist } = useAuth();

  const router: Router = useRouter();
  const REFRESH_TOKEN_KEY = "refreshToken";
  const logoutHandler = async (): Promise<void> => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync(
        REFRESH_TOKEN_KEY
      );
      await logout({
        refreshToken: storedRefreshToken
          ?.replace(/^"|"$/g, "")
          .trim() as string,
      });

      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      router.replace("/login");

      setAuth(null);
      setPersist(false);
    } catch (error: any) {
      if (error?.message === ErrorEnum.NETWORK_ERROR) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.message,
          visibilityTime: 5000,
        });
      }
    }
  };
  return logoutHandler;
};

export default useLogout;
