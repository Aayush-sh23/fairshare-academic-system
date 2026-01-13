const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.use(authenticateToken);

// Activity logging helper
function logActivity(data) {
  const { user_id, project_id, group_id, activity_type, entity_type, entity_id, description, effort_score = 1.0, metadata } = data;
  
  try {
    db.prepare(`
      INSERT INTO activity_logs (id, user_id, project_id, group_id, activity_type, entity_type, entity_id, description, effort_score, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), user_id, project_id, group_id, activity_type, entity_type, entity_id, description, effort_score, metadata || null);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// Create new task
router.post('/', (req, res) => {
  const { group_id, milestone_id, title, description, assigned_to, priority, due_date } = req.body;
  
  if (!group_id || !title) {
    return res.status(400).json({ error: 'group_id and title are required' });
  }

  const taskId = uuidv4();

  try {
    db.prepare(`
      INSERT INTO tasks (id, group_id, milestone_id, title, description, assigned_to, priority, due_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(taskId, group_id, milestone_id, title, description, assigned_to, priority || 'medium', due_date, req.user.userId);

    // Log activity
    const group = db.prepare('SELECT project_id FROM groups WHERE id = ?').get(group_id);
    if (group) {
      logActivity({
        user_id: req.user.userId,
        project_id: group.project_id,
        group_id,
        activity_type: 'create',
        entity_type: 'task',
        entity_id: taskId,
        description: `Created task: ${title}`,
        effort_score: 2.0
      });
    }

    res.status(201).json({ 
      id: taskId, 
      message: 'Task created successfully',
      task: { id: taskId, title, status: 'todo' }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task: ' + error.message });
  }
});

// Get all tasks for a group
router.get('/group/:groupId', (req, res) => {
  try {
    const tasks = db.prepare(`
      SELECT t.*, 
        u.name as assigned_to_name, 
        c.name as created_by_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.group_id = ?
      ORDER BY t.created_at DESC
    `).all(req.params.groupId);
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update task status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  
  if (!['todo', 'in_progress', 'review', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const completed_at = status === 'completed' ? new Date().toISOString() : null;

  try {
    const task = db.prepare(`
      SELECT t.*, g.project_id 
      FROM tasks t
      JOIN groups g ON t.group_id = g.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?')
      .run(status, completed_at, req.params.id);

    // Log activity with appropriate effort score
    const effortScore = status === 'completed' ? 5.0 : 1.5;
    logActivity({
      user_id: req.user.userId,
      project_id: task.project_id,
      group_id: task.group_id,
      activity_type: 'update',
      entity_type: 'task',
      entity_id: req.params.id,
      description: `Updated task status to: ${status}`,
      effort_score: effortScore,
      metadata: JSON.stringify({ old_status: task.status, new_status: status })
    });

    res.json({ message: 'Task status updated successfully', status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Add comment to task
router.post('/:id/comments', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  const commentId = uuidv4();

  try {
    db.prepare('INSERT INTO comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)')
      .run(commentId, req.params.id, req.user.userId, content);

    // Log activity
    const task = db.prepare(`
      SELECT t.*, g.project_id 
      FROM tasks t
      JOIN groups g ON t.group_id = g.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (task) {
      logActivity({
        user_id: req.user.userId,
        project_id: task.project_id,
        group_id: task.group_id,
        activity_type: 'comment',
        entity_type: 'task',
        entity_id: req.params.id,
        description: `Added comment: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        effort_score: 1.0
      });
    }

    res.status(201).json({ 
      id: commentId, 
      message: 'Comment added successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a task
router.get('/:id/comments', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = ?
      ORDER BY c.created_at ASC
    `).all(req.params.id);
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;