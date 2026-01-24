import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import MissionPage from './pages/Mission/MissionPage';
import UAVPage from './pages/UAVs/UAVPage';
import AddUAVPage from './pages/UAVs/AddUAV/AddUAVPage';
import UserPage from './pages/Users/UserPage';
import AddUserPage from './pages/Users/AddUser/AddUser';
import Layout from './components/Layouts/Layout';
import ProtectedAdminRoute from './components/Protected/ProtectedAdminRoute';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import AddMissionPage from './pages/Mission/AddMission/AddMission';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="missions" element={<MissionPage />} />
          <Route path="missions/new" element={<AddMissionPage />} />
          <Route path="uavs" element={<UAVPage />} />
          <Route path="users" element={<UserPage />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path="users/add" element={<AddUserPage />} />
              <Route path="uavs/add" element={<AddUAVPage />} />
            </Route>
          </Route>
        </Route>
        <Route index element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;