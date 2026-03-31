const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../backend/middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Patient') {
      query.patient = req.user.id;
    } else if (req.query.patientId) {
      query.patient = req.query.patientId;
    }
    
    const records = await MedicalRecord.find(query).populate('patient', 'name email');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors can add records' });
    }

    const { patientId, history, diagnosis, medicines } = req.body;
    
    const record = new MedicalRecord({
      patient: patientId,
      history,
      diagnosis,
      medicines
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
