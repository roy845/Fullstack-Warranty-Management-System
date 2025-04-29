import { useEffect, useState } from "react";
import { Warranty } from "@/src/types/warranty.types";
import useWarrantiesService from "@/src/hooks/useWarrantiesService";
import Toast from "react-native-toast-message";

export default function useFetchWarranties() {
  const { getAllUserWarranties } = useWarrantiesService();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const { data } = await getAllUserWarranties();
      setWarranties(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Warranties fetch failed. Please try again.";

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

  const refreshWarranties = async () => {
    setRefreshing(true);
    try {
      const { data } = await getAllUserWarranties();
      setWarranties(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "❌ Warranties refresh failed. Please try again.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        visibilityTime: 5000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return { warranties, loading, refreshing, refreshWarranties };
}
