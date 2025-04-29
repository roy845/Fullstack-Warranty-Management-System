import { Redirect, Slot } from "expo-router";
import useRequireAuth from "../hooks/useRequireAuth";
import { AllowedRoles } from "../types/roles.types";

type RequireAuthProps = {
  allowedRoles: AllowedRoles[];
};

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { roles, auth } = useRequireAuth();
  return roles.find((role) => allowedRoles?.includes(role)) ? (
    <Slot />
  ) : auth?.accessToken ? (
    <Redirect href="/unauthorized" />
  ) : (
    <Redirect href="/login" />
  );
};

export default RequireAuth;
