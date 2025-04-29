import { API_URLS } from "../api/api-urls";
import useAxiosPrivate from "./useAxiosPrivate";

const useWarrantiesService = () => {
  const axiosPrivate = useAxiosPrivate();
  const createWarranty = async (formData: FormData) => {
    try {
      const { warranties } = API_URLS;

      return axiosPrivate.post(warranties, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const getAllUserWarranties = async () => {
    try {
      const { userWarranties } = API_URLS;

      return axiosPrivate.get(userWarranties);
    } catch (error) {
      throw error;
    }
  };

  return { createWarranty, getAllUserWarranties };
};

export default useWarrantiesService;
