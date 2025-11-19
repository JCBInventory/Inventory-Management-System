
import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface InventoryTabProps {
    inventory: InventoryItem[];
    onAdd: (item: InventoryItem) => void;
    isConfigured: boolean;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ inventory, onAdd, isConfigured }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) return [];
        
        const term = searchTerm.toLowerCase();
        return inventory.filter(item => {
            // Exact match for Item No
            if (item.item_no.toLowerCase() === term) return true;
            // Fuzzy match for Description
            if (item.item_description.toLowerCase().includes(term)) return true;
            return false;
        });
    }, [inventory, searchTerm]);

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="sticky top-4 z-10">
                <div className="relative shadow-lg">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <SearchIcon className={`h-6 w-6 ${isConfigured ? 'text-primary-dark' : 'text-gray-400'}`} />
                    </span>
                    <input
                        type="text"
                        disabled={!isConfigured}
                        placeholder={isConfigured ? "Search Item No. (Exact) or Description..." : "Waiting for parent to configure inventory..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl font-bold text-lg border-2 focus:outline-none transition-all ${
                            isConfigured 
                                ? 'bg-accent text-primary-dark placeholder-primary-dark/60 border-white focus:ring-4 focus:ring-blue-500/50' 
                                : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                        }`}
                    />
                </div>
                {!isConfigured && (
                    <div className="text-center mt-2 p-2 bg-blue-900/50 rounded-lg backdrop-blur-sm border border-blue-500/30">
                        <p className="text-blue-200 text-sm font-medium flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            Please wait for parent to configure inventory
                        </p>
                    </div>
                )}
            </div>

            {/* Results List */}
            <div className="grid gap-4 pb-24">
                {!isConfigured ? (
                    <div className="text-center py-20 opacity-50">
                        <div className="bg-white/10 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <SearchIcon className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-lg text-blue-200">Inventory System Not Configured</p>
                    </div>
                ) : searchTerm === '' ? (
                    <div className="text-center py-12 text-white/60">
                        <p className="text-lg">Enter item number or description to search</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-white/60">
                        <p className="text-xl">No items found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.id} className="bg-card rounded-xl p-5 shadow-lg border-l-8 border-accent relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{item.item_no}</span>
                                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider border border-gray-200 px-1 rounded">{item.item_group}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-dark">{item.item_description}</h3>
                                    <p className="text-sm text-gray-600 font-medium">Model: {item.model} | {item.bhl_hln_flag}</p>
                                </div>
                                <div className="text-right ml-2">
                                    <div className="text-2xl font-bold text-primary">₹{item.mrp.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">MRP</div>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-3">
                                <div className="text-xs text-gray-500 font-medium">
                                    Tax: {item.hsn_tax}% | Sale Rate: ₹{item.sale_rate}
                                </div>
                                <button 
                                    onClick={() => onAdd(item)}
                                    className="bg-accent hover:bg-accent-hover text-primary-dark font-bold py-2 px-4 rounded-lg shadow flex items-center gap-2 transition-all transform active:scale-95 focus:ring-2 focus:ring-white"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Add to Quote
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InventoryTab;
