import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors } from '../services/doctorService';
import { getAppointments } from '../services/appointmentService';

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [doctorList, appointmentList] = await Promise.all([getDoctors(), getAppointments()]);
        setDoctors(doctorList);
        setAppointments(appointmentList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcoming = appointments.filter((a) => a.status === 'booked');

  const stats = [
    { label: 'Available Doctors', value: doctors.length },
    { label: 'Upcoming Appointments', value: upcoming.length },
    { label: 'Total Bookings', value: appointments.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome to MediCare Appointments</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Find the right doctor, check available slots, and book your appointment in a few clicks — all in one
          place.
        </p>
        <Link
          to="/doctors"
          className="inline-block mt-5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors"
        >
          Find a Doctor
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{loading ? '—' : stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Upcoming Appointments</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-sm text-slate-500">
            You have no upcoming appointments.{' '}
            <Link to="/doctors" className="text-primary-600 font-medium hover:underline">
              Book one now
            </Link>
            .
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.slice(0, 3).map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {appt.doctor ? `${appt.doctor.name} · ${appt.doctor.specialty}` : 'Doctor unavailable'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appt.date} at {appt.time}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200 capitalize">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
