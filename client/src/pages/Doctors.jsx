import { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';
import { getDoctors, getDoctorSlots } from '../services/doctorService';
import { bookAppointment } from '../services/appointmentService';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [slotsByDoctor, setSlotsByDoctor] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [booking, setBooking] = useState(null); // { doctor, slot }
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleToggle(doctor) {
    if (expandedId === doctor._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(doctor._id);
    if (!slotsByDoctor[doctor._id]) {
      setLoadingSlots(true);
      try {
        const slots = await getDoctorSlots(doctor._id);
        setSlotsByDoctor((prev) => ({ ...prev, [doctor._id]: slots }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }
  }

  async function refreshSlots(doctorId) {
    const slots = await getDoctorSlots(doctorId);
    setSlotsByDoctor((prev) => ({ ...prev, [doctorId]: slots }));
  }

  async function handleConfirmBooking(formData) {
    setSubmitting(true);
    setBookingError('');
    try {
      await bookAppointment({
        ...formData,
        doctorId: booking.doctor._id,
        slotId: booking.slot._id,
      });
      await refreshSlots(booking.doctor._id);
      setToast('Appointment booked successfully!');
      setBooking(null);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Our Doctors</h1>
      <p className="text-slate-500 mt-1">Choose a doctor and pick a slot that works for you.</p>

      {toast && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {toast}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 mt-6">Loading doctors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              slots={slotsByDoctor[doctor._id] || []}
              loadingSlots={loadingSlots && expandedId === doctor._id}
              expanded={expandedId === doctor._id}
              onToggle={() => handleToggle(doctor)}
              onSelectSlot={(slot) => {
                setBookingError('');
                setBooking({ doctor, slot });
              }}
            />
          ))}
        </div>
      )}

      {booking && (
        <BookingModal
          doctor={booking.doctor}
          slot={booking.slot}
          submitting={submitting}
          error={bookingError}
          onClose={() => setBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
