const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../backend/middleware/authMiddleware');

// Get appointments for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'Doctor') {
      filter.doctor = req.user.id;
    }
    
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'Patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    
    appointment.status = status;
    await appointment.save();
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
