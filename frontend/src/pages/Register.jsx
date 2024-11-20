import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [input, setInput] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const [errorMessage, setErrorMessage] = useState('');
  const fileHandler = (e) => {
    setInput({ ...input, avatar: e.target.files[0] });
  };

  const navigate = useNavigate();
  const { user, loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('username', input.username);
    formData.append('email', input.email);
    formData.append('password', input.password);
    formData.append('confirmPassword', input.confirmPassword);

    if (input.avatar) {
      formData.append('avatar', input.avatar);
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${USER_API_END_POINT}/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("SignUp successfully");
        dispatch(setLoading(false));
        navigate('/login');
      }
    } catch (error) {
      dispatch(setLoading(false));
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      }
    }
    finally{
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 my-10">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl lg:text-3xl font-extrabold font-sans text-center">
          Sign up to <span className="text-pink-500">Dribbble</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label htmlFor="name" className="text-lg font-semibold">
              Name <span className="text-amber-500">*</span>
            </label>
            <input
              required
              name="name"
              value={input.name}
              onChange={changeHandler}
              type="text"
              className="border border-gray-400 p-2 rounded-xl hover:border-pink-300 outline-none"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="username" className="text-lg font-semibold">
              Username <span className="text-amber-500">*</span>
            </label>
            <input
              required
              name="username"
              value={input.username}
              onChange={changeHandler}
              type="text"
              className="border border-gray-400 p-2 rounded-xl hover:border-pink-300 outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-semibold">
            Email <span className="text-amber-500">*</span>
          </label>
          <input
            required
            name="email"
            value={input.email}
            onChange={changeHandler}
            type="email"
            placeholder="Enter your valid email"
            className="border border-gray-400 p-2 rounded-xl hover:border-pink-300 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-lg font-semibold">
            Password <span className="text-amber-500">*</span>
          </label>
          <input
            required
            name="password"
            value={input.password}
            onChange={changeHandler}
            type="password"
            placeholder="Enter your password"
            className="border border-gray-400 p-2 rounded-xl hover:border-pink-300 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-lg font-semibold">
            Confirm Password <span className="text-amber-500">*</span>
          </label>
          <input
            required
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={changeHandler}
            type="password"
            placeholder="Re-enter your password"
            className="border border-gray-400 p-2 rounded-xl hover:border-pink-300 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold">
            Profile Image <span className="text-amber-500">*</span>
          </label>
          <input
            type="file"
            name="avatar"
            onChange={fileHandler}
            accept="image/*"
            className="p-2 rounded-lg bg-white text-gray-700 cursor-pointer"
          />
        </div>
        {errorMessage && (
          <p className="text-red-600 font-medium">{errorMessage}</p>
        )}
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login">
            <span className="font-medium text-blue-950">Login</span>
          </Link>
        </p>
        {loading ? (
          <button
            type="submit"
            className="bg-slate-950 text-white py-3 rounded-2xl mx-auto my-5 flex items-center justify-center w-full"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </button>
        ) : (
          <button
            type="submit"
            className="flex bg-slate-950 text-white py-3 rounded-2xl mx-auto my-5 justify-center w-full"
          >
            Sign up
          </button>
        )}
      </form>
    </div>
  );
};

export default Register;
