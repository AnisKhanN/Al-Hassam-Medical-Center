import api from "../api/axios";

export const useChangePassword = () => {
  const changePassword = async (payload) => {
    const { data } = await api.put("/settings/change-password", payload);
    return data;
  };

  return { changePassword };
};
