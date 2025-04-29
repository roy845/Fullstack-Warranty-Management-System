import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/src/components/PasswordInput";
import useDarkMode from "@/src/hooks/useDarkMode";
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/src/schemas/reset-password.schema";
import { resetPassword } from "@/src/api/serverApi";
import Toast from "react-native-toast-message";
import { ErrorEnum } from "@/src/constants/errorConstants";
import { useState } from "react";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      setLoading(true);
      const toSubmit = {
        newPassword: data.password,
        token: token as string,
      };

      const { data: message } = await resetPassword(toSubmit);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: message,
        visibilityTime: 5000,
      });

      router.replace("/login");
    } catch (error: any) {
      if (error?.message === ErrorEnum.NETWORK_ERROR) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.message,
          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message,
          visibilityTime: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 justify-center items-center px-4 ${
        isDarkMode ? "bg-[#0f172a]" : "bg-white"
      }`}
    >
      <View
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg ${
          isDarkMode ? "bg-[#1e293b]" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Reset Password
        </Text>

        <Text
          className={`text-sm mb-2 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          New Password
        </Text>
        <PasswordInput
          value={watch("password")}
          onChangeText={(val) => setValue("password", val)}
          placeholder="Enter new password"
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </Text>
        )}

        <Text
          className={`text-sm mt-4 mb-2 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Confirm Password
        </Text>
        <PasswordInput
          value={watch("confirmPassword")}
          onChangeText={(val) => setValue("confirmPassword", val)}
          placeholder="Confirm new password"
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className={`mt-6 py-3 rounded-xl ${
            isDarkMode ? "bg-blue-700" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Reset Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
