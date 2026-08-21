export default function DoctorCard({ doctor, slots, loadingSlots, onSelectSlot, expanded, onToggle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{doctor.name}</h3>
          <span className="inline-block mt-1 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded-full">
            {doctor.specialty}
          </span>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-slate-500">Fee</p>
          <p className="text-lg font-bold text-slate-800">₹{doctor.fee}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600">{doctor.description}</p>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span>🩺 {doctor.experience} yrs experience</span>
      </div>

      <button
        onClick={onToggle}
        className="mt-auto bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl py-2.5 text-sm transition-colors"
      >
        {expanded ? 'Hide Slots' : 'View Available Slots'}
      </button>

      {expanded && (
        <div className="pt-2 border-t border-slate-100">
          {loadingSlots ? (
            <p className="text-sm text-slate-400 py-2">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">No slots available.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {slots.map((slot) => (
                <button
                  key={slot._id}
                  disabled={slot.isBooked}
                  onClick={() => onSelectSlot(slot)}
                  className={`text-xs font-medium rounded-lg py-2 px-2 border transition-colors ${
                    slot.isBooked
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                      : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  {slot.date} · {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
