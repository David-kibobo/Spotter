
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage';
import Dashboard from './components/dashboard/dashboardLayout';
import MapPage from './components/dashboard/MapPage';
import ELDLogsPage from './components/dashboard/ELD/ELDLogsPage';
import TripsPage from './components/dashboard/Trips/TripsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import DashboardHome from './components/dashboard/Home';
import AdminPanel from './components/dashboard/AdminPanel';

function App() {


  const DashboardRoutes=()=>{
      return(
        <Routes>
          <Route path= '/' element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path= '/view-map' element={<MapPage/>}/>
          <Route path= '/eld-logs' element={<ELDLogsPage/>}/>
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
