import { refreshToken } from "../api/serverApi";
import { useAuth } from "../context/authContext";
import * as SecureStore from "expo-secure-store";
import useLogout from "./useLogout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();
  const REFRESH_TOKEN_KEY = "refreshToken";
  const refresh = async () => {
    const storedRefreshToken = await SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY
    );

    try {
      const { data } = await refreshToken({
        refreshToken: storedRefreshToken
          ?.replace(/^"|"$/g, "")
          .trim() as string,
      });
      const accessToken: string = data?.accessToken;

      if (!accessToken) throw new Error("No access token received");

      setAuth((prev) => ({
        ...prev,
        accessToken,
      }));

      return accessToken;
    } catch (error: any) {
      console.error("Refresh token error:", error);

      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  return refresh;
};

export default useRefreshToken;
