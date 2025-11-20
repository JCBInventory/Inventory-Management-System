import React, { useEffect, useState } from "react";

// Data model
interface Item {
  "Item No.": string;
  "Item Description": string;
  "Item Group": string;
  Model: string;
  "BHL/HLN Flag": string;
  HSN: string;
  "Tax %Sale Rate": string;
  MRP: string;
}

const csvUrl =
  "https://docs.google.com/spreadsheets/d/1HZOOLJPw1CZR_EoXBJEm4utbJRSncttHZ9Ujfahm4UY/export?format=csv";

// Proper CSV parser (handles commas inside quotes)
function parseCsv(text: string): Item[] {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  const headers = lines[0].split(",").map((h) => h.trim());

  const items: Item[] = lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let char of line) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj as Item;
  });

  return items;
}

const InventoryTab: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((csv) => {
        const parsed = parseCsv(csv);
        setItems(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("CSV load error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory</h2>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item No.</th>
              <th>Description</th>
              <th>MRP</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td>{it["Item No."]}</td>
                <td>{it["Item Description"]}</td>
                <td>{it.MRP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryTab;
