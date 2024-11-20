import { setLoading, setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const changehandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const navigate = useNavigate();
  const { user, loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (response.data.success) {
        const { user, token } = response.data;
  
        dispatch(setUser(user));
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
  
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      dispatch(setLoading(false)); // Ensure loading is reset
    }
  };
  

  return (
    <div className="flex items-center justify-center w-full mt-28 px-4">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded-lg w-full max-w-lg p-6 md:p-10"
      >
        <div className="mt-5 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold font-sans">
            Login to <span className="text-pink-500">Dribbble</span>
          </h1>
        </div>
        <div className="flex flex-col my-5 gap-2">
          <label htmlFor="" className="text-lg md:text-xl font-semibold">
            Email <span className="text-amber-500"> *</span>
          </label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changehandler}
            required
            placeholder="Enter your valid email"
            className="border border-gray-400 p-2 rounded-xl outline-none hover:border-pink-400 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg md:text-xl font-semibold">
            Password <span className="text-amber-500"> *</span>
          </label>
          <input
            type="password"
            required
            name="password"
            value={input.password}
            onChange={changehandler}
            placeholder="Enter your password"
            className="border border-gray-400 p-2 rounded-xl outline-none hover:border-pink-400 w-full"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 font-medium mt-2">{errorMessage}</p>
        )}
        <p className="my-4 text-sm md:text-base">
          Don't have an account?{" "}
          <Link to="/signup">
            <span className="text-blue-950 font-medium">Signup</span>
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
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
