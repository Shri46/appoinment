import { useState } from 'react';

export default function BookingModal({ doctor, slot, onClose, onConfirm, submitting, error }) {
  const [form, setForm] = useState({ patientName: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientName.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }
    setFormError('');
    onConfirm(form);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-800">Book Appointment</h2>
        <p className="text-sm text-slate-500 mt-1">
          {doctor.name} · {doctor.specialty}
        </p>
        <p className="text-sm text-primary-700 font-medium mt-1">
          {slot.date} at {slot.time}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-slate-600">Full Name</label>
            <input
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="9876543210"
            />
          </div>

          {(formError || error) && <p className="text-sm text-red-600">{formError || error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
