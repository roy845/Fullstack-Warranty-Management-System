import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import PasswordInput from "./PasswordInput";
import { loginSchema, LoginSchemaType } from "../schemas/login-schema.schema";
import useDarkMode from "@/src/hooks/useDarkMode";
import { useAuth } from "../context/authContext";
import Toast from "react-native-toast-message";
import { login } from "../api/serverApi";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginForm() {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState<boolean>(false);
  const { persist, setAuth, setPersist } = useAuth();
  const REFRESH_TOKEN_KEY = "refreshToken";

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setLoading(true);
      const { data: authResponse } = await login(data);
      setAuth({
        accessToken: authResponse.accessToken,
      });

      await SecureStore.setItemAsync(
        REFRESH_TOKEN_KEY,
        authResponse.refreshToken as string
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: authResponse.message,
        visibilityTime: 5000,
      });

      router.push("/warranties/create");
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "❌ Login failed. Please try again.";

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

  const togglePersist = () => {
    setPersist((prev) => !prev);
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
          className={`text-2xl font-bold text-center mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Login
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

        <Text className={`${isDarkMode ? "text-white" : "text-black"} mb-1`}>
          Password
        </Text>
        <PasswordInput
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mb-2">
            *{errors.password.message}
          </Text>
        )}

        {/* Trust this device */}
        <View className="flex-row items-center space-x-2 mb-4">
          <Switch
            value={persist}
            onValueChange={togglePersist}
            trackColor={{ true: "#3b82f6", false: "#cbd5e1" }}
            thumbColor={persist ? "#60a5fa" : "#f1f5f9"}
          />
          <Text className={isDarkMode ? "text-white" : "text-black"}>
            Trust This Device
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-600 rounded-xl p-3 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Login
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Links */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="flex-row items-center space-x-1"
          >
            <FontAwesome name="user-plus" size={14} color="#3b82f6" />
            <Text className="text-blue-400 text-sm font-medium">
              Create an account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            className="flex-row items-center space-x-1"
          >
            <FontAwesome name="key" size={14} color="#3b82f6" />
            <Text className="text-blue-400 text-sm font-medium">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
