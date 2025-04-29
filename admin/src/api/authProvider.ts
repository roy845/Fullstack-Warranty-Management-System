import { AuthProvider } from "react-admin";
import { tokenService } from "../services/tokenService";
import { BASE_URL, logoutAdmin, refreshAccessTokenAdmin } from "./api";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch(`${BASE_URL}/auth/signin-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const { accessToken } = await response.json();

    tokenService.setToken(accessToken);
  },

  logout: async () => {
    await logoutAdmin();
    tokenService.clearToken();
    return Promise.resolve("/login");
  },

  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      try {
        await refreshAccessTokenAdmin();
        return Promise.resolve();
      } catch (error) {
        tokenService.clearToken();
        return Promise.reject();
      }
    }
    return Promise.resolve();
  },

  checkAuth: async () => {
    if (tokenService.getToken()) {
      return Promise.resolve();
    }
    try {
      await refreshAccessTokenAdmin();
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  },

  getIdentity: async () => {
    try {
      const token = tokenService.getToken();
      if (!token) throw new Error("No token");

      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        id: payload.sub,
        fullName: payload.email,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getPermissions: () => Promise.resolve(),
};
