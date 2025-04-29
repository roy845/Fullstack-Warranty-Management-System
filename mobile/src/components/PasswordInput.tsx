import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useDarkMode from "@/src/hooks/useDarkMode";

interface Props extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const PasswordInput = ({ value, onChangeText, placeholder }: Props) => {
  const [secure, setSecure] = useState(true);
  const { isDarkMode } = useDarkMode();

  return (
    <View
      className={`flex-row items-center rounded-xl px-4 py-3 border ${
        isDarkMode
          ? "bg-[#334155] border-gray-600"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      <FontAwesome
        name="lock"
        size={18}
        color={isDarkMode ? "#cbd5e1" : "#475569"}
        className="mr-2"
      />
      <TextInput
        className={`flex-1 text-base ${
          isDarkMode ? "text-white" : "text-black"
        }`}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#94a3b8" : "#6b7280"}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => setSecure(!secure)}>
        <FontAwesome
          name={secure ? "eye-slash" : "eye"}
          size={18}
          color={isDarkMode ? "#cbd5e1" : "#475569"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
