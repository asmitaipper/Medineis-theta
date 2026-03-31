const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicines: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
