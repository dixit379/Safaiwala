import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const gujaratCities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari'];

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [formKey, setFormKey] = useState(0); // Forces UI to re-render when state changes
   
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
    // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
  const isValidDOB = (dob) => {
    const selectedDate = new Date(dob);
    const today = new Date();
    return selectedDate < today; // DOB must be in the past
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      if (!isValidEmail(email)) return toast.error('Invalid email format');
      if (!isValidPhone(phone)) return toast.error('Phone number must be 10 digits and start with 6-9');
      if (!gujaratCities.includes(city)) return toast.error('City must be in Gujarat');
      if (!isValidDOB(dob)) return toast.error('DOB cannot be today or a future date');
      if (!isValidPassword(password)) return toast.error('Password must be 8+ chars with 1 uppercase & 1 special character');
      if (password !== confirmPassword) return toast.error('Passwords do not match');

      const { data } = await axios.post(`${backendUrl}/api/user/register`, {
        name, email, phone, dob, gender, city, address, password
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem("userId", data.user._id); 
        setToken(data.token);
        navigate('/my-profile');
      } else {
        toast.error(data.message);
      }
    }
  };
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  return (
    <form key={formKey} onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to continue</p>

        {state === 'Sign Up' && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded w-full p-2 mt-1' type='text' required />
            </div>
            <div className='w-full'>
              <p>Phone</p>
              <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border rounded w-full p-2 mt-1' type='text' required />
            </div>
            <div className='w-full'>
              <p>Date of Birth</p>
              <input 
                onChange={(e) => setDob(e.target.value)} 
                value={dob} 
                className='border rounded w-full p-2 mt-1' 
                type='date' 
                required 
                max={new Date().toISOString().split("T")[0]} // Prevents future dates
              />
            </div>
            <div className='w-full'>
              <p>Gender</p>
              <select onChange={(e) => setGender(e.target.value)} value={gender} className='border rounded w-full p-2 mt-1' required>
                <option value=''>Select</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>
            <div className='w-full'>
              <p>City</p>
              <select onChange={(e) => setCity(e.target.value)} value={city} className='border rounded w-full p-2 mt-1' required>
                <option value=''>Select City</option>
                {gujaratCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <p>Address</p>
              <input onChange={(e) => setAddress(e.target.value)} value={address} className='border rounded w-full p-2 mt-1' type='text' required />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded w-full p-2 mt-1' type='email' required />
        </div>
        <div className='w-full relative'>
          <p>Password</p>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className='border rounded w-full p-2 mt-1 pr-10' 
            required 
          />
          <button 
            type="button" 
            onClick={togglePassword} 
            className='absolute right-3 top-10 transform -translate-y-1/2 text-gray-500'>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password Field (Only for Sign Up) */}
        {state === 'Sign Up' && (
          <div className='w-full relative'>
            <p>Confirm Password</p>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className='border rounded w-full p-2 mt-1 pr-10' 
              required 
            />
            <button 
              type="button" 
              onClick={toggleConfirmPassword} 
              className='absolute right-3 top-10 transform -translate-y-1/2 text-gray-500'>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        <p>
          {state === 'Sign Up' ? 'Already have an account?' : 'Create a new account?'}
          <span
            onClick={() => {
              setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
              setFormKey(prevKey => prevKey + 1);
            }}
            className='text-primary underline cursor-pointer'
          >
            {state === 'Sign Up' ? ' Login here' : ' Click here'}
          </span>
        </p>

        <button type="submit" className={`bg-${state === 'Sign Up' ? 'green' : 'blue'}-500 text-white w-full py-2 my-2 rounded-md text-base hover:bg-${state === 'Sign Up' ? 'green' : 'blue'}-600 transition-all`}>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Login;
