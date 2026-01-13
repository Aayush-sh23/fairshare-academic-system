const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.use(authenticateToken);

// Submit peer feedback (Students only)
router.post('/', (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can submit peer feedback' });
  }

  const { project_id, group_id, reviewee_id, contribution_score, quality_score, collaboration_score, comments } = req.body;
  
  if (!project_id || !group_id || !reviewee_id) {
    return res.status(400).json({ error: 'project_id, group_id, and reviewee_id are required' });
  }

  if (req.user.userId === reviewee_id) {
    return res.status(400).json({ error: 'Cannot review yourself' });
  }

  const feedbackId = uuidv4();

  try {
    db.prepare(`
      INSERT OR REPLACE INTO peer_feedback 
      (id, project_id, group_id, reviewer_id, reviewee_id, contribution_score, quality_score, collaboration_score, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      feedbackId, 
      project_id, 
      group_id, 
      req.user.userId, 
      reviewee_id, 
      contribution_score, 
      quality_score, 
      collaboration_score, 
      comments
    );

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback: ' + error.message });
  }
});

// Get all feedback for a project (Faculty only)
router.get('/project/:projectId', (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Only faculty can view all feedback' });
  }

  try {
    const feedback = db.prepare(`
      SELECT pf.*, 
        r.name as reviewer_name,
        rv.name as reviewee_name
      FROM peer_feedback pf
      JOIN users r ON pf.reviewer_id = r.id
      JOIN users rv ON pf.reviewee_id = rv.id
      WHERE pf.project_id = ?
      ORDER BY pf.submitted_at DESC
    `).all(req.params.projectId);
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback summary for a specific student
router.get('/student/:studentId/project/:projectId', (req, res) => {
  // Only faculty or the student themselves can view
  if (req.user.role !== 'faculty' && req.user.userId !== req.params.studentId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const summary = db.prepare(`
      SELECT 
        AVG(contribution_score) as avg_contribution,
        AVG(quality_score) as avg_quality,
        AVG(collaboration_score) as avg_collaboration,
        COUNT(*) as feedback_count,
        GROUP_CONCAT(comments, ' | ') as all_comments
      FROM peer_feedback
      WHERE reviewee_id = ? AND project_id = ?
    `).get(req.params.studentId, req.params.projectId);
    
    res.json(summary || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback summary' });
  }
});

module.exports = router;