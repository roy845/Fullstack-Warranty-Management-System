import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "../types/auth.types";

interface AuthContextProps {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [persist, setPersist] = useState<boolean>(false);

  // Load persist from AsyncStorage
  useEffect(() => {
    const loadPersist = async () => {
      try {
        const stored = await AsyncStorage.getItem("persist");
        if (stored !== null) {
          setPersist(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load persist setting", error);
      } finally {
      }
    };
    loadPersist();
  }, []);

  // Save persist to AsyncStorage whenever it changes
  useEffect(() => {
    const savePersist = async () => {
      try {
        await AsyncStorage.setItem("persist", JSON.stringify(persist));
      } catch (error) {
        console.error("Failed to save persist setting", error);
      }
    };
    savePersist();
  }, [persist]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { useAuth };
