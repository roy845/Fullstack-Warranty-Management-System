import { Slot } from "expo-router";
import "./globals.css";
import DarkModeProvider from "../src/context/DarkModeContext";
import ThemedToast from "@/src/components/ThemedToast";
import { AuthContextProvider } from "@/src/context/authContext";

export default function RootLayout() {
  return (
    <DarkModeProvider>
      <AuthContextProvider>
        <Slot />
        <ThemedToast />
      </AuthContextProvider>
    </DarkModeProvider>
  );
}
