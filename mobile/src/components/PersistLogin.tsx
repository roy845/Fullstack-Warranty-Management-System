import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import usePersistLogin from "../hooks/usePersistLogin";

const PersistLogin = () => {
  const { persist, isLoading } = usePersistLogin();

  return (
    <>
      {!persist ? (
        <Slot />
      ) : isLoading ? (
        <View className="flex-1 justify-center items-center bg-white dark:bg-black">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <Slot />
      )}
    </>
  );
};

export default PersistLogin;
