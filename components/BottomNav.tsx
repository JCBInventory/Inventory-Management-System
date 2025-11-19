
import React from 'react';

type Tab = 'inventory' | 'quotation';

interface BottomNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-primary-dark text-white shadow-2xl z-40 flex justify-around items-center pb-safe border-t-4 border-accent">
            <button 
                onClick={() => onTabChange('inventory')}
                className={`flex-1 py-4 flex flex-col items-center justify-center transition-colors ${activeTab === 'inventory' ? 'bg-primary' : 'hover:bg-primary/50'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${activeTab === 'inventory' ? 'text-accent' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className={`text-xs font-bold ${activeTab === 'inventory' ? 'text-accent' : 'text-gray-400'}`}>Inventory</span>
            </button>
            
            <button 
                onClick={() => onTabChange('quotation')}
                className={`flex-1 py-4 flex flex-col items-center justify-center transition-colors relative ${activeTab === 'quotation' ? 'bg-primary' : 'hover:bg-primary/50'}`}
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${activeTab === 'quotation' ? 'text-accent' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center">
                            {cartCount}
                        </span>
                    )}
                </div>
                <span className={`text-xs font-bold ${activeTab === 'quotation' ? 'text-accent' : 'text-gray-400'}`}>Quotation</span>
            </button>
        </div>
    );
};

export default BottomNav;
