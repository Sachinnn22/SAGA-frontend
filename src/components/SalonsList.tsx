import { useEffect, useState } from 'react';
import API from '../services/api';
import BookAppointmentModal from '../components/BookAppointmentModal';
import SalonFormModal from '../components/SalonFormModal';
import { Pencil, Trash2, Plus, MapPin, Phone, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SalonsList() {
    const [salons, setSalons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedSalonForEdit, setSelectedSalonForEdit] = useState<any>(null);
    const [selectedSalonForBooking, setSelectedSalonForBooking] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchSalons();
    }, []);

    const fetchSalons = async () => {
        try {
            const response = await API.get('salons');
            const salonsData = response.data.data || [];
            const sortedSalons = salonsData.sort((a: any, b: any) => b.id - a.id);
            setSalons(sortedSalons);
        } catch (err) {
            console.error('Error fetching salons', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData: FormData, salonId?: number | string) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (salonId) {
                await API.put(`/salons/${salonId}`, formData, config);
                alert('Salon updated successfully!');
            } else {
                await API.post('/salons/register', formData, config);
                alert('Salon registered successfully!');
            }

            setIsFormModalOpen(false);
            setSelectedSalonForEdit(null);
            fetchSalons();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save salon');
        }
    };

    const handleDeleteSalon = async (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this salon?')) {
            try {
                await API.delete(`/salons/${id}`);
                alert('Salon deleted successfully!');
                fetchSalons();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete salon');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
                Loading salons...
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSalons = salons.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(salons.length / itemsPerPage);

    return (
        <div className="space-y-8 w-full px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        {user?.role === 'ROLE_ADMIN' ? 'All Registered Salons (Admin)' : 'Explore Available Salons'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Discover and book your next appointment easily with top-rated salons.</p>
                </div>
                
                {user?.role === 'ROLE_ADMIN' && (
                    <button 
                        onClick={() => {
                            setSelectedSalonForEdit(null);
                            setIsFormModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2 flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Salon
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {currentSalons.length > 0 ? (
                    currentSalons.map((salon) => (
                        <div key={salon.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                            <div>
                                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                                    {salon.imageUrl ? (
                                        <img 
                                            src={salon.imageUrl} 
                                            alt={salon.name} 
                                            className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                                            No Image Available
                                        </div>
                                    )}

                                    {user?.role === 'ROLE_ADMIN' && (
                                        <div className="absolute top-3 right-3 flex gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg">
                                            <button 
                                                onClick={() => {
                                                    setSelectedSalonForEdit(salon);
                                                    setIsFormModalOpen(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit Salon"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteSalon(salon.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Salon"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate">{salon.name}</h3>
                                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{salon.description}</p>
                                    
                                    <div className="space-y-2 border-t border-gray-50 pt-3">
                                        <p className="text-gray-600 text-xs flex items-center gap-2 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 
                                            <span>{salon.address}</span>
                                        </p>
                                        <p className="text-gray-600 text-xs flex items-center gap-2 truncate">
                                            <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 
                                            <span>{salon.phone}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {user?.role !== 'ROLE_ADMIN' && (
                                <div className="p-5 pt-0">
                                    <button 
                                        onClick={() => setSelectedSalonForBooking(salon)}
                                        className="w-full bg-blue-50/80 text-blue-600 hover:bg-blue-600 hover:text-white py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 shadow-sm"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                        No salons available right now.
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-6">
                    <button
                        onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="text-sm font-medium text-gray-600">
                        Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                    </div>

                    <button
                        onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <SalonFormModal 
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedSalonForEdit(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={selectedSalonForEdit}
            />

            {selectedSalonForBooking && (
                <BookAppointmentModal 
                    salon={selectedSalonForBooking} 
                    onClose={() => setSelectedSalonForBooking(null)} 
                />
            )}
        </div>
    );
}