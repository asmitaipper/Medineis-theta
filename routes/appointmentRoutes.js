const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../backend/middleware/authMiddleware');

// Get appointments (Admins see all, patients see theirs, doctors see theirs)
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'Doctor') {
      filter.doctor = req.user.id;
    } // Admin sees all (filter remains empty)
    
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialty')
      .sort({ date: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment - INTELLIGENT ROUTING
router.post('/', protect, async (req, res) => {
  try {
    const { date, diseaseCategory } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'Patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }
    
    // Intelligent Routing Logic
    let targetSpecialty = 'General Physician';
    let priority = 'Low';
    
    if (diseaseCategory === 'Brain/Neurological') {
      targetSpecialty = 'Neurologist';
      priority = 'High';
    } else if (diseaseCategory === 'Heart/Cardiovascular') {
      targetSpecialty = 'Cardiologist';
      priority = 'High';
    } else if (diseaseCategory === 'Bone/Orthopedic') {
      targetSpecialty = 'Orthopedist';
      priority = 'Medium';
    } else {
      targetSpecialty = 'General Physician';
      priority = 'Low';
    }

    const User = require('../models/User');
    // Find absolute closest matching Doctor
    let doctor = await User.findOne({ role: 'Doctor', specialty: targetSpecialty });
    // Fallback if no specialist exists
    if (!doctor) {
      doctor = await User.findOne({ role: 'Doctor' });
    }
    if (!doctor) {
      return res.status(400).json({ message: 'No doctors are currently available in the system.' });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctor._id,
      date,
      diseaseCategory: diseaseCategory || 'General',
      priority
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
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
