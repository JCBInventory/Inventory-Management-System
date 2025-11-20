import React, { useState } from "react";
import LoginModal from "./components/LoginModal";
import InventoryTab from "./components/InventoryTab";
import QuotationTab from "./components/QuotationTab";
import Header from "./components/Header";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [loggedIn] = useLocalStorage("loggedIn", false);
  const [activeTab, setActiveTab] = useState("inventory");

  if (!loggedIn) {
    return <LoginModal onClose={() => window.location.reload()} />;
  }

  return (
    <div>
      <Header />

      <div style={{ marginTop: "20px", padding: "20px" }}>
        <button onClick={() => setActiveTab("inventory")}>Inventory</button>
        <button onClick={() => setActiveTab("quotation")}>Quotation</button>
      </div>

      {activeTab === "inventory" && <InventoryTab />}
      {activeTab === "quotation" && <QuotationTab />}
    </div>
  );
}

export default App;
