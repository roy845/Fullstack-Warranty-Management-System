// src/components/ThemedToast.tsx
import Toast from "react-native-toast-message";
import useDarkMode from "../hooks/useDarkMode";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const ThemedToast = () => {
  const { isDarkMode } = useDarkMode();

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#22c55e",
          backgroundColor: isDarkMode ? "#1e293b" : "#fff",
        }}
        text1Style={{
          color: isDarkMode ? "#fff" : "#000",
        }}
        text2Style={{
          color: isDarkMode ? "#d1d5db" : "#4b5563",
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#ef4444",
          backgroundColor: isDarkMode ? "#1e293b" : "#fff",
        }}
        text1Style={{
          color: isDarkMode ? "#fff" : "#000",
        }}
        text2Style={{
          color: isDarkMode ? "#d1d5db" : "#4b5563",
        }}
      />
    ),
  };

  return <Toast position="bottom" config={toastConfig} />;
};

export default ThemedToast;
