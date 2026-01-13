const express = require('express');
const { db } = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.use(authenticateToken);

// Get activity logs for a project
router.get('/project/:projectId', (req, res) => {
  try {
    const { groupId, userId, startDate, endDate, limit = 100 } = req.query;
    
    let query = `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM activity_logs a
      JOIN users u ON a.user_id = u.id
      WHERE a.project_id = ?
    `;
    const params = [req.params.projectId];

    if (groupId) {
      query += ' AND a.group_id = ?';
      params.push(groupId);
    }

    if (userId) {
      query += ' AND a.user_id = ?';
      params.push(userId);
    }

    if (startDate) {
      query += ' AND a.timestamp >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND a.timestamp <= ?';
      params.push(endDate);
    }

    query += ` ORDER BY a.timestamp DESC LIMIT ${parseInt(limit)}`;

    const activities = db.prepare(query).all(...params);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get activity timeline for a specific user in a project
router.get('/user/:userId/project/:projectId', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, u.name as user_name
      FROM activity_logs a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ? AND a.project_id = ?
      ORDER BY a.timestamp DESC
    `).all(req.params.userId, req.params.projectId);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// Get activity summary statistics for a project
router.get('/summary/project/:projectId', (req, res) => {
  try {
    const summary = db.prepare(`
      SELECT 
        a.user_id,
        u.name as user_name,
        COUNT(*) as activity_count,
        SUM(a.effort_score) as total_effort,
        MIN(a.timestamp) as first_activity,
        MAX(a.timestamp) as last_activity,
        COUNT(DISTINCT DATE(a.timestamp)) as active_days
      FROM activity_logs a
      JOIN users u ON a.user_id = u.id
      WHERE a.project_id = ?
      GROUP BY a.user_id, u.name
      ORDER BY total_effort DESC
    `).all(req.params.projectId);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity summary' });
  }
});

module.exports = router;