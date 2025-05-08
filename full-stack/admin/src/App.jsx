import React, { useContext } from 'react'
// import { DoctorContext } from './context/DoctorContext';
import { EmployeeContext } from './context/EmployeeContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllBooking from './pages/Admin/AllBooking';
import AddService from './pages/Admin/AddService';
import ServiceList from './pages/Admin/Servicelist';
import AddDoctor from './pages/Admin/AddEmployee';
import DoctorsList from './pages/Admin/EmployeeList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Employee/EmployeeAppointments';
import DoctorDashboard from './pages/Employee/Employeedashboard';
import DoctorProfile from './pages/Employee/Employeeprofile';
import AddEmployee from './pages/Admin/AddEmployee';
import EmployeeList from './pages/Admin/EmployeeList';
import Employeedashboard from './pages/Employee/Employeedashboard';
import EmployeeAppointments from './pages/Employee/EmployeeAppointments';
import Employeeprofile from './pages/Employee/Employeeprofile';

const App = () => {

  const { dToken } = useContext(EmployeeContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-bookings' element={<AllBooking />} />
          <Route path='/add-employee' element={<AddEmployee />} />
          <Route path='/employee-list' element={<EmployeeList />} />
          <Route path='/add-service' element={<AddService />} />
          <Route path='/service-list' element={<ServiceList />} />
          <Route path='/employee-dashboard' element={<Employeedashboard />} />
          <Route path='/employee-appointments' element={<EmployeeAppointments />} />
          <Route path='/employee-profile' element={<Employeeprofile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App