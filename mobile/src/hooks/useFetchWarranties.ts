import { useEffect, useState } from "react";
import { Warranty } from "@/src/types/warranty.types";
import useWarrantiesService from "@/src/hooks/useWarrantiesService";
import Toast from "react-native-toast-message";
import { debounce } from "lodash";

export default function useFetchWarranties() {
  const { getAllUserWarranties } = useWarrantiesService();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "clientName" | "productInfo" | "status" | "createdAt" | "updatedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const refreshWarranties = async () => {
    setRefreshing(true);
    try {
      const { data } = await getAllUserWarranties({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      setWarranties(data.data);
      setTotal(data.total);
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
    const fetchWarranties = async () => {
      try {
        setLoading(true);
        const { data } = await getAllUserWarranties({
          page,
          limit,
          search,
          sortBy,
          sortOrder,
        });

        setWarranties(data.data);
        setTotal(data.total);
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
    fetchWarranties();
  }, [page, limit, search, sortBy, sortOrder]);

  const handleSearchChange = debounce((text: string) => {
    setPage(1);
    setSearch(text);
  }, 500);

  const totalPages = Math.ceil(total / limit);

  return {
    warranties,
    loading,
    totalPages,
    refreshing,
    page,
    limit,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    handleSearchChange,
    refreshWarranties,
  };
}
