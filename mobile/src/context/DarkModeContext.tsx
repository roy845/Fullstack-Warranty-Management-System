import { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load theme preference on mount
  useEffect(() => {
    const loadMode = async () => {
      try {
        const stored = await AsyncStorage.getItem("isDarkMode");
        if (stored !== null) {
          setIsDarkMode(JSON.parse(stored)); // parse boolean
        }
      } catch (error) {
        console.error("Error loading theme from AsyncStorage:", error);
      }
    };
    loadMode();
  }, []);

  // Save preference on change
  useEffect(() => {
    AsyncStorage.setItem("isDarkMode", JSON.stringify(isDarkMode)).catch(
      (error) => {
        console.error("Error saving theme to AsyncStorage:", error);
      }
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setDarkMode = (isDarkMode: boolean) => {
    setIsDarkMode(isDarkMode);
  };

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, toggleDarkMode, setDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
