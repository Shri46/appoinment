import api from './api';

export async function getAppointments() {
  const { data } = await api.get('/appointments');
  return data;
}

export async function bookAppointment(payload) {
  const { data } = await api.post('/appointments', payload);
  return data;
}

export async function cancelAppointment(id) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}
