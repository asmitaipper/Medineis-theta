const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mednexis';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create a Doctor
    const doctorSalt = await bcrypt.genSalt(10);
    const doctorPassword = await bcrypt.hash('doc123', doctorSalt);
    const doctor = new User({
      name: 'Gregory House',
      email: 'house@mednexis.com',
      password: doctorPassword,
      role: 'Doctor'
    });
    await doctor.save();

    // 2. Create a Patient
    const patientSalt = await bcrypt.genSalt(10);
    const patientPassword = await bcrypt.hash('pat123', patientSalt);
    const patient = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: patientPassword,
      role: 'Patient'
    });
    await patient.save();

    console.log('Created Doctor:', doctor.name);
    console.log('Created Patient:', patient.name);

    // 3. Create an Appointment
    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctor._id,
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      status: 'Confirmed'
    });
    await appointment.save();
    console.log('Created Appointment for tomorrow.');

    // 4. Create a Medical Record
    const record = new MedicalRecord({
      patient: patient._id,
      history: 'Patient complains of severe headache and mild fever for 2 days. No prior chronic illnesses.',
      diagnosis: 'Migraine and Mild Viral Infection',
      medicines: 'Paracetamol 500mg, Ibuprofen 400mg as needed'
    });
    await record.save();
    console.log('Created Medical Record with diagnosis:', record.diagnosis);

    console.log('\n================================');
    console.log('   SAMPLE DATA IN MONGODB DB    ');
    console.log('================================\n');

    console.log('--- USERS (Doctors & Patients) ---');
    const users = await User.find().select('-password');
    console.log(JSON.stringify(users, null, 2));

    console.log('\n--- APPOINTMENTS ---');
    const appts = await Appointment.find().populate('doctor', 'name').populate('patient', 'name');
    console.log(JSON.stringify(appts, null, 2));

    console.log('\n--- MEDICAL RECORDS ---');
    const recs = await MedicalRecord.find().populate('patient', 'name');
    console.log(JSON.stringify(recs, null, 2));

    console.log('\n================================');
    console.log('✅ Database Seeded Successfully!');
    console.log('You can now open MongoDB Compass, connect to mongodb://localhost:27017, and view the "mednexis" database.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
