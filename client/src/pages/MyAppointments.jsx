import { useEffect, useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import { getAppointments, cancelAppointment } from '../services/appointmentService';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    getAppointments()
      .then(setAppointments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  async function handleCancel(id) {
    setCancellingId(id);
    setError('');
    try {
      await cancelAppointment(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
      <p className="text-slate-500 mt-1">View and manage your booked appointments.</p>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 mt-6">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-sm text-slate-500 mt-6">
          No appointments found.
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onCancel={handleCancel}
              cancelling={cancellingId === appt._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
