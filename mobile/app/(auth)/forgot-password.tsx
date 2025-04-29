import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/src/schemas/forgot-password.schema";
import useDarkMode from "@/src/hooks/useDarkMode";
import Input from "@/src/components/Input";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { forgotPassword } from "@/src/api/serverApi";
import { ErrorEnum } from "@/src/constants/errorConstants";
import Toast from "react-native-toast-message";
import { useState } from "react";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      setLoading(true);
      const { data: forgotPasswordData } = await forgotPassword(data);

      const { message, token } = forgotPasswordData;

      Toast.show({
        type: "success",
        text1: "Success",
        text2: message,
        visibilityTime: 5000,
      });

      reset();
      router.push(`/reset-password/${token}`);
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
    <View
      className={`flex-1 justify-center items-center px-4 ${
        isDarkMode ? "bg-[#0f172a]" : "bg-white"
      }`}
    >
      <View
        className={`rounded-2xl w-full max-w-md p-6 ${
          isDarkMode ? "bg-[#1e293b]" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Forgot Password
        </Text>

        <Text className={`${isDarkMode ? "text-white" : "text-black"} mb-1`}>
          Email
        </Text>
        <Input
          placeholder="Enter your email"
          icon="envelope"
          value={email}
          onChangeText={(text) => setValue("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mb-2">
            *{errors.email.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-600 rounded-xl p-3 flex items-center justify-center mt-5"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Reset Password
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Links */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="flex-row items-center space-x-1"
          >
            <FontAwesome name="key" size={14} color="#3b82f6" />
            <Text className="text-blue-400 text-sm font-medium">
              Remember your password ? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
