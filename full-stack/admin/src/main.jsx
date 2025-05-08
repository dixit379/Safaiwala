import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
// import DoctorContextProvider from './context/DoctorContext.jsx'
import EmployeeContextProvider  from './context/EmployeeContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <EmployeeContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </EmployeeContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
