import api from "./axios";

export const sendWhatsAppNotification = async ({ phone, type, data, customMessage }) => {
  const res = await api.post("/notifications/send-whatsapp", {
    phone,
    type,
    data,
    customMessage,
  });
  return res.data;
};

export const sendSmsNotification = async ({ phone, message, type }) => {
  const res = await api.post("/notifications/send-sms", {
    phone,
    message,
    type,
  });
  return res.data;
};

export const getNotificationLogs = async (limit = 50) => {
  const res = await api.get("/notifications/logs", { params: { limit } });
  return res.data;
};
