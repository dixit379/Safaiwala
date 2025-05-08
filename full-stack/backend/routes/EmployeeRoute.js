import express from 'express';
import { loginEmployee, appointmentsEmployee, appointmentCancel, Employeelist, changeAvailablity, appointmentComplete, EmployeeDashboard, EmployeeProfile, updateEmployeeProfile } from '../controllers/EmployeeController.js';
// import authDoctor from '../middleware/authDoctor.js';
import authEmployee from '../middleware/authEmployee.js';
const EmployeeRouter = express.Router();

EmployeeRouter.post("/login", loginEmployee)
EmployeeRouter.post("/cancel-appointment", authEmployee, appointmentCancel)
EmployeeRouter.get("/appointments", authEmployee, appointmentsEmployee)
EmployeeRouter.get("/list", Employeelist)
EmployeeRouter.post("/change-availability", authEmployee, changeAvailablity)
EmployeeRouter.post("/complete-appointment", authEmployee, appointmentComplete)
EmployeeRouter.get("/dashboard", authEmployee, EmployeeDashboard)
EmployeeRouter.get("/profile", authEmployee, EmployeeProfile)
EmployeeRouter.post("/update-profile", authEmployee, updateEmployeeProfile)

export default EmployeeRouter;