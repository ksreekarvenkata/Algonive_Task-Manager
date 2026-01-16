import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const isRegister = type === 'register';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const response = await api.post(endpoint, formData);

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {isRegister && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        {isRegister ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <span
                        style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => navigate(isRegister ? '/login' : '/register')}
                    >
                        {isRegister ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
