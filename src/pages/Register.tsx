import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CUSTOMER' 
    });
    
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
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
        let newErrors = { name: '', email: '', password: '', phone: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
            valid = false;
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
            valid = false;
        }

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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
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
            await API.post('/users/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-white via-blue-50 to-blue-200">
            <div className="relative w-full max-w-md px-6">
                
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-[#0a192f] rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                    <User className="w-10 h-10 text-white" />
                </div>

                <form onSubmit={handleSubmit} className="bg-white pt-16 pb-8 px-8 rounded-2xl shadow-2xl relative border border-blue-100">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#0a192f]">Create Account</h2>
                    {serverError && <p className="text-red-500 mb-4 text-sm text-center">{serverError}</p>}
                    
                    {/* Full Name */}
                    <div className="relative mb-4">
                        <div className="relative flex items-center">
                            <User className={`absolute left-3 w-5 h-5 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Full Name (Min 3 chars)" 
                                value={formData.name}
                                onChange={handleChange} 
                                className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm transition-colors ${
                                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#0a192f]'
                                }`} 
                            />
                        </div>
                        {errors.name && <span className="text-red-500 text-xs mt-1 block ml-1">{errors.name}</span>}
                    </div>

                    {/* Email Address */}
                    <div className="relative mb-4">
                        <div className="relative flex items-center">
                            <Mail className={`absolute left-3 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email Address" 
                                value={formData.email}
                                onChange={handleChange} 
                                className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm transition-colors ${
                                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#0a192f]'
                                }`} 
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-xs mt-1 block ml-1">{errors.email}</span>}
                    </div>
                    
                    {/* Password */}
                    <div className="relative mb-4">
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

                    {/* Phone Number */}
                    <div className="relative mb-6">
                        <div className="relative flex items-center">
                            <Phone className={`absolute left-3 w-5 h-5 ${errors.phone ? 'text-red-500' : 'text-gray-400'}`} />
                            <input 
                                type="text" 
                                name="phone" 
                                placeholder="Phone Number" 
                                value={formData.phone}
                                onChange={handleChange} 
                                className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm transition-colors ${
                                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#0a192f]'
                                }`} 
                            />
                        </div>
                        {errors.phone && <span className="text-red-500 text-xs mt-1 block ml-1">{errors.phone}</span>}
                    </div>
                    
                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-[#0a192f] hover:bg-[#112240] text-white py-3.5 rounded-lg font-semibold tracking-wider transition shadow-md">
                        REGISTER
                    </button>

                    {/* Already have an account link */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#0a192f] font-bold hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}