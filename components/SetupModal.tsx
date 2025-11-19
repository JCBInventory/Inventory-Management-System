
import React, { useState } from 'react';

interface SetupModalProps {
    isOpen: boolean;
    onSave: (url: string) => void;
    isLoading: boolean;
}

const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onSave, isLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes('docs.google.com/spreadsheets')) {
            setError('Please enter a valid Google Sheet URL');
            return;
        }
        setError('');
        onSave(url);
    };

    return (
        <div className="fixed inset-0 bg-primary-dark bg-opacity-95 flex justify-center items-center z-50 p-6 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-primary p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">App Setup</h2>
                    <p className="text-blue-100 mt-2 text-sm">Connect your inventory database</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            Google Sheet URL
                        </label>
                        <p className="text-xs text-gray-500">
                            Ensure your sheet is "Anyone with the link can view"
                        </p>
                        <input 
                            type="text" 
                            placeholder="https://docs.google.com/spreadsheets/d/..." 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-0 outline-none transition-colors bg-gray-50"
                            required
                        />
                        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-800 space-y-1 border border-blue-100">
                        <p className="font-bold">Required Columns (Row 1):</p>
                        <p>Item No, Item Description, Item Group, Model, BHL/HLN Flag, HSN Tax %, Sale Rate, MRP</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
                            isLoading 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-accent hover:bg-yellow-400 text-primary-dark'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </span>
                        ) : 'Load Data & Start'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupModal;
