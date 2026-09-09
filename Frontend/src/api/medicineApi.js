import api from "./axios";

export const getMedicineByBarcode = async (barcode) => {
  const res = await api.get(`/medicines/barcode/${encodeURIComponent(barcode)}`);
  return res.data;
};

export const searchMedicines = async (params = {}) => {
  const res = await api.get("/medicines", { params });
  return res.data;
};
