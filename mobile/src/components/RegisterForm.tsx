import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesome } from "@expo/vector-icons";
import Input from "../../src/components/Input";
import PasswordInput from "../../src/components/PasswordInput";
import {
  registerSchema,
  RegisterSchemaType,
} from "../../src/schemas/register-schema.schema";
import useDarkMode from "@/src/hooks/useDarkMode";
import { signup } from "../api/serverApi";
import Toast from "react-native-toast-message";
import { SignupDto } from "../types/auth.types";
import { useState } from "react";

const RegisterForm = () => {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = watch("email");
  const username = watch("username");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      setLoading(true);
      const dataToSubmit: SignupDto = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const { data: response } = await signup(dataToSubmit);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `✅ ${response || "Registration successful!"}`,
        visibilityTime: 5000,
      });

      router.push("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Registration failed. Please try again.";

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
          Register
        </Text>

        {[
          {
            label: "Username",
            name: "username",
            icon: "user",
            value: username,
          },
          { label: "Email", name: "email", icon: "envelope", value: email },
        ].map(({ label, name, icon, value }) => (
          <View key={name}>
            <Text
              className={`${isDarkMode ? "text-white" : "text-black"} mb-1`}
            >
              {label}
            </Text>
            <Input
              placeholder={`Enter your ${label.toLowerCase()}`}
              icon={icon as any}
              value={value}
              onChangeText={(text) => setValue(name as any, text)}
            />
            {errors[name as keyof typeof errors] && (
              <Text className="text-red-500 text-sm">
                *{errors[name as keyof typeof errors]?.message}
              </Text>
            )}
          </View>
        ))}

        <Text className={`${isDarkMode ? "text-white" : "text-black"} mb-1`}>
          Password
        </Text>
        <PasswordInput
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => setValue("password", text)}
        />

        {errors.password && (
          <Text className="text-red-500 text-sm">
            *{errors.password.message}
          </Text>
        )}

        <Text className={`${isDarkMode ? "text-white" : "text-black"} mb-1`}>
          Confirm Password
        </Text>
        <PasswordInput
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={(text) => setValue("confirmPassword", text)}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm mt-1">
            *{errors.confirmPassword.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-600 rounded-xl p-3 mt-4 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Register
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className={`${isDarkMode ? "text-white" : "text-black"} mr-1`}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="flex-row items-center space-x-1"
          >
            <FontAwesome
              name="sign-in"
              size={14}
              color="#3b82f6"
              className="mr-1"
            />
            <Text className="text-blue-400 text-sm font-medium">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;
