import React, { useEffect, useState } from 'react';
import API from '../services/api';

interface Appointment {
    id: string;
    salonId: string;
    salonName?: string;
    memberName: string;
    memberCount: number;
    appointmentDate: string;
    userEmail: string;
    userId: string;
    createdAt: string;
}

export default function Appointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'admin' || user?.role === 'ADMIN';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            const headers = {
                'X-User-Email': user?.email || '',
                'X-User-Id': user?.id || user?._id || ''
            };

            if (isAdmin) {
                response = await API.get('/appointments', { headers });
            } else {
                response = await API.get('/appointments/my-appointments', { headers });
            }

            setAppointments(response.data);
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data?.message || 'Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const headers = {
                'X-User-Email': user?.email || '',
                'X-User-Id': user?.id || user?._id || ''
            };

            await API.delete(`/appointments/${id}`, { headers });
            
            setAppointments(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            console.error('Error canceling appointment:', err);
            alert(err.response?.data?.message || 'Failed to cancel appointment.');
        }
    };

    const filteredAppointments = appointments.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.memberName?.toLowerCase().includes(query) ||
            item.salonName?.toLowerCase().includes(query) ||
            String(item.salonId)?.toLowerCase().includes(query) ||
            item.userEmail?.toLowerCase().includes(query) ||
            item.appointmentDate?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-[#0a192f]">
                        {isAdmin ? 'All Appointments (Admin)' : 'My Appointments'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAdmin 
                            ? 'Manage and view all customer salon bookings across the platform.' 
                            : 'View and track your booked salon appointments.'}
                    </p>
                </div>
                <button
                    onClick={fetchAppointments}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0a192f] rounded-xl text-sm font-semibold transition flex items-center gap-2 flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by salon name, member, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20 focus:border-[#0a192f] transition"
                    />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-bold text-[#0a192f]">{filteredAppointments.length}</span> of {appointments.length} entries
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a192f]"></div>
                </div>
            )}

            {error && !loading && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-700 text-sm mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && filteredAppointments.length === 0 && (
                <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100 text-center text-blue-900">
                    <p className="text-base font-semibold">No appointments found.</p>
                    <p className="text-xs text-blue-700 mt-1">
                        {searchQuery ? 'Try searching with a different keyword.' : (isAdmin ? 'There are no bookings in the system yet.' : 'Select a salon and book your first appointment!')}
                    </p>
                </div>
            )}

            {!loading && !error && filteredAppointments.length > 0 && (
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                <th className="py-3.5 px-6 rounded-l-xl">Salon Name</th>
                                <th className="py-3.5 px-6">Member / Guest</th>
                                <th className="py-3.5 px-6">Count</th>
                                <th className="py-3.5 px-6">Date</th>
                                {isAdmin && <th className="py-3.5 px-6">User Email</th>}
                                <th className="py-3.5 px-6">Booked On</th>
                                {!isAdmin && <th className="py-3.5 px-6 rounded-r-xl text-right">Action</th>}
                                {isAdmin && <th className="py-3.5 px-6 rounded-r-xl"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredAppointments.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                    <td className="py-4 px-6 font-semibold text-[#0a192f]">
                                        {item.salonName || `Salon #${item.salonId}`}
                                    </td>
                                    <td className="py-4 px-6 text-gray-800 font-medium">
                                        {item.memberName}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                            {item.memberCount} {item.memberCount > 1 ? 'Members' : 'Member'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 font-medium">
                                        {item.appointmentDate}
                                    </td>
                                    {isAdmin && (
                                        <td className="py-4 px-6 text-gray-500 text-xs">
                                            {item.userEmail || 'N/A'}
                                        </td>
                                    )}
                                    <td className="py-4 px-6 text-gray-400 text-xs">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    {!isAdmin && (
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleCancelAppointment(item.id)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    )}
                                    {isAdmin && <td className="py-4 px-6"></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}