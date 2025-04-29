import { jwtDecode } from "jwt-decode";

function decodeToken<T>(token: string | undefined) {
  if (!token) {
    return null;
  }

  try {
    const decodedToken: T | null = token ? jwtDecode<T>(token) : null;

    return decodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export default decodeToken;
