
import React, { useState, useMemo } from 'react';
import { QuotationItem } from '../types';
import { DeleteIcon } from './icons/DeleteIcon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuotationTabProps {
    items: QuotationItem[];
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({ items, onUpdateQty, onRemove }) => {
    const [discountPercent, setDiscountPercent] = useState<number>(0);

    const totals = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const discountAmount = (subtotal * discountPercent) / 100;
        const finalTotal = Math.max(0, subtotal - discountAmount);
        return { subtotal, discountAmount, finalTotal };
    }, [items, discountPercent]);

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(30, 64, 175); // Blue header
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('QUOTATION', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

        // Table
        const tableColumn = ["Item No", "Description", "Qty", "MRP", "Total"];
        const tableRows = items.map(item => [
            item.item_no,
            item.item_description,
            item.quantity,
            `Rs. ${item.mrp}`,
            `Rs. ${item.total}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [30, 64, 175] },
            footStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] },
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Subtotal: Rs. ${totals.subtotal.toLocaleString()}`, 140, finalY);
        doc.text(`Discount (${discountPercent}%): - Rs. ${totals.discountAmount.toLocaleString()}`, 140, finalY + 7);
        doc.setFontSize(14);
        doc.setTextColor(30, 64, 175);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: Rs. ${totals.finalTotal.toLocaleString()}`, 140, finalY + 15);

        // Watermark
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(10);
        doc.text("Design created by Arshad Ali", 105, 285, { align: 'center' });

        doc.save(`Quotation_${new Date().getTime()}.pdf`);
    };

    if (items.length === 0) {
        return (
            <div className="bg-card rounded-xl p-8 text-center shadow-lg">
                <h2 className="text-2xl font-bold text-primary-dark mb-2">Quotation is Empty</h2>
                <p className="text-gray-600">Go to Inventory to add items.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-primary-dark text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Selected Items ({items.length})</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="p-3">Item</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Total</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map(item => (
                            <tr key={item.id} className="text-primary-dark">
                                <td className="p-3">
                                    <div className="font-bold text-sm">{item.item_no}</div>
                                    <div className="text-xs truncate max-w-[150px]">{item.item_description}</div>
                                    <div className="text-xs text-gray-500">₹{item.mrp}</div>
                                </td>
                                <td className="p-3 text-center">
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value) || 1)}
                                        className="w-16 p-1 text-center border rounded bg-white focus:ring-2 focus:ring-primary"
                                    />
                                </td>
                                <td className="p-3 text-right font-bold">₹{item.total.toLocaleString()}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                                        <DeleteIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal:</span>
                    <span className="text-lg font-bold text-primary-dark">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Discount (%):</span>
                    <div className="flex items-center gap-4">
                        <span className="text-red-500 font-medium text-sm">
                            - ₹{totals.discountAmount.toLocaleString()}
                        </span>
                        <input 
                            type="number" 
                            value={discountPercent}
                            onChange={(e) => {
                                let val = parseFloat(e.target.value);
                                if (isNaN(val)) val = 0;
                                if (val > 100) val = 100;
                                if (val < 0) val = 0;
                                setDiscountPercent(val);
                            }}
                            className="w-20 p-2 text-center border rounded focus:ring-2 focus:ring-accent bg-white text-primary-dark font-bold"
                            placeholder="%"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                    <span className="text-xl font-bold text-primary-dark">Final Total:</span>
                    <span className="text-2xl font-bold text-primary">₹{totals.finalTotal.toLocaleString()}</span>
                </div>

                <button 
                    onClick={generatePDF}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors text-lg flex justify-center items-center gap-2"
                >
                    <span>Download PDF Quotation</span>
                </button>
            </div>
        </div>
    );
};

export default QuotationTab;
