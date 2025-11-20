import React from "react";
import { InventoryItem } from "../../types";

interface Props {
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
}

const InventoryTab: React.FC<Props> = ({ inventory }) => {
  return (
    <div>
      <h2>Inventory</h2>
      {inventory.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
};

export default InventoryTab;
