import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonsList from '../components/SalonsList';
import Appointments from '../components/Appointments';
import UsersList from '../components/UsersList';
import { Scissors, Calendar, LogOut, UserCheck, Users, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'salons' | 'appointments' | 'users'>('salons');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-72 h-screen sticky top-0 bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-[#06101e] text-white flex flex-col justify-between p-6 shadow-2xl border-r border-slate-800 overflow-hidden">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-wider text-white">SALON PORTAL</h1>
                            <p className="text-[10px] text-teal-400 font-medium tracking-widest uppercase">Management System</p>
                        </div>
                    </div>
                    
                    <div className="mb-6 p-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-inner">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md flex-shrink-0">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[11px] text-slate-400 font-medium">Logged in as</p>
                                <p className="font-bold text-xs text-slate-200 truncate">{user.name || user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400">Role</span>
                            <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] rounded-md font-bold tracking-wide">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button 
                            onClick={() => setActiveTab('salons')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                activeTab === 'salons' 
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/30 font-semibold' 
                                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Scissors className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'salons' ? 'text-white' : 'text-teal-400'}`} />
                                <span>{user.role === 'ROLE_ADMIN' ? 'All Salons (Admin)' : 'Browse Salons'}</span>
                            </div>
                            {activeTab === 'salons' && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-glow"></span>}
                        </button>

                        <button 
                            onClick={() => setActiveTab('appointments')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                activeTab === 'appointments' 
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/30 font-semibold' 
                                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'appointments' ? 'text-white' : 'text-teal-400'}`} />
                                <span>Appointments</span>
                            </div>
                            {activeTab === 'appointments' && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-glow"></span>}
                        </button>

                        {user.role === 'ROLE_ADMIN' && (
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                    activeTab === 'users' 
                                        ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/30 font-semibold' 
                                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'users' ? 'text-white' : 'text-teal-400'}`} />
                                    <span>All Users (Admin)</span>
                                </div>
                                {activeTab === 'users' && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-glow"></span>}
                            </button>
                        )}
                    </nav>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/15 hover:border-rose-500/30 transition-all duration-200 shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'salons' && (user.role === 'ROLE_ADMIN' ? 'Admin Dashboard - Salon Management' : 'Explore Salons')}
                        {activeTab === 'appointments' && 'My Appointments'}
                        {activeTab === 'users' && 'System Users Management'}
                    </h2>
                    <div className="flex items-center gap-2.5 bg-teal-50 px-3.5 py-1.5 rounded-xl border border-teal-100 text-sm text-gray-700">
                        <UserCheck className="w-4 h-4 text-teal-600" />
                        <span className="font-medium">Welcome, <strong className="text-teal-900">{user.name}</strong></span>
                    </div>
                </header>

                {activeTab === 'salons' && <SalonsList />}
                {activeTab === 'appointments' && <Appointments />}
                {activeTab === 'users' && user.role === 'ROLE_ADMIN' && <UsersList />}
            </main>
        </div>
    );
}