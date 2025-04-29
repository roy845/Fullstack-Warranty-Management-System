import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useDarkMode from "@/src/hooks/useDarkMode";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function SettingsScreen() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: isDarkMode ? "#fff" : "#111827",
          marginBottom: 16,
        }}
      >
        Settings
      </Text>

      {/* Accordion Header */}
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{
          backgroundColor: isDarkMode ? "#1f2937" : "#e5e7eb",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: isDarkMode ? "#d1d5db" : "#374151",
            fontWeight: "600",
          }}
        >
          Theme Preferences
        </Text>
      </TouchableOpacity>

      {/* Accordion Body */}
      {expanded && (
        <View style={{ paddingLeft: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => setDarkMode(false)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: !isDarkMode ? "#2563eb" : "transparent",
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: !isDarkMode ? "#fff" : "#6b7280" }}>
              Light Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDarkMode(true)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: isDarkMode ? "#2563eb" : "transparent",
              borderRadius: 6,
            }}
          >
            <Text style={{ color: isDarkMode ? "#fff" : "#6b7280" }}>
              Dark Mode
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
