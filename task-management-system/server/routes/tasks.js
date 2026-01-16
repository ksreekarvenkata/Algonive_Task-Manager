const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

// Create Task
router.post('/', authenticateToken, (req, res) => {
    const { title, description, status, due_date, assigned_to } = req.body;
    const created_by = req.user.id; // User ID from token
    const assignedId = assigned_to || created_by; // Default to self if not assigned

    const sql = `INSERT INTO tasks (title, description, status, due_date, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [title, description, status || 'Pending', due_date, assignedId, created_by];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch the created task to return it
        db.get("SELECT t.*, u.username as assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?", [this.lastID], (err, row) => {
            res.status(201).json(row);
        });
    });
});

// Get All Tasks (Visible to all or filtered by user - let's return all for transparency in this team app, or user-relevant)
// For "Small Teams", usually everyone can see everything, or filter by "My Tasks". Let's return all and let frontend filter.
router.get('/', authenticateToken, (req, res) => {
    // Join with users table to get assignee names
    const sql = `
    SELECT tasks.*, 
           u_assignee.username as assignee_name, 
           u_creator.username as creator_name 
    FROM tasks 
    LEFT JOIN users u_assignee ON tasks.assigned_to = u_assignee.id 
    LEFT JOIN users u_creator ON tasks.created_by = u_creator.id
    ORDER BY tasks.id DESC
  `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update Task
router.put('/:id', authenticateToken, (req, res) => {
    const { title, description, status, due_date, assigned_to } = req.body;
    const { id } = req.params;

    const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, assigned_to = ? WHERE id = ?`;
    const params = [title, description, status, due_date, assigned_to, id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Return updated task
        db.get(`
        SELECT tasks.*, 
           u_assignee.username as assignee_name, 
           u_creator.username as creator_name 
        FROM tasks 
        LEFT JOIN users u_assignee ON tasks.assigned_to = u_assignee.id 
        LEFT JOIN users u_creator ON tasks.created_by = u_creator.id
        WHERE tasks.id = ?`, [id], (err, row) => {
            res.json(row);
        });
    });
});

// Delete Task
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task deleted', changes: this.changes });
    });
});

module.exports = router;
