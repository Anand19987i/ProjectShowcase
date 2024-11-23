import { Button } from '@/components/ui/button';
import { setLoading, setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: ""
  });
  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
   const [errorMessage, setErrorMessage] = useState("");
  const fileHandler = (e) => {
    setInput({ ...input, avatar: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("confirmPassword", input.confirmPassword);

    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status !== 400) {
        console.log("SignUp successfully");
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
      else {
        setErrorMessage("An error occurred. Please try again.")
      }
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col bg-slate-950 h-screen items-center">
      <form onSubmit={submitHandler} className="flex flex-col my-auto w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/3 gap-4">
        <div className="text-white font-bold text-3xl md:text-4xl">
          <h1>Sign Up to Blurb</h1>
        </div>
        <div className="flex flex-col text-white">
          <label>Name<span className="text-amber-500"> *</span></label>
          <input required type="text" placeholder="enter your name" onChange={changeHandler} name="name" value={input.name} className="p-3 rounded-lg outline-none text-black" />
        </div>
        <div className="flex flex-col text-white">
          <label>Email<span className="text-amber-500"> *</span></label>
          <input required type="email" placeholder="enter your valid email" onChange={changeHandler} name='email' value={input.email} className="p-3 rounded-lg outline-none text-black" />
        </div>
        <div className="flex flex-col text-white">
          <label>Password<span className="text-amber-500"> *</span></label>
          <input required type="password" placeholder="enter your password" onChange={changeHandler} name='password' value={input.password} className="p-3 rounded-lg outline-none text-black" />
        </div>
        <div className="flex flex-col text-white">
          <label>Confirm Password<span className="text-amber-500"> *</span></label>
          <input required type="password" placeholder="Re-enter your password" onChange={changeHandler} name='confirmPassword' value={input.confirmPassword} className="p-3 rounded-lg outline-none text-black" />
        </div>
        <div className="flex flex-col text-white">
          <label>Profile Image<span className="text-amber-500"> *</span></label>
          <input required type="file" onChange={fileHandler} name='avatar' accept="image/*" className="p-3 rounded-lg outline-none text-slate-900 bg-white cursor-pointer" />
        </div>
        {
          errorMessage && (<p className="text-red-500 mt-2">{errorMessage}</p>)
        }
        <div>
          <span className='text-gray-400'>Already have an account? <Link to="/login" className='text-blue-400'>Login</Link></span>
        </div>
        <div className="mx-auto my-4">
          <Button type="submit" className="font-bold text-slate-900 text-md p-5 bg-white hover:bg-gray-400" disabled={loading}>
            {loading ? (
              <div className="w-3 h-3 border-4 border-t-4 border-gray-300 border-solid rounded-full spinner"></div>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
