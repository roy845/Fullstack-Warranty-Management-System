import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { cn } from "@/src/utils/cn";
import useDarkMode from "@/src/hooks/useDarkMode";
import useFetchWarranties from "@/src/hooks/useFetchWarranties"; // 🔥
import dayjs from "dayjs";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

export default function WarrantyListScreen() {
  const { isDarkMode } = useDarkMode();
  const {
    warranties,
    loading,
    refreshing,
    page,
    limit,
    totalPages,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    handleSearchChange,
    refreshWarranties,
  } = useFetchWarranties();

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
      <View className="mb-4">
        <TextInput
          className={cn(
            "border rounded-md p-2 mb-2",
            isDarkMode ? "text-white border-white" : "border-black text-black"
          )}
          placeholder="Search By Client Name or Product Info"
          placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
          onChangeText={handleSearchChange}
        />
        <View className="flex-row justify-between mb-2">
          <Picker
            selectedValue={limit}
            style={{
              flex: 1,
              color: isDarkMode ? "white" : "black",
              backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
            }}
            onValueChange={(itemValue) => setLimit(Number(itemValue))}
          >
            {[1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((value) => (
              <Picker.Item key={value} label={value.toString()} value={value} />
            ))}
          </Picker>

          <Picker
            selectedValue={sortBy}
            style={{
              flex: 1,
              color: isDarkMode ? "white" : "black",
              backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
            }}
            onValueChange={(itemValue) => setSortBy(itemValue)}
          >
            <Picker.Item label="Created At" value="createdAt" />
            <Picker.Item label="Product Info" value="productInfo" />
            <Picker.Item label="Client Name" value="clientName" />
            <Picker.Item label="Status" value="status" />
            <Picker.Item label="Updated At" value="updatedAt" />
          </Picker>

          <Picker
            selectedValue={sortOrder}
            style={{
              flex: 1,
              color: isDarkMode ? "white" : "black",
              backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
            }}
            onValueChange={(itemValue) => setSortOrder(itemValue)}
          >
            <Picker.Item label="Descending" value="desc" />
            <Picker.Item label="Ascending" value="asc" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
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
            <Text
              className={cn(
                "text-center mt-20 text-lg",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              No warranties found.
            </Text>
          }
        />
      )}

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <View className="flex-row justify-between items-center mt-4">
          {/* Previous Button */}
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage(Math.max(1, page - 1))}
            className={cn(
              "flex-row items-center bg-blue-700 py-2 px-4 rounded-lg",
              page === 1 && "opacity-50"
            )}
          >
            <FontAwesome name="arrow-left" size={16} color="white" />
          </TouchableOpacity>

          {/* Page Info */}
          <Text
            className={cn(
              "text-center my-auto",
              isDarkMode ? "text-white" : "text-black"
            )}
          >
            {page} / {totalPages}
          </Text>

          {/* Next Button */}
          <TouchableOpacity
            disabled={page === totalPages}
            onPress={() => setPage(Math.min(totalPages, page + 1))}
            className={cn(
              "flex-row items-center bg-blue-700 py-2 px-4 rounded-lg",
              page === totalPages && "opacity-50"
            )}
          >
            <FontAwesome name="arrow-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
