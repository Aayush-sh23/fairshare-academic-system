const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const activityRoutes = require('./routes/activity');
const analyticsRoutes = require('./routes/analytics');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'FairShare API - Academic Contribution Accountability System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      tasks: '/api/tasks',
      activity: '/api/activity',
      analytics: '/api/analytics',
      feedback: '/api/feedback'
    }
  });
});

// Initialize database and start server
initializeDatabase();
app.listen(PORT, () => {
  console.log(`🎓 FairShare server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
});