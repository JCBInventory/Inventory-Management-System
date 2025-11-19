
export interface InventoryItem {
    id: string;
    item_no: string;
    item_description: string;
    item_group: string;
    model: string;
    bhl_hln_flag: string;
    hsn_tax: number;
    sale_rate: number;
    mrp: number;
}

export interface QuotationItem extends InventoryItem {
    quantity: number;
    total: number;
}
