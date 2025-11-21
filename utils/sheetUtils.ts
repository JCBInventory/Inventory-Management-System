
import { InventoryItem } from '../types';

// Helper to parse a CSV line correctly handling quotes
const parseCSVLine = (str: string): string[] => {
    const result = [];
    let cell = '';
    let quote = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"' && str[i + 1] === '"') {
            cell += '"';
            i++;
        } else if (char === '"') {
            quote = !quote;
        } else if (char === ',' && !quote) {
            result.push(cell);
            cell = '';
        } else {
            cell += char;
        }
    }
    result.push(cell);
    return result;
};

export const extractSheetId = (url: string): string | null => {
    // Matches standard Google Sheet IDs (long alphanumeric strings after /d/)
    const matches = url.match(/\/d\/([a-zA-Z0-9-_]{15,})/);
    return matches ? matches[1] : null;
};

const extractGid = (url: string): string | null => {
    // Matches gid parameter in URL (query string, fragment, or appended param)
    // Handles ?gid=, &gid=, #gid=
    const matches = url.match(/[\?& #]gid=([0-9]+)/);
    return matches ? matches[1] : null;
};

const parseInventoryCSV = (csvText: string): InventoryItem[] => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
        throw new Error("Sheet appears to be empty or missing headers.");
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

    // Flexible column mapping to handle slight variations in header names
    const colMap: Record<string, number> = {
        item_no: headers.findIndex(h => h.includes('item no') || h.includes('part no') || h.includes('part_no')),
        item_description: headers.findIndex(h => h.includes('description') || h.includes('desc')),
        item_group: headers.findIndex(h => h.includes('group') || h.includes('category')),
        model: headers.findIndex(h => h.includes('model')),
        bhl_hln_flag: headers.findIndex(h => h.includes('flag') || h.includes('bhl') || h.includes('hln')),
        hsn_tax: headers.findIndex(h => h.includes('hsn') || h.includes('tax')),
        sale_rate: headers.findIndex(h => h.includes('sale') || h.includes('rate') || h.includes('value')),
        mrp: headers.findIndex(h => h.includes('mrp'))
    };

    // Basic Validation
    if (colMap.item_no === -1 && colMap.item_description === -1) {
        throw new Error("Could not find required columns 'Item No' or 'Description'. Please check your sheet headers.");
    }

    const items: InventoryItem[] = [];

    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        // Skip if row is too short
        if (row.length < 2) continue;

        // Helper to get value safely
        const getVal = (key: string) => {
            const idx = colMap[key];
            return idx !== -1 && row[idx] ? row[idx].trim() : '';
        };

        // Helper to parse number safely
        const getNum = (key: string) => {
            const val = getVal(key).replace(/[,₹]/g, ''); // Remove commas and currency symbols
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
        };

        // Only add if we have at least an Item No or Description
        if (!getVal('item_no') && !getVal('item_description')) continue;

        items.push({
            id: `row-${i}-${Math.random().toString(36).substr(2, 9)}`,
            item_no: getVal('item_no') || 'N/A',
            item_description: getVal('item_description') || 'No Description',
            item_group: getVal('item_group') || 'General',
            model: getVal('model') || '-',
            bhl_hln_flag: getVal('bhl_hln_flag') || '-',
            hsn_tax: getNum('hsn_tax'),
            sale_rate: getNum('sale_rate'),
            mrp: getNum('mrp')
        });
    }

    return items;
};

export const fetchInventoryFromSheet = async (sheetUrl: string): Promise<InventoryItem[]> => {
    const sheetId = extractSheetId(sheetUrl);
    const gid = extractGid(sheetUrl) || '0'; // Default to first sheet if no gid found

    if (!sheetId) {
        throw new Error("Invalid Google Sheet URL. Could not extract Sheet ID.");
    }

    // Strategy:
    // 1. We try multiple Google Sheets export URLs.
    // 2. We try multiple CORS proxies for each URL.
    // 3. We strictly validate the response is not HTML.

    const targetUrls = [
        // GViz API is often more permissive for programmatic access
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
        // Standard Export URL
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    ];

    const proxies = [
        // AllOrigins: Reliable, supports raw output
        (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        // CodeTabs: Good fallback
        (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        // CorsProxy.io: Sometimes flaky but works
        (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        // Direct: Works if "Published to Web" and browser environment allows it (or extension)
        (url: string) => url
    ];

    for (const targetUrl of targetUrls) {
        for (const proxy of proxies) {
            try {
                const fetchUrl = proxy(targetUrl);
                // Add timestamp to prevent caching
                const urlWithCacheBust = fetchUrl + (fetchUrl.includes('?') ? '&' : '?') + `_=${Date.now()}`;

                const res = await fetch(urlWithCacheBust);

                if (!res.ok) continue;

                const text = await res.text();

                // Critical Check: Google redirects to HTML login/error pages if access is denied.
                // If we get HTML, this specific proxy/URL combo failed.
                if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html') || text.includes('<html')) {
                    continue; 
                }

                // Basic CSV validation (should contain commas)
                if (!text.includes(',')) {
                    continue;
                }

                // If we get here, it's likely valid CSV
                return parseInventoryCSV(text);

            } catch (err) {
                console.warn(`Fetch failed for ${targetUrl} via proxy`, err);
                // Continue to next combination
            }
        }
    }

    // If loop finishes without returning
    throw new Error("Access Denied: Received HTML instead of CSV data. Please ensure your Google Sheet is set to 'Anyone with the link can view'.");
};
