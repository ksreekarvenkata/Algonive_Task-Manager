import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import TaskBoard from './components/TaskBoard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          } />
          <Route path="login" element={<AuthForm type="login" />} />
          <Route path="register" element={<AuthForm type="register" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
