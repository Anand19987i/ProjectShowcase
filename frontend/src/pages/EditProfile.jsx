import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { setUser } from '../redux/authSlice';
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const dispatch = useDispatch();

    // Update form state when user data from Redux store changes
    useEffect(() => {
        if (user) {
            setInput({
                name: user.name || "",
                email: user.email || ""
            });
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("email", input.email);
        if (avatar) {
            formData.append("avatar", avatar);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${USER_API_END_POINT}/profile/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                setOpen(false);
                navigate("/login");
            } else {
                setError("Profile update failed.");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white" aria-describedby={undefined} onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle className='text-white font-md'>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='flex flex-col gap-4'>
                        <div className="flex flex-col text-black">
                            <label>Name<span className="text-amber-500"> *</span></label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                onChange={changeEventHandler}
                                name="name"
                                value={input.name}
                                className="p-3 rounded-lg bg-gray-200 outline-none text-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col text-black">
                            <label>Email<span className="text-amber-500"> *</span></label>
                            <input
                                type="email"
                                placeholder="Enter your valid email"
                                onChange={changeEventHandler}
                                name="email"
                                value={input.email}
                                className="p-3 rounded-lg bg-gray-200 outline-none text-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col text-black">
                            <label>Profile Image</label>
                            <input
                                type="file"
                                onChange={fileChangeHandler}
                                name="avatar"
                                accept="image/*"
                                className="p-3 rounded-lg outline-none text-slate-900 bg-gray-200 cursor-pointer"
                            />
                            {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-48 h-auto rounded-md mx-auto mt-2" />}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <DialogFooter className="mt-5">
                        {loading ? (
                            <button
                                type="submit"
                                className="bg-slate-950 text-white py-3 rounded-lg mx-auto my-5 flex items-center justify-center w-32"
                            >
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="flex bg-slate-950 text-white py-3 rounded-lg mx-auto my-5 justify-center w-32 "
                            >
                                Update
                            </button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfile;