import { View, TextInput, TextInputProps } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useDarkMode from "@/src/hooks/useDarkMode";

interface InputProps extends TextInputProps {
  icon?: keyof typeof FontAwesome.glyphMap;
}

const Input = ({ icon, ...rest }: InputProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <View
      className={`flex-row items-center rounded-xl px-4 py-3  border ${
        isDarkMode
          ? "bg-[#334155] border-gray-600"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      {icon && (
        <FontAwesome
          name={icon}
          size={18}
          color={isDarkMode ? "#cbd5e1" : "#475569"} // slate-400 for light mode
          className="mr-2"
        />
      )}
      <TextInput
        className={`flex-1 text-base ${
          isDarkMode ? "text-white" : "text-black"
        }`}
        placeholderTextColor={isDarkMode ? "#94a3b8" : "#6b7280"} // slate-500
        {...rest}
      />
    </View>
  );
};

export default Input;
