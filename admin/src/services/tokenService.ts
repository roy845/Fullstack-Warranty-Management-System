let accessTokenMemory: string | null = null;

export const tokenService = {
  getToken: () => accessTokenMemory,
  setToken: (token: string) => {
    accessTokenMemory = token;
  },
  clearToken: () => {
    accessTokenMemory = null;
  },
};
