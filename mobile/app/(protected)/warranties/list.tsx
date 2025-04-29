import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { cn } from "@/src/utils/cn";
import useDarkMode from "@/src/hooks/useDarkMode";
import useFetchWarranties from "@/src/hooks/useFetchWarranties"; // 🔥
import dayjs from "dayjs";

export default function WarrantyListScreen() {
  const { isDarkMode } = useDarkMode();
  const { warranties, loading, refreshing, refreshWarranties } =
    useFetchWarranties();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      case "manual_review":
        return "text-blue-400";
      default:
        return isDarkMode ? "text-white" : "text-black";
    }
  };

  const renderWarranty = ({ item }: { item: any }) => (
    <View
      className={cn(
        "p-4 mb-4 rounded-lg",
        isDarkMode ? "bg-slate-700" : "bg-gray-100"
      )}
    >
      <Text
        className={cn(
          "font-bold text-lg mb-2",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        Client name: {item.clientName}
      </Text>
      <Text
        className={cn("mb-1", isDarkMode ? "text-gray-300" : "text-gray-600")}
      >
        Product: {item.productInfo}
      </Text>
      <Text
        className={cn("mb-1", isDarkMode ? "text-gray-300" : "text-gray-600")}
      >
        Installation Date: {dayjs(item.installationDate).format("MMMM D, YYYY")}
      </Text>
      <Text className={cn("font-semibold", getStatusColor(item.status))}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View
      className={cn("flex-1 p-4", isDarkMode ? "bg-[#0f172a]" : "bg-white")}
    >
      {!loading && (
        <Text
          className={cn(
            "text-2xl font-bold mb-4 text-center",
            isDarkMode ? "text-white" : "text-black"
          )}
        >
          Warranties
        </Text>
      )}
      {/* 🔥 Always show loading at the top */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" className="mb-4" />
        </View>
      )}
      <FlatList
        data={warranties}
        keyExtractor={(item) => item._id}
        renderItem={renderWarranty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshWarranties}
            tintColor={isDarkMode ? "#fff" : "#000"}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <Text
              className={cn(
                "text-center mt-20 text-lg",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              No warranties found.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
