const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

const router = express.Router();

const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/appointments - book an appointment
router.post('/', async (req, res) => {
  try {
    const { patientName, email, phone, doctorId, slotId } = req.body;

    if (!patientName || !email || !phone || !doctorId || !slotId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }
    if (!mongoose.isValidObjectId(doctorId) || !mongoose.isValidObjectId(slotId)) {
      return res.status(400).json({ message: 'Invalid doctor or slot id' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const slot = await Slot.findOne({ _id: slotId, doctorId });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found for this doctor' });
    }
    if (slot.isBooked) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }

    slot.isBooked = true;
    await slot.save();

    const appointment = await Appointment.create({
      patientName,
      email,
      phone,
      doctorId,
      slotId,
      date: slot.date,
      time: slot.time,
      status: 'booked',
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
});

// GET /api/appointments - list appointments (with doctor info attached)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).populate('doctorId');
    const result = appointments.map((appt) => ({
      _id: appt._id,
      patientName: appt.patientName,
      email: appt.email,
      phone: appt.phone,
      date: appt.date,
      time: appt.time,
      status: appt.status,
      createdAt: appt.createdAt,
      doctor: appt.doctorId
        ? {
            _id: appt.doctorId._id,
            name: appt.doctorId.name,
            specialty: appt.doctorId.specialty,
          }
        : null,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// DELETE /api/appointments/:id - cancel an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(409).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
});

module.exports = router;
