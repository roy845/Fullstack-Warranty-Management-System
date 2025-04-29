import { tokenService } from "../services/tokenService";

const IS_PROD: boolean = true;
export let BASE_URL: string | undefined = "";

if (IS_PROD) {
  BASE_URL = import.meta.env.VITE_API_URL_PROD;
} else {
  BASE_URL = import.meta.env.VITE_API_URL_DEV;
}

export async function refreshAccessTokenAdmin() {
  const response = await fetch(`${BASE_URL}/auth/refresh-token-admin`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Refresh failed");
  }

  const { accessToken } = await response.json();

  tokenService.setToken(accessToken);
}

export async function logoutAdmin() {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout-admin`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout from server");
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
  }
}
