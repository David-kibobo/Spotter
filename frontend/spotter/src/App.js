
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/dashboard/dashboardLayout';
import MapPage from './components/dashboard/MapPage';
import ELDLogsPage from './components/dashboard/ELD/ELDLogsPage';
import TripsPage from './components/dashboard/Trips/TripsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import DashboardHome from './components/dashboard/Home';
import AdminPanel from './components/dashboard/AdminPanel';
import { fetchCurrentUser } from './api/endPoints';
import ELDLogsView from './components/dashboard/ELD/ELDLogsView';
import CarrierELDLogs from './components/dashboard/ELD/CarrierELDLogs';
import DriverELDLogs from './components/dashboard/ELD/DriverELDLogs';
function App() {

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && status === "idle") {  // ✅ Prevents infinite re-fetching
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, status]); 
  const DashboardRoutes=()=>{
      return(
        <Routes>
          <Route path= '/' element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path= '/view-map' element={<MapPage/>}/>
          {/* <Route path= '/eld-logs' element={<ELDLogsPage/>}/> */}
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
      <Routes>
        <Route path="/" element={<LandingPage />} />

         <Route path= "/dashboard/*" element={<DashboardRoutes />}/>
      </Routes>
    </Router>
  );
}

export default App;
