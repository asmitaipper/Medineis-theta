const express = require('express');
const router = express.Router();
const { protect } = require('../backend/middleware/authMiddleware');

const rules = [
  { trigger: ['fever', 'hot', 'temperature'], suggestion: 'Rest, hydrate, and take paracetamol if temperature > 38.5°C' },
  { trigger: ['cough', 'sore throat'], suggestion: 'Drink warm fluids, use lozenges, and monitor for shortness of breath' },
  { trigger: ['headache', 'migraine'], suggestion: 'Rest in a dark, quiet room and maintain hydration' },
  { trigger: ['stomach', 'nausea', 'vomit'], suggestion: 'Eat easily digestible foods like bananas, rice, or toast. Sip water slowly.' },
  { trigger: ['fatigue', 'tired'], suggestion: 'Ensure 8 hours of sleep, check iron levels, and reduce stress. Incorporate mild exercise.' }
];

router.post('/suggest', protect, (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ message: 'Symptoms are required' });
  
  const text = symptoms.toLowerCase();
  const suggestions = [];
  
  rules.forEach(rule => {
    if (rule.trigger.some(keyword => text.includes(keyword))) {
      suggestions.push(rule.suggestion);
    }
  });

  if (suggestions.length === 0) {
    suggestions.push('Based on these inputs, we recommend consulting a physician for an accurate diagnosis.');
  }

  res.json({ suggestions });
});

module.exports = router;
