import api from './api';

export async function getDoctors() {
  const { data } = await api.get('/doctors');
  return data;
}

export async function getDoctorSlots(doctorId) {
  const { data } = await api.get(`/doctors/${doctorId}/slots`);
  return data;
}
