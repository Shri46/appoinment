require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const Appointment = require('./models/Appointment');

const doctors = [
  {
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    experience: 12,
    fee: 800,
    description: 'Specialist in heart disease prevention, diagnosis, and treatment with over a decade of clinical experience.',
  },
  {
    name: 'Dr. Rohan Mehta',
    specialty: 'Dermatologist',
    experience: 8,
    fee: 600,
    description: 'Expert in skin, hair, and nail conditions, offering both medical and cosmetic dermatology care.',
  },
  {
    name: 'Dr. Neha Kapoor',
    specialty: 'General Physician',
    experience: 10,
    fee: 500,
    description: 'Provides comprehensive primary care for common illnesses, checkups, and preventive health advice.',
  },
];

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

function nextDates(count) {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function seed() {
  await connectDB();

  await Appointment.deleteMany({});
  await Slot.deleteMany({});
  await Doctor.deleteMany({});

  const createdDoctors = await Doctor.insertMany(doctors);
  const dates = nextDates(3);

  for (const doctor of createdDoctors) {
    const slotCount = 5 + Math.floor(Math.random() * 4); // 5-8 slots
    const slots = [];
    for (let i = 0; i < slotCount; i++) {
      const date = dates[i % dates.length];
      const time = TIMES[i % TIMES.length];
      slots.push({ doctorId: doctor._id, date, time, isBooked: false });
    }
    await Slot.insertMany(slots);
  }

  console.log(`Seeded ${createdDoctors.length} doctors with slots.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
