import Drawer from "@/src/components/Drawer";
import usePersistLogin from "@/src/hooks/usePersistLogin";
import useRequireAuth from "@/src/hooks/useRequireAuth";
import { AllowedRoles } from "@/src/types/roles.types";
import { FontAwesome } from "@expo/vector-icons";
import { Slot, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";

// Optionally define role restrictions per path
const protectedRoutes: { [key: string]: AllowedRoles[] } = {
  "/warranties/create": ["user"],
  "/warranties/list": ["user"],
  "/profile": ["user"],
  "/editProfile": ["user"],
};

export default function ProtectedLayout() {
  const { auth, persist, isLoading } = usePersistLogin();
  const { roles } = useRequireAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const allowedRoles = Object.entries(protectedRoutes).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (!isLoading) {
      if (!auth?.accessToken) {
        router.replace("/login");
      } else if (
        allowedRoles &&
        !roles.some((role) => allowedRoles.includes(role))
      ) {
        router.replace("/unauthorized");
      }
    }
  }, [auth, isLoading, pathname]);

  if (persist && isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white dark:bg-black">
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <View className="p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <FontAwesome name="bars" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold dark:text-white">App</Text>
        <View className="w-6" />
      </View>

      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
