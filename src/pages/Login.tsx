import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Password පෙන්වීම සඳහා State එකක්

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (value.trim() !== '') {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { email: '', password: '' };

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        try {
            const response = await API.post('/users/login', formData);
            const { accessToken, refreshToken, user } = response.data.data; 

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            alert('Login Successful!');
            
            navigate('/dashboard');

        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-white via-blue-50 to-blue-200">
            <div className="relative w-full max-w-md px-6">
                
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-[#0a192f] rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                    <UserIcon className="w-10 h-10 text-white" />
                </div>

                <form onSubmit={handleSubmit} className="bg-white pt-16 pb-8 px-8 rounded-2xl shadow-2xl relative border border-blue-100">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#0a192f]">Welcome Back</h2>
                    {serverError && <p className="text-red-500 mb-4 text-sm text-center">{serverError}</p>}
                    
                    {/* Email Field */}
                    <div className="relative mb-5">
                        <div className="relative flex items-center">
                            <Mail className={`absolute left-3 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email ID" 
                                value={formData.email}
                                onChange={handleChange} 
                                className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm transition-colors ${
                                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#0a192f]'
                                }`} 
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-xs mt-1 block ml-1">{errors.email}</span>}
                    </div>
                    
                    {/* Password Field */}
                    <div className="relative mb-6">
                        <div className="relative flex items-center">
                            <Lock className={`absolute left-3 w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleChange} 
                                className={`w-full pl-12 pr-12 py-3 border-b focus:outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm transition-colors ${
                                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#0a192f]'
                                }`} 
                            />
                            {/* Eye Icon Button */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-500 text-xs mt-1 block ml-1">{errors.password}</span>}
                    </div>
                    
                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-[#0a192f] hover:bg-[#112240] text-white py-3.5 rounded-lg font-semibold tracking-wider transition shadow-md">
                        LOGIN
                    </button>

                    {/* Don't have an account link */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#0a192f] font-bold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}