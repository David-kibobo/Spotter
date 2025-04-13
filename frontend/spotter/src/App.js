
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/dashboard/dashboardLayout';
import MapPage from './components/dashboard/maps/MapPage';
import ELDLogsPage from './components/dashboard/ELD/ELDLogsPage';
import TripsPage from './components/dashboard/Trips/TripsPage';
import SettingsPage from './components/dashboard/settings/SettingsPage';
import DashboardHome from './components/dashboard/Home';
import AdminPanel from './components/dashboard/AdminPanel';
import { fetchCurrentUser } from './api/endPoints';
import ELDLogsView from './components/dashboard/ELD/ELDLogsView';
import CarrierELDLogs from './components/dashboard/ELD/CarrierELDLogs';
import DriverELDLogs from './components/dashboard/ELD/DriverELDLogs';
import { ToastContainer } from 'react-toastify';
import GlobalSpinner from './utils/GloberSpinner';
import { GlobalStyle } from './styles/GlobalStyles';
import RequireAuth from './utils/RequireAuth';
import DriverHomePage from './components/dashboard/DriversHomePage';
function App() {

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && status === "idle") {  // ✅ Prevents infinite re-fetching
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, status]); 
  const DashboardRoutes=()=>{
    const getHomeComponent = () => {
      if (user?.role === "Driver") return <DriverHomePage />;
      return <DashboardHome />; // Default: carrier owner or dispatcher
    };
      return(
        <Routes>
          <Route path= '/' element={<Dashboard />}>
          <Route index element={getHomeComponent()} />
          <Route path= '/view-map' element={<MapPage/>}/>
          <Route path="/eld-logs/carrier" element={<CarrierELDLogs />} />
          <Route path="/eld-logs/driver" element={<DriverELDLogs />} />

          <Route path= '/trips' element={<TripsPage/>}/>
          <Route path= '/admin-panel' element={<AdminPanel/>}/>
          <Route path= '/settings' element={<SettingsPage/>}/>
          
          </Route>
           
        </Routes>
      )
    }

  return (
    <Router>
      <GlobalStyle/>
      <GlobalSpinner/>  {/* Only shows when any request is loading */}
       <ToastContainer position="top-right" autoClose={3000} />
       <Routes>
  <Route path="/" element={<LandingPage />} />

  {/* Auto redirect based on role */}
  <Route path="/dashboard-redirect" element={<RequireAuth />} />

  {/* Carrier / Dispatcher */}
  <Route path="/dashboard/*" element={<DashboardRoutes />} />

  {/* Driver-only homepage */}
  <Route path="/dashboard/driver" element={<DriverHomePage />} />
</Routes>

    </Router>
  );
}

export default App;
