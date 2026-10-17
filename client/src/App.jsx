import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import GuestRoom from './pages/GuestRoom';
import HostRoom from './pages/HostRoom';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host/:code"
        element={
          <ProtectedRoute>
            <HostRoom />
          </ProtectedRoute>
        }
      />
      <Route path="/room/:code" element={<GuestRoom />} />
      <Route path="/" element={<AuthPage />} />
    </Routes>
  );
}

export default App;