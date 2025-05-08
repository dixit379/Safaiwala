import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
// import { DoctorContext } from '../context/DoctorContext'
import { EmployeeContext } from '../context/EmployeeContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(EmployeeContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && <ul className='text-[#515151] mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-bookings'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Bookings</p>
        </NavLink>
        <NavLink to={'/add-Employee'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add ServiceMen</p>
        </NavLink>
        <NavLink to={'/employee-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>ServiceMen List</p>
        </NavLink>
        <NavLink to={'/add-service'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Service</p>
        </NavLink>
        <NavLink to={'/service-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Service List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-[#515151] mt-5'>
        <NavLink to={'/Employee-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/employee-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/employee-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar