import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../context/authContext";

const usePersistLogin = () => {
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted: boolean = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    refresh,
    auth,
    persist,
    isLoading,
  };
};

export default usePersistLogin;
