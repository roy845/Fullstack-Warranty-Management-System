import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import useDarkMode from "@/src/hooks/useDarkMode";
import useUsers from "@/src/hooks/useUsers";
import { cn } from "@/src/utils/cn";
import { User } from "@/src/types/user.types";
import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/src/schemas/edit-profile.schema";
import Input from "@/src/components/Input";
import PasswordInput from "@/src/components/PasswordInput";
import { formatDate } from "@/src/utils/formatDate";
import { AllowedRoles } from "@/src/types/roles.types";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

const EditProfile = () => {
  const { isDarkMode } = useDarkMode();
  const { userId } = useLocalSearchParams();
  const { getUser, updateUser } = useUsers();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Omit<User, "password">>({} as User);
  const [avatar, setAvatar] = useState(user?.bio?.avatar || "");
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const welcomeMessage = watch("bio.welcomeMessage");

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await getUser(userId as string);
        const user: Omit<User, "password"> = data;
        setUser(user);
        reset({
          username: user.username,
          email: user.email,
          bio: user.bio,
        });
        setAvatar(user.bio?.avatar);
      } catch {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load user details.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      const updatePayload: UpdateUserSchema = {
        username: data.username,
        email: data.email,
        bio: { welcomeMessage: data.bio?.welcomeMessage, avatar: avatar },
      };

      if (data.password?.trim()) {
        updatePayload.password = data.password;
      }

      await updateUser(userId as string, updatePayload);

      Toast.show({
        type: "success",
        text1: "Profile updated",
      });

      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Failed to update profile. Please try again.";
      Toast.show({
        type: "error",
        text1: "Update Error",
        text2: message,
      });
    }
  };

  const textColor = isDarkMode ? "text-white" : "text-black";

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
        <ScrollView
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
        >
          <Text
            className={cn("text-2xl font-bold text-center mb-6", textColor)}
          >
            Edit Profile
          </Text>

          {/* Avatar */}
          <View className="items-center mb-8">
            <TouchableOpacity onPress={pickImage}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-28 h-28 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-28 h-28 rounded-full bg-gray-400 items-center justify-center">
                  <Text className="text-white text-xl">+</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text
              className={cn(
                "text-sm mt-2",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              Tap to change avatar
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mt-2">
            {/* Username */}
            <View className="mb-4">
              <Input
                icon="user"
                placeholder="Username"
                value={username}
                onChangeText={(text) => setValue("username", text)}
              />
              {errors.username && (
                <Text className="text-red-500 mt-1">
                  *{errors.username.message}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Input
                icon="envelope"
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setValue("email", text)}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1">
                  *{errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-4">
              <PasswordInput
                placeholder="Password (leave empty to keep current)"
                value={password || ""}
                onChangeText={(text) => setValue("password", text)}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Welcome Message */}
            <View className="mb-4">
              <Input
                icon="comment"
                placeholder="Welcome Message"
                multiline
                value={welcomeMessage}
                onChangeText={(text) => setValue("bio.welcomeMessage", text)}
              />
              {errors.bio?.welcomeMessage && (
                <Text className="text-red-500 mt-1">
                  *{errors.bio.welcomeMessage.message}
                </Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View className="border-t mt-8 mb-4 border-gray-300 dark:border-gray-600" />

          {/* Roles */}
          <View className="mb-4 items-center">
            <Text
              className={cn(
                "text-lg font-semibold mb-2",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              Roles
            </Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
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
          </View>

          {/* Timestamps */}
          <View className="items-center">
            <Text
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              Created At:{" "}
              <Text className="font-medium text-blue-500">
                {user?.createdAt ? formatDate(user.createdAt) : "-"}
              </Text>
            </Text>
            <Text
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              Updated At:{" "}
              <Text className="font-medium text-blue-500">
                {user?.updatedAt ? formatDate(user.updatedAt) : "-"}
              </Text>
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row mt-6 space-x-4">
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              className={cn(
                "flex-1 py-3 rounded-full items-center",
                isSubmitting
                  ? "bg-gray-400"
                  : isDarkMode
                  ? "bg-blue-600"
                  : "bg-blue-500"
              )}
            >
              <Text className="text-white font-medium text-base">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 py-3 rounded-full bg-red-500 items-center ml-2"
            >
              <Text className="text-white font-medium text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditProfile;
