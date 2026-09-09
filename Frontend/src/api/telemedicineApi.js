import api from "./axios";

export const createTelemedicineRoom = async ({ appointmentId, customRoomId }) => {
  const res = await api.post("/telemedicine/create-room", {
    appointmentId,
    customRoomId,
  });
  return res.data;
};

export const getTelemedicineRoom = async (roomId) => {
  const res = await api.get(`/telemedicine/room/${roomId}`);
  return res.data;
};

export const sendTelemedicineSignal = async (roomId, { signalType, payload, senderId }) => {
  const res = await api.post(`/telemedicine/room/${roomId}/signal`, {
    signalType,
    payload,
    senderId,
  });
  return res.data;
};

export const endTelemedicineConsultation = async (roomId, { clinicalNotes, vitals, prescription }) => {
  const res = await api.post(`/telemedicine/room/${roomId}/end`, {
    clinicalNotes,
    vitals,
    prescription,
  });
  return res.data;
};
