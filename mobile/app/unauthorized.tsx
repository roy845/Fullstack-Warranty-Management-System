import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const UnauthorizedScreen: React.FC = () => {
  const router = useRouter();
  const goBack = () => {
    router.push("/warranties/create");
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-black px-6">
      <FontAwesome
        name="lock"
        size={64}
        color="red"
        style={{ marginBottom: 16 }}
      />
      <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Unauthorized
      </Text>
      <Text className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">
        You do not have the necessary permissions to access this page.
      </Text>
      <TouchableOpacity
        onPress={goBack}
        className="bg-blue-600 rounded-lg px-6 py-3"
      >
        <Text className="text-white font-semibold text-lg">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UnauthorizedScreen;
