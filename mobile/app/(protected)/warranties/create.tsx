import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useWarrantiesService from "@/src/hooks/useWarrantiesService";
import useDarkMode from "@/src/hooks/useDarkMode";
import Input from "@/src/components/Input";
import { FontAwesome } from "@expo/vector-icons";
import { cn } from "@/src/utils/cn";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import {
  WarrantyFormType,
  warrantySchema,
} from "@/src/schemas/warrantySchema.schema";
import Toast from "react-native-toast-message";

export default function CreateWarrantyScreen() {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { createWarranty } = useWarrantiesService();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WarrantyFormType>({
    resolver: zodResolver(warrantySchema),
    defaultValues: {
      clientName: "",
      productInfo: "",
      installationDate: "",
      invoiceFile: null,
    } as any,
  });

  const invoiceFile = watch("invoiceFile");

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setValue("invoiceFile", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        });
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const onSubmit = async (data: WarrantyFormType) => {
    try {
      const formData = new FormData();
      formData.append("invoice", {
        uri: data.invoiceFile?.uri,
        type: data.invoiceFile?.type,
        name: data.invoiceFile?.name,
      } as any);
      formData.append("clientName", data.clientName);
      formData.append("productInfo", data.productInfo);
      formData.append("installationDate", data.installationDate);

      await createWarranty(formData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Warranty created successfully!",
        visibilityTime: 5000,
      });

      router.push("/warranties/list");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Create Warranty failed. Please try again.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        visibilityTime: 5000,
      });
    }
  };

  return (
    <>
      <ScrollView
        className={cn("flex-1 p-4", isDarkMode ? "bg-[#0f172a]" : "bg-white")}
      >
        <Text
          className={cn(
            "text-2xl font-bold mb-6 text-center",
            isDarkMode ? "text-white" : "text-black"
          )}
        >
          Create Warranty
        </Text>

        {/* Upload Invoice */}
        <View className="items-center mb-6">
          <Pressable
            className={cn(
              "w-16 h-16 rounded-full justify-center items-center",
              isDarkMode ? "bg-slate-700" : "bg-slate-200"
            )}
            onPress={pickFile}
          >
            <FontAwesome
              name="upload"
              size={28}
              color={isDarkMode ? "#cbd5e1" : "#334155"}
            />
          </Pressable>
          <Text
            className={cn(
              "mt-2 font-semibold",
              isDarkMode ? "text-white" : "text-black"
            )}
          >
            Upload Invoice
          </Text>
          {errors.invoiceFile && (
            <Text className="text-red-500 mt-2">*Invoice file is required</Text>
          )}
        </View>

        {/* Preview selected file */}
        {invoiceFile && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <View className="items-center mb-6">
              {invoiceFile.type.startsWith("image/") ? (
                <Image
                  source={{ uri: invoiceFile.uri }}
                  className="w-full h-40 mb-2 rounded-lg"
                  resizeMode="contain"
                />
              ) : (
                <Text
                  className={cn(
                    "text-center font-semibold",
                    isDarkMode ? "text-white" : "text-black"
                  )}
                >
                  Selected file: {invoiceFile.name}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Form */}
        <View className="space-y-4 mb-6">
          <Controller
            name="clientName"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                icon="user"
                placeholder="Client Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.clientName && (
            <Text className="text-red-500">*{errors.clientName.message}</Text>
          )}
          <View className="mt-2" />
          {/* Textarea for Product Info */}
          <Controller
            name="productInfo"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <View
                className={cn(
                  "flex-row rounded-xl px-4 py-3 border items-center",
                  isDarkMode
                    ? "bg-[#334155] border-gray-600"
                    : "bg-gray-100 border-gray-300"
                )}
              >
                <View className="justify-center items-center min-h-[100px] mr-2">
                  <FontAwesome
                    name="info-circle"
                    size={22}
                    color={isDarkMode ? "#cbd5e1" : "#475569"}
                  />
                </View>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholder="Enter Product Info"
                  placeholderTextColor={isDarkMode ? "#94a3b8" : "#6b7280"}
                  className={cn(
                    "flex-1 text-base",
                    isDarkMode ? "text-white" : "text-black"
                  )}
                />
              </View>
            )}
          />

          {errors.productInfo && (
            <Text className="text-red-500">*{errors.productInfo.message}</Text>
          )}
          <View className="mt-2" />
          {/* Installation Date */}
          <Pressable onPress={() => setDatePickerVisible(true)}>
            <Controller
              name="installationDate"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  icon="calendar"
                  placeholder="Select Installation Date"
                  value={value}
                  onChangeText={onChange}
                  editable={false}
                  onBlur={onBlur}
                />
              )}
            />
          </Pressable>
          {errors.installationDate && (
            <Text className="text-red-500">
              *{errors.installationDate.message}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <Pressable
          className={cn(
            "rounded-lg py-3 items-center",
            isSubmitting ? "bg-gray-400" : "bg-green-500"
          )}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Submit</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* DatePicker Modal */}
      <Modal
        visible={isDatePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <Pressable
          onPress={() => setDatePickerVisible(false)}
          className="flex-1 justify-center items-center bg-black/60 p-4"
        >
          <Pressable
            className={cn("rounded-lg p-6 w-full bg-white")}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              className={cn(
                "text-center font-semibold text-lg mb-4",
                isDarkMode ? "text-white" : "text-black"
              )}
            >
              Select Installation Date
            </Text>

            <DatePicker
              mode="single"
              date={
                watch("installationDate")
                  ? dayjs(watch("installationDate")).toDate()
                  : new Date()
              }
              onChange={({ date }) => {
                if (date) {
                  setValue(
                    "installationDate",
                    dayjs(date).format("YYYY-MM-DD")
                  );
                  setDatePickerVisible(false);
                }
              }}
              maxDate={dayjs().toDate()}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={isImageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/80 items-center justify-center"
          onPress={() => setImageModalVisible(false)}
        >
          <Image
            source={{ uri: invoiceFile?.uri }}
            resizeMode="contain"
            className="w-full h-[80%] rounded-md"
          />
        </Pressable>
      </Modal>
    </>
  );
}
