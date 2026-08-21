const statusStyles = {
  booked: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function AppointmentCard({ appointment, onCancel, cancelling }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800">{appointment.patientName}</h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${
              statusStyles[appointment.status] || 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {appointment.status}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {appointment.doctor ? `${appointment.doctor.name} · ${appointment.doctor.specialty}` : 'Doctor unavailable'}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">
          {appointment.date} at {appointment.time}
        </p>
      </div>

      {appointment.status === 'booked' && (
        <button
          onClick={() => onCancel(appointment._id)}
          disabled={cancelling}
          className="self-start sm:self-auto text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-xl px-4 py-2 disabled:opacity-60"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
        </button>
      )}
    </div>
  );
}
