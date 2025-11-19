
import React from 'react';
import { InventoryItem } from '../types';
import InventoryItemRow from './InventoryItemRow';

interface InventoryTableProps {
    items: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-16 bg-card rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-secondary">No Inventory Items Found</h2>
                <p className="mt-2 text-gray-400">Try adding a new item or adjusting your search.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
                <thead className="bg-secondary">
                    <tr>
                        <th className="p-4 font-semibold text-text-secondary">Part Number</th>
                        <th className="p-4 font-semibold text-text-secondary">Description</th>
                        <th className="p-4 font-semibold text-text-secondary">Category</th>
                        <th className="p-4 font-semibold text-text-secondary text-right">MRP</th>
                        <th className="p-4 font-semibold text-text-secondary text-right">Value</th>
                        <th className="p-4 font-semibold text-text-secondary">Date Added</th>
                        <th className="p-4 font-semibold text-text-secondary text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {items.map(item => (
                        <InventoryItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
