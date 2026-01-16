import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <nav className="navbar">
                <Link to="/" className="logo">
                    <CheckSquare style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                    TaskFlow
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-muted">Hello, <b>{user.username}</b></span>
                            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
