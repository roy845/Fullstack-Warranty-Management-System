import { API_URLS } from "../api/api-urls";
import { UpdateUserSchema } from "../schemas/edit-profile.schema";
import useAxiosPrivate from "./useAxiosPrivate";

const useUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const getUser = async (id: string) => {
    try {
      const { getUser } = API_URLS;

      return axiosPrivate.get(`${getUser}/${id}`);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (id: string, updatedUser: UpdateUserSchema) => {
    try {
      const { updateUser } = API_URLS;

      return axiosPrivate.put(`${updateUser}/${id}`, updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const removeUser = async (id: string) => {
    try {
      const { removeUser } = API_URLS;

      return axiosPrivate.delete(`${removeUser}/${id}`);
    } catch (error) {
      throw error;
    }
  };

  return { getUser, updateUser, removeUser };
};

export default useUsers;
