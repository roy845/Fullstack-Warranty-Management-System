import { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}
