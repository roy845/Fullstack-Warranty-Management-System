import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useDarkMode from "../hooks/useDarkMode";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <TouchableOpacity
      onPress={toggleDarkMode}
      className="absolute top-4 right-4 z-50"
    >
      <FontAwesome
        name={isDarkMode ? "sun-o" : "moon-o"}
        size={24}
        color={isDarkMode ? "#fbbf24" : "#94a3b8"}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
