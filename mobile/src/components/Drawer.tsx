import {
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { usePathname, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/authContext";
import useDarkMode from "../hooks/useDarkMode";
import useLogout from "../hooks/useLogout";
import decodeToken from "../utils/decodeToken";
import { AllowedRoles } from "../types/roles.types";
import { DecodedToken } from "../types/auth.types";

const { width } = Dimensions.get("window");

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const { isDarkMode } = useDarkMode();
  const pathname = usePathname();
  const { auth } = useAuth();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const logout = useLogout();

  const decodedToken: DecodedToken | null = auth?.accessToken
    ? decodeToken<DecodedToken>(auth.accessToken)
    : null;

  const roles: AllowedRoles[] = decodedToken?.roles || [];

  const links = [
    {
      href: "/warranties/create",
      label: "Create Wrranty",
      icon: "plus",
      roles: ["user"] as AllowedRoles[],
    },
    {
      href: "/warranties/list",
      label: "warranties list",
      icon: "list",
      roles: ["user"] as AllowedRoles[],
    },
    {
      href: `/profile/${decodedToken?._id}`,
      label: "Profile",
      icon: "user",
      roles: ["user", "admin"] as AllowedRoles[],
    },
    {
      href: "/settings",
      label: "Settings",
      icon: "cog",
      roles: ["user", "admin"] as AllowedRoles[],
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
          }}
        >
          <Animated.View
            style={{ flex: 1, backgroundColor: "#000", opacity: backdropAnim }}
          />
        </Pressable>
      )}

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 256,
          zIndex: 50,
          backgroundColor: isDarkMode ? "#111827" : "#fff",
          paddingHorizontal: 16,
          paddingVertical: 24,
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Top Section */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: isDarkMode ? "#fff" : "#1f2937",
              marginBottom: 24,
            }}
          >
            Menu
          </Text>

          {links
            .filter((link) => link.roles.some((role) => roles.includes(role)))
            .map((link) => (
              <Link key={link.href} href={link.href as any} asChild replace>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor:
                      pathname === link.href
                        ? "#2563eb"
                        : isDarkMode
                        ? "#1f2937"
                        : "#e5e7eb",
                  }}
                >
                  <FontAwesome
                    name={link.icon as any}
                    size={18}
                    color={
                      pathname === link.href
                        ? "#fff"
                        : isDarkMode
                        ? "#d1d5db"
                        : "#6b7280"
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        pathname === link.href
                          ? "#fff"
                          : isDarkMode
                          ? "#d1d5db"
                          : "#374151",
                    }}
                  >
                    {link.label}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
        </View>

        {/* Bottom Logout */}
        <TouchableOpacity
          onPress={logout}
          style={{ backgroundColor: "#dc2626", padding: 12, borderRadius: 8 }}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
