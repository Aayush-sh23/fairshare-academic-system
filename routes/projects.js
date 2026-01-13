const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.use(authenticateToken);

// Create new project (Faculty only)
router.post('/', (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Only faculty can create projects' });
  }

  const { title, description, start_date, end_date, milestones, groups } = req.body;
  
  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
  }

  const projectId = uuidv4();

  try {
    // Create project
    db.prepare('INSERT INTO projects (id, title, description, faculty_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)')
      .run(projectId, title, description, req.user.userId, start_date, end_date);

    // Create milestones if provided
    if (milestones && milestones.length > 0) {
      const stmt = db.prepare('INSERT INTO milestones (id, project_id, title, description, due_date, weight) VALUES (?, ?, ?, ?, ?, ?)');
      milestones.forEach(m => {
        stmt.run(uuidv4(), projectId, m.title, m.description, m.due_date, m.weight || 1.0);
      });
    }

    // Create groups if provided
    if (groups && groups.length > 0) {
      const groupStmt = db.prepare('INSERT INTO groups (id, project_id, name) VALUES (?, ?, ?)');
      const memberStmt = db.prepare('INSERT INTO group_members (id, group_id, student_id) VALUES (?, ?, ?)');
      
      groups.forEach(g => {
        const groupId = uuidv4();
        groupStmt.run(groupId, projectId, g.name);
        
        if (g.members && g.members.length > 0) {
          g.members.forEach(studentId => {
            memberStmt.run(uuidv4(), groupId, studentId);
          });
        }
      });
    }

    res.status(201).json({ 
      id: projectId, 
      message: 'Project created successfully',
      project: { id: projectId, title, start_date, end_date }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project: ' + error.message });
  }
});

// Get all projects for current user
router.get('/', (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'faculty') {
      projects = db.prepare('SELECT * FROM projects WHERE faculty_id = ? ORDER BY created_at DESC')
        .all(req.user.userId);
    } else {
      // Students see projects they're assigned to
      projects = db.prepare(`
        SELECT DISTINCT p.* FROM projects p
        JOIN groups g ON p.id = g.project_id
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.student_id = ?
        ORDER BY p.created_at DESC
      `).all(req.user.userId);
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project details by ID
router.get('/:id', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get milestones
    const milestones = db.prepare('SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date')
      .all(req.params.id);

    // Get groups with members
    const groups = db.prepare(`
      SELECT g.id, g.name, 
        GROUP_CONCAT(u.id || ':' || u.name || ':' || u.email) as members
      FROM groups g
      LEFT JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN users u ON gm.student_id = u.id
      WHERE g.project_id = ?
      GROUP BY g.id
    `).all(req.params.id);

    // Format groups with member details
    const formattedGroups = groups.map(g => ({
      id: g.id,
      name: g.name,
      members: g.members ? g.members.split(',').map(m => {
        const [id, name, email] = m.split(':');
        return { id, name, email };
      }) : []
    }));

    res.json({
      ...project,
      milestones,
      groups: formattedGroups
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

// Get all students (Faculty only)
router.get('/students/list', (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const students = db.prepare('SELECT id, name, email FROM users WHERE role = "student" ORDER BY name')
      .all();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;