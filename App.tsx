
import React, { useState, useEffect } from 'react';
import { InventoryItem, QuotationItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import InventoryTab from './components/InventoryTab';
import QuotationTab from './components/QuotationTab';
import BottomNav from './components/BottomNav';
import SetupModal from './components/SetupModal';
import LoginModal from './components/LoginModal';
import { fetchInventoryFromSheet } from './utils/sheetUtils';

type Tab = 'inventory' | 'quotation';

const App: React.FC = () => {
    // Persist key application state
    const [sheetUrl, setSheetUrl] = useLocalStorage<string>('sheet_url', '');
    const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory_cache_v1', []);
    const [lastUpdated, setLastUpdated] = useLocalStorage<string>('last_updated', '');
    
    // Session State
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Parent login status
    
    // Quotation state
    const [quotation, setQuotation] = useState<QuotationItem[]>([]);
    
    // UI State
    const [activeTab, setActiveTab] = useState<Tab>('inventory');
    const [notification, setNotification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // Derived state
    const isConfigured = !!sheetUrl && inventory.length > 0;

    // Initialize: Only fetch if URL exists. If not, wait for parent.
    useEffect(() => {
        if (sheetUrl && inventory.length === 0) {
            refreshData(sheetUrl);
        }
    }, []);

    const refreshData = async (url: string) => {
        setIsLoading(true);
        try {
            const data = await fetchInventoryFromSheet(url);
            setInventory(data);
            setLastUpdated(new Date().toLocaleString());
            showNotification(`Loaded ${data.length} items successfully!`);
            setShowSetup(false);
        } catch (error: any) {
            console.error(error);
            showNotification(error.message || 'Failed to fetch data');
            // We don't force setup here for child accounts, they just see error/disabled
            if (isLoggedIn) {
                setShowSetup(true); 
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
        showNotification("Parent access granted");
        if (!sheetUrl) {
            setShowSetup(true);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        showNotification("Logged out");
        setShowSetup(false);
    };

    const handleSetupSave = (url: string) => {
        setSheetUrl(url);
        refreshData(url);
    };

    const handleSettingsClick = () => {
        if (window.confirm("Do you want to update the Google Sheet URL? This will refresh the inventory.")) {
            setQuotation([]); // Clear quotation as data might change
            setShowSetup(true);
        }
    };

    const addToQuotation = (item: InventoryItem) => {
        setQuotation(prev => {
            const existing = prev.find(q => q.id === item.id);
            if (existing) {
                showNotification(`${item.item_description} quantity updated!`);
                return prev.map(q => q.id === item.id ? { ...q, quantity: q.quantity + 1, total: (q.quantity + 1) * q.mrp } : q);
            }
            showNotification(`${item.item_description} added to quotation!`);
            return [...prev, { ...item, quantity: 1, total: item.mrp }];
        });
    };

    const updateQuantity = (id: string, newQty: number) => {
        if (newQty < 1) return;
        setQuotation(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: newQty, total: newQty * item.mrp } : item
        ));
    };

    const removeFromQuotation = (id: string) => {
        if (window.confirm("Remove this item from quotation?")) {
            setQuotation(prev => prev.filter(item => item.id !== id));
        }
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-primary pb-32 relative font-sans text-white">
            <Header 
                onSettings={handleSettingsClick} 
                onRefresh={() => sheetUrl && refreshData(sheetUrl)} 
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLogin(true)}
                onLogoutClick={handleLogout}
            />

            <LoginModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
            />

            <SetupModal 
                isOpen={showSetup} 
                onSave={handleSetupSave} 
                isLoading={isLoading} 
            />

            <main className="container mx-auto p-4 max-w-4xl">
                {isConfigured && lastUpdated && (
                    <div className="text-xs text-blue-300 text-center mb-4 flex justify-center items-center gap-1 opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Last Updated: {lastUpdated}
                    </div>
                )}

                {activeTab === 'inventory' ? (
                    <InventoryTab 
                        inventory={inventory} 
                        onAdd={addToQuotation} 
                        isConfigured={isConfigured}
                    />
                ) : (
                    <QuotationTab 
                        items={quotation} 
                        onUpdateQty={updateQuantity} 
                        onRemove={removeFromQuotation}
                    />
                )}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} cartCount={quotation.length} />

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-accent text-primary-dark px-6 py-3 rounded-full shadow-lg font-bold animate-bounce z-50 text-sm md:text-base whitespace-nowrap border-2 border-white">
                    {notification}
                </div>
            )}

            {/* Watermark */}
            <div className="fixed bottom-20 w-full text-center pointer-events-none z-0">
                <p className="text-white/20 text-xs md:text-sm font-light">Design created by Arshad Ali</p>
            </div>
        </div>
    );
};

export default App;
