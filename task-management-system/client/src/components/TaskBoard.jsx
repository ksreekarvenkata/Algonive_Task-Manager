import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, User, Clock, CheckCircle } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('All');

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        due_date: '',
        assigned_to: '',
        status: 'Pending'
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setShowModal(false);
            setNewTask({ title: '', description: '', due_date: '', assigned_to: '', status: 'Pending' });
            fetchTasks();
        } catch (err) {
            alert('Failed to create task');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this task?')) {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        }
    };

    const handleStatusUpdate = async (task, newStatus) => {
        try {
            await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'All') return true;
        if (currentFilter === 'My Tasks') return task.assigned_to === currentUser?.id;
        return task.status === currentFilter;
    });

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Team Tasks</h1>
                    <p className="text-muted">Manage your team's workflow properly</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> New Task
                </button>
            </div>

            <div className="flex gap-2" style={{ marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
                {['All', 'My Tasks', 'Pending', 'In Progress', 'Completed'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setCurrentFilter(filter)}
                        className={`btn ${currentFilter === filter ? 'btn-primary' : ''}`}
                        style={{ backgroundColor: currentFilter === filter ? '' : 'var(--card-bg)' }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredTasks.map(task => {
                    const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && task.status !== 'Completed';

                    return (
                        <div key={task.id} className="card" style={{ borderLeft: isOverdue ? '4px solid var(--danger-color)' : '4px solid transparent' }}>
                            <div className="flex justify-between items-start">
                                <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                                    {task.status}
                                </span>
                                <div className="flex gap-2">
                                    {/* Simple Status Toggle for quick access */}
                                    {task.status !== 'Completed' && (
                                        <button className="text-muted" title="Mark Complete" onClick={() => handleStatusUpdate(task, 'Completed')}>
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    <button className="text-muted" onClick={() => handleDelete(task.id)} style={{ color: 'var(--danger-color)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{task.title}</h3>
                            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                {task.description || 'No description provided.'}
                            </p>

                            <div className="flex justify-between items-center text-sm text-muted" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{task.assignee_name || 'Unassigned'}</span>
                                </div>
                                {task.due_date && (
                                    <div className="flex items-center gap-2" style={{ color: isOverdue ? 'var(--danger-color)' : 'inherit' }}>
                                        <Clock size={16} />
                                        <span>{format(parseISO(task.due_date), 'MMM d')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
                        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                rows={3}
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Due Date</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%' }}
                                        value={newTask.due_date}
                                        onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Assign To</label>
                                    <select
                                        style={{ width: '100%' }}
                                        value={newTask.assigned_to}
                                        onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                    >
                                        <option value="">Me ({currentUser?.username})</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
