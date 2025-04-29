import useDarkMode from "@/src/hooks/useDarkMode";
import useUsers from "@/src/hooks/useUsers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { User } from "@/src/types/user.types";
import { cn } from "@/src/utils/cn";
import { formatDate } from "@/src/utils/formatDate";
import { Modal, Pressable } from "react-native";
import useLogout from "@/src/hooks/useLogout";
import { useAuth } from "@/src/context/authContext";
import decodeToken from "@/src/utils/decodeToken";
import { DecodedToken } from "@/src/types/auth.types";
import { UserRoles } from "../../../src/types/roles.types";

const ProfileScreen = () => {
  const { isDarkMode } = useDarkMode();
  const { userId } = useLocalSearchParams();
  const { getUser, removeUser } = useUsers();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const router = useRouter();
  const logout = useLogout();
  const { auth } = useAuth();

  const decodedToken: DecodedToken | null = decodeToken(auth?.accessToken);

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await removeUser(userId as string);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User removed successfully!",
        visibilityTime: 5000,
      });
      logout();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Remove User failed. Please try again.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data } = await getUser(userId as string);
        setUser(data);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          "❌ User fetch failed. Please try again.";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          visibilityTime: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <SafeAreaView
      className={cn("flex-1 px-4", isDarkMode ? "bg-gray-900" : "bg-white")}
    >
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#22c55e" : "#000"}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pt-8">
          <View className="items-center justify-center">
            <Text
              className={cn(
                "text-3xl font-bold mb-6",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              Profile
            </Text>

            {user ? (
              <>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={{ uri: user.bio.avatar }}
                    className="w-32 h-32 rounded-full mb-6"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Text
                  className={cn(
                    "text-xl font-semibold",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}
                >
                  {user.username}
                </Text>
                <Text className="text-gray-400 mb-2">{user.email}</Text>
                <Text className="text-sm text-gray-500 text-center px-4 mb-6">
                  {user.bio.welcomeMessage}
                </Text>

                <View className="flex-row gap-2 flex-wrap justify-center mb-4">
                  {user.roles.map((role) => (
                    <Text
                      key={role}
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      )}
                    >
                      {role}
                    </Text>
                  ))}
                </View>

                <View className="mt-4 space-y-1">
                  <Text
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    Created:{" "}
                    <Text className="font-medium text-blue-500">
                      {formatDate(user.createdAt)}
                    </Text>
                  </Text>
                  <Text
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    Updated:{" "}
                    <Text className="font-medium text-blue-500">
                      {formatDate(user.updatedAt)}
                    </Text>
                  </Text>
                </View>
              </>
            ) : (
              <Text
                className={cn(
                  "text-center text-base",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                User not found
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-center mt-5 mb-5 gap-5">
            <TouchableOpacity
              className={cn(
                "flex-1 px-6 py-3 rounded-full",
                isDarkMode
                  ? "bg-blue-600 active:bg-blue-700"
                  : "bg-blue-500 active:bg-blue-600"
              )}
              onPress={() =>
                router.push({
                  pathname: "/editProfile/[userId]",
                  params: { userId: userId as string },
                })
              }
            >
              <Text className="text-white text-center font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>

            {!decodedToken?.roles?.includes(UserRoles.ADMIN) && (
              <TouchableOpacity
                className="flex-1 px-6 py-3 rounded-full bg-red-500 active:bg-red-600"
                onPress={() => setConfirmDeleteVisible(true)}
              >
                <Text className="text-white text-center font-semibold text-base">
                  Delete Profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}

      {/* Avatar Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/80 items-center justify-center"
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: user?.bio.avatar }}
            resizeMode="contain"
            className="w-full h-[80%] rounded-md"
          />
        </Pressable>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <Pressable
          className={cn(
            "flex-1 justify-center px-6",
            isDarkMode ? "bg-black/70" : "bg-black/50"
          )}
          onPress={() => setConfirmDeleteVisible(false)}
        >
          <View
            className={cn(
              "rounded-xl p-6 w-full",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}
            onStartShouldSetResponder={() => true}
          >
            <Text
              className={cn(
                "text-lg font-semibold mb-4 text-center",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              Are you sure you want to delete your profile?
            </Text>

            <View className="flex-row justify-between gap-5 mt-2">
              <TouchableOpacity
                className={cn(
                  "flex-1 rounded-lg py-2",
                  isDarkMode ? "bg-gray-600" : "bg-gray-400"
                )}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text className="text-white font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-600 rounded-lg py-2"
                onPress={handleDeleteUser}
              >
                <Text className="text-white font-semibold text-center">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
