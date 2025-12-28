import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'sonner';

// Landing & Auth Pages
import LandingPage from './pages/LandingPage';
import CitizenLogin from './pages/CitizenLogin';
import StaffLogin from './pages/StaffLogin';

// Citizen Pages
import CitizenHome from './pages/citizen/CitizenHome';
import RequestDustbin from './pages/citizen/RequestDustbin';
import RaiseComplaint from './pages/citizen/RaiseComplaint';
import CitizenProfile from './pages/citizen/CitizenProfile';
import AwarenessVideos from './pages/citizen/AwarenessVideos';

// Village Staff Pages
import VillageStaffDashboard from './pages/village-staff/VillageStaffDashboard';
import VillageStaffProfile from './pages/village-staff/VillageStaffProfile';

// Cleaning Staff Pages
import CleaningStaffDashboard from './pages/cleaning-staff/CleaningStaffDashboard';
import CleaningStaffProfile from './pages/cleaning-staff/CleaningStaffProfile';
import TaskDetail from './pages/cleaning-staff/TaskDetail';
import CompleteTask from './pages/cleaning-staff/CompleteTask';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/staff/login/:role" element={<StaffLogin />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen/home" element={<CitizenHome />} />
          <Route path="/citizen/request-dustbin" element={<RequestDustbin />} />
          <Route path="/citizen/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/citizen/profile" element={<CitizenProfile />} />
          <Route path="/citizen/awareness" element={<AwarenessVideos />} />
          
          {/* Village Staff Routes */}
          <Route path="/village-staff/dashboard" element={<VillageStaffDashboard />} />
          <Route path="/village-staff/profile" element={<VillageStaffProfile />} />
          
          {/* Cleaning Staff Routes */}
          <Route path="/cleaning-staff/dashboard" element={<CleaningStaffDashboard />} />
          <Route path="/cleaning-staff/profile" element={<CleaningStaffProfile />} />
          <Route path="/cleaning-staff/task/:id" element={<TaskDetail />} />
          <Route path="/cleaning-staff/complete/:id" element={<CompleteTask />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}