import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface SalonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any, salonId?: number | string) => void;
    initialData?: any;
}

export default function SalonFormModal({ isOpen, onClose, onSubmit, initialData }: SalonFormModalProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setAddress(initialData.address || '');
            setPhone(initialData.phone || '');
            setDescription(initialData.description || '');
            setOwnerEmail(initialData.ownerEmail || '');
        } else {
            setName('');
            setAddress('');
            setPhone('');
            setDescription('');
            setOwnerEmail('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const salonData = {
            name,
            address,
            phone,
            description,
            ownerEmail
        };

        onSubmit(salonData, initialData?.id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden animate-fadeIn my-8">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        {initialData ? 'Edit Salon Details' : 'Register New Salon'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Salon Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter salon name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                            <input 
                                type="text" 
                                placeholder="Enter phone number" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                        <input 
                            type="text" 
                            placeholder="Enter full address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Owner Email</label>
                        <input 
                            type="email" 
                            placeholder="owner@example.com" 
                            value={ownerEmail} 
                            onChange={(e) => setOwnerEmail(e.target.value)} 
                            required 
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                        <textarea 
                            placeholder="Write something about the salon..." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={3} 
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                        ></textarea>
                    </div>

                    <div className="pt-3 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-md"
                        >
                            {initialData ? 'Update Salon' : 'Save Salon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}