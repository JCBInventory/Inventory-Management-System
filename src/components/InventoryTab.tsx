import React, { useEffect, useState } from "react";

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

const csvUrl = "https://docs.google.com/spreadsheets/d/1HZOOLJPw1CZR_EoXBJEm4utbJRSncttHZ9Ujfahm4UY/export?format=csv";

const InventoryTab: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(csvUrl)
      .then(res => res.text())
      .then(csvText => {
        const rows = csvText.split("\n");
        const headers = rows[0].split(",");
        const data = rows.slice(1).map(row => {
          const values = row.split(",");
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i];
          });
          return obj as Item;
        });
        setItems(data);
      })
      .catch(err => console.error("CSV load error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory</h2>
      {items.length === 0 ? (
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
