const express = require('express');
const { db } = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.use(authenticateToken);

// Generate comprehensive contribution report for a project
router.get('/contribution-report/:projectId', (req, res) => {
  try {
    // Get project details
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get all groups and members
    const groups = db.prepare(`
      SELECT g.id, g.name, gm.student_id, u.name as student_name, u.email
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      JOIN users u ON gm.student_id = u.id
      WHERE g.project_id = ?
    `).all(req.params.projectId);

    // Get activity statistics per student
    const activityStats = db.prepare(`
      SELECT 
        a.user_id,
        a.group_id,
        COUNT(*) as total_activities,
        SUM(a.effort_score) as total_effort,
        AVG(a.effort_score) as avg_effort,
        COUNT(DISTINCT DATE(a.timestamp)) as active_days,
        MIN(a.timestamp) as first_activity,
        MAX(a.timestamp) as last_activity,
        SUM(CASE WHEN a.activity_type = 'create' THEN 1 ELSE 0 END) as creates,
        SUM(CASE WHEN a.activity_type = 'update' THEN 1 ELSE 0 END) as updates,
        SUM(CASE WHEN a.activity_type = 'comment' THEN 1 ELSE 0 END) as comments
      FROM activity_logs a
      WHERE a.project_id = ?
      GROUP BY a.user_id, a.group_id
    `).all(req.params.projectId);

    // Get peer feedback
    const peerFeedback = db.prepare(`
      SELECT 
        reviewee_id,
        AVG(contribution_score) as avg_contribution,
        AVG(quality_score) as avg_quality,
        AVG(collaboration_score) as avg_collaboration,
        COUNT(*) as feedback_count
      FROM peer_feedback
      WHERE project_id = ?
      GROUP BY reviewee_id
    `).all(req.params.projectId);

    // Build grouped data structure
    const groupedData = {};
    
    groups.forEach(g => {
      if (!groupedData[g.id]) {
        groupedData[g.id] = {
          group_id: g.id,
          group_name: g.name,
          members: []
        };
      }

      const stats = activityStats.find(s => s.user_id === g.student_id && s.group_id === g.id) || {};
      const feedback = peerFeedback.find(f => f.reviewee_id === g.student_id) || {};

      groupedData[g.id].members.push({
        student_id: g.student_id,
        student_name: g.student_name,
        email: g.email,
        activity_metrics: {
          total_activities: stats.total_activities || 0,
          total_effort: stats.total_effort || 0,
          avg_effort: stats.avg_effort || 0,
          active_days: stats.active_days || 0,
          first_activity: stats.first_activity,
          last_activity: stats.last_activity,
          creates: stats.creates || 0,
          updates: stats.updates || 0,
          comments: stats.comments || 0
        },
        peer_feedback: {
          avg_contribution: feedback.avg_contribution || null,
          avg_quality: feedback.avg_quality || null,
          avg_collaboration: feedback.avg_collaboration || null,
          feedback_count: feedback.feedback_count || 0
        }
      });
    });

    // Calculate group statistics and identify issues
    const report = Object.values(groupedData).map(group => {
      const efforts = group.members.map(m => m.activity_metrics.total_effort);
      const avgEffort = efforts.reduce((a, b) => a + b, 0) / efforts.length;
      const maxEffort = Math.max(...efforts);
      const minEffort = Math.min(...efforts);

      // Identify contribution issues
      const issues = [];
      group.members.forEach(member => {
        const effort = member.activity_metrics.total_effort;
        const activeDays = member.activity_metrics.active_days;

        // Low contribution warning
        if (effort < avgEffort * 0.5 && avgEffort > 5) {
          issues.push({
            student: member.student_name,
            type: 'low_contribution',
            severity: 'high',
            message: `${member.student_name} has significantly lower contribution (${effort.toFixed(1)} vs avg ${avgEffort.toFixed(1)})`
          });
        }

        // Inactive warning
        if (activeDays < 3 && avgEffort > 5) {
          issues.push({
            student: member.student_name,
            type: 'inactive',
            severity: 'medium',
            message: `${member.student_name} has been active only ${activeDays} days`
          });
        }

        // Dormant warning
        const daysSinceLastActivity = member.activity_metrics.last_activity 
          ? Math.floor((Date.now() - new Date(member.activity_metrics.last_activity)) / (1000 * 60 * 60 * 24))
          : 999;

        if (daysSinceLastActivity > 7) {
          issues.push({
            student: member.student_name,
            type: 'dormant',
            severity: 'high',
            message: `${member.student_name} has been inactive for ${daysSinceLastActivity} days`
          });
        }
      });

      return {
        ...group,
        statistics: {
          avg_effort: avgEffort,
          max_effort: maxEffort,
          min_effort: minEffort,
          effort_variance: maxEffort - minEffort,
          imbalance_ratio: maxEffort / (minEffort || 1)
        },
        issues
      };
    });

    res.json({
      project,
      groups: report,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report: ' + error.message });
  }
});

// Get active alerts for a project
router.get('/alerts/:projectId', (req, res) => {
  try {
    const alerts = db.prepare(`
      SELECT a.*, u.name as student_name
      FROM alerts a
      LEFT JOIN users u ON a.student_id = u.id
      WHERE a.project_id = ? AND a.is_resolved = 0
      ORDER BY a.severity DESC, a.created_at DESC
    `).all(req.params.projectId);
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Resolve an alert
router.patch('/alerts/:alertId/resolve', (req, res) => {
  try {
    db.prepare('UPDATE alerts SET is_resolved = 1, resolved_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.params.alertId);
    
    res.json({ message: 'Alert resolved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

module.exports = router;