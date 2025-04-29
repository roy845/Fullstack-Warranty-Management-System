import { useAuth } from "../context/authContext";
import { DecodedToken } from "../types/auth.types";
import { AllowedRoles } from "../types/roles.types";
import decodeToken from "../utils/decodeToken";
import { useRoute } from "@react-navigation/native";

const useRequireAuth = () => {
  const { auth } = useAuth();
  const route = useRoute();

  const decodedToken: DecodedToken | null = auth?.accessToken
    ? decodeToken<DecodedToken>(auth?.accessToken)
    : null;

  const roles: AllowedRoles[] = decodedToken?.roles || [];

  return { roles, auth, routeName: route.name };
};

export default useRequireAuth;
