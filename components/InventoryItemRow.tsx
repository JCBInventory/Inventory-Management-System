
import React from 'react';
import { InventoryItem } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface InventoryItemRowProps {
    item: InventoryItem;
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}

const InventoryItemRow: React.FC<InventoryItemRowProps> = ({ item, onEdit, onDelete }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <tr className="hover:bg-secondary transition-colors">
            <td className="p-4 font-mono text-sm">{item.item_no}</td>
            <td className="p-4 max-w-xs truncate">{item.item_description}</td>
            <td className="p-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200">
                    {item.item_group}
                </span>
            </td>
            <td className="p-4 text-right font-medium">₹{item.mrp.toLocaleString('en-IN')}</td>
            <td className="p-4 text-right font-medium">₹{item.sale_rate.toLocaleString('en-IN')}</td>
            <td className="p-4 text-text-secondary">-</td>
            <td className="p-4">
                <div className="flex justify-center items-center gap-4">
                    <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="Edit item">
                        <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-300 transition-colors" aria-label="Delete item">
                        <DeleteIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InventoryItemRow;
