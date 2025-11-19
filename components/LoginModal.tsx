
import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'inventory' && password === 'rmpl@123') {
            onLogin();
            setId('');
            setPassword('');
            setError('');
        } else {
            setError('Invalid Credentials');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-primary p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Parent Login</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Login ID</label>
                        <input 
                            type="text" 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900"
                            placeholder="Enter ID"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900"
                            placeholder="Enter Password"
                        />
                    </div>
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center border border-red-100">{error}</div>}
                    <button 
                        type="submit"
                        className="w-full bg-accent hover:bg-yellow-400 text-primary-dark font-bold py-3 rounded-lg transition-colors shadow-md"
                    >
                        Access Parent Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
