
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface InventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: InventoryItem) => void;
    item: InventoryItem | null;
}

const ITEM_GROUPS = [
    'Hydraulics',
    'Transmission',
    'Filters',
    'Electrical',
    'GET',
    'Seals',
    'Other'
];

const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState({
        item_no: '',
        item_description: '',
        mrp: 0,
        sale_rate: 0,
        item_group: 'Other',
        model: 'Universal',
        bhl_hln_flag: 'BHL',
        hsn_tax: 18
    });

    useEffect(() => {
        if (item) {
            setFormData({
                item_no: item.item_no,
                item_description: item.item_description,
                mrp: item.mrp,
                sale_rate: item.sale_rate,
                item_group: item.item_group,
                model: item.model,
                bhl_hln_flag: item.bhl_hln_flag,
                hsn_tax: item.hsn_tax,
            });
        } else {
            setFormData({
                item_no: '',
                item_description: '',
                mrp: 0,
                sale_rate: 0,
                item_group: 'Other',
                model: 'Universal',
                bhl_hln_flag: 'BHL',
                hsn_tax: 18
            });
        }
    }, [item, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            onSave({ ...item, ...formData });
        } else {
            onSave({
                id: Math.random().toString(36).substr(2, 9),
                ...formData
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-border">
                        <h2 className="text-2xl font-bold">{item ? 'Edit Item' : 'Add New Item'}</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="item_no" className="block text-sm font-medium text-text-secondary mb-1">Part Number</label>
                            <input type="text" name="item_no" id="item_no" value={formData.item_no} onChange={handleChange} required className="w-full p-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                        <div>
                            <label htmlFor="item_description" className="block text-sm font-medium text-text-secondary mb-1">Item Description</label>
                            <textarea name="item_description" id="item_description" value={formData.item_description} onChange={handleChange} required rows={3} className="w-full p-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="mrp" className="block text-sm font-medium text-text-secondary mb-1">MRP</label>
                                <input type="number" name="mrp" id="mrp" value={formData.mrp} onChange={handleChange} required className="w-full p-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div>
                                <label htmlFor="sale_rate" className="block text-sm font-medium text-text-secondary mb-1">Sale Rate</label>
                                <input type="number" name="sale_rate" id="sale_rate" value={formData.sale_rate} onChange={handleChange} required className="w-full p-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="item_group" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                            <select name="item_group" id="item_group" value={formData.item_group} onChange={handleChange} className="w-full p-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                                {ITEM_GROUPS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end items-center p-6 border-t border-border space-x-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-secondary hover:bg-gray-600 transition">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-md bg-primary hover:bg-blue-700 font-semibold transition">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryFormModal;
