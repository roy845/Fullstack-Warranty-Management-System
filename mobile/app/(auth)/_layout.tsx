import { Slot } from "expo-router";
import ThemeToggle from "../../src/components/ThemeToggle";

export default function AuthLayout() {
  return (
    <>
      <ThemeToggle />
      <Slot />
    </>
  );
}
