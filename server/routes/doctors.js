const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Slot = require('../models/Slot');

const router = express.Router();

// GET /api/doctors - list all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/:id/slots - list slots for a doctor
router.get('/:id/slots', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid doctor id' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const slots = await Slot.find({ doctorId: id }).sort({ date: 1, time: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch slots' });
  }
});

module.exports = router;
