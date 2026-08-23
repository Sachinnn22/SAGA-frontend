import React, { useState } from 'react';
import API from '../services/api';

interface BookAppointmentModalProps {
    salon: { id: string | number; name: string };
    onClose: () => void;
}

export default function BookAppointmentModal({ salon, onClose }: BookAppointmentModalProps) {
    const [formData, setFormData] = useState({
        memberName: '',
        memberCount: 1,
        appointmentDate: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const payload = {
                salonId: String(salon.id),
                salonName: salon.name,
                memberName: formData.memberName,
                memberCount: Number(formData.memberCount),
                appointmentDate: formData.appointmentDate
            };

            await API.post('/appointments', payload, {
                headers: {
                    'X-User-Email': user?.email || '',
                    'X-User-Id': user?.id || user?._id || ''
                }
            });

            alert('Appointment booked successfully!');
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden transform transition-all">
                <div className="bg-[#0a192f] text-white p-5 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold">Book Appointment</h3>
                        <p className="text-xs text-blue-300 truncate">{salon.name}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Member / Guest Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter name" 
                            value={formData.memberName} 
                            onChange={(e) => setFormData({ ...formData, memberName: e.target.value })} 
                            required 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20 focus:border-[#0a192f] transition" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Member Count</label>
                        <div className="relative">
                            <select 
                                value={formData.memberCount} 
                                onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })} 
                                required 
                                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20 focus:border-[#0a192f] appearance-none transition cursor-pointer"
                            >
                                <option value={1}>1 Member</option>
                                <option value={2}>2 Members</option>
                                <option value={3}>3 Members</option>
                                <option value={4}>4 Members</option>
                                <option value={5}>5 Members</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Appointment Date</label>
                        <input 
                            type="date" 
                            value={formData.appointmentDate} 
                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} 
                            required 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20 focus:border-[#0a192f] transition" 
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-[#0a192f] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#112240] transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}