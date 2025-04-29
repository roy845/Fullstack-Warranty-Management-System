import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "refreshToken";

export const storeRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = async () => {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};
