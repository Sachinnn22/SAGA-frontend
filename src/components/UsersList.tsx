import { useEffect, useState } from 'react';
import API from '../services/api';
import { User, Mail, Shield, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token'); 

            const response = await API.get('users/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }); 
            
            setUsers(response.data.data || response.data || []);
        } catch (err) {
            console.error('Error fetching users', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-600">Loading registered users...</div>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8 pb-10">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full">
                <h2 className="text-2xl font-bold text-[#0a192f]">All Registered Users (Admin View)</h2>
                <p className="text-sm text-gray-500">Manage and view details of all users currently registered in the system.</p>
            </div>

            {/* Users Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
                {currentUsers.length > 0 ? (
                    currentUsers.map((usr) => (
                        <div key={usr.id || usr.email} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition p-5 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-base shadow-inner">
                                        {usr.name ? usr.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-base font-bold text-[#0a192f] truncate">{usr.name || 'No Name'}</h3>
                                        <span className={`inline-block px-2 py-0.5 text-[10px] rounded font-bold ${
                                            usr.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {usr.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                                    <p className="flex items-center gap-2 truncate">
                                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{usr.email}</span>
                                    </p>
                                    {usr.phone && (
                                        <p className="flex items-center gap-2 truncate">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span>{usr.phone}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[11px] text-gray-400">
                                <span>ID: {usr.id || 'N/A'}</span>
                                <span className="text-teal-600 font-semibold flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Active
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm col-span-full text-center py-10">No users found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 text-[#0a192f] rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="text-sm font-medium text-gray-600">
                        Page <span className="font-bold text-[#0a192f]">{currentPage}</span> of <span className="font-bold text-[#0a192f]">{totalPages}</span>
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 text-[#0a192f] rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}