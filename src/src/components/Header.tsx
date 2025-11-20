import React from "react";

interface HeaderProps {
  onLoginClick: () => void;
  userEmail: string | null;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, userEmail }) => {
  return (
    <header className="header">
      <h1>Inventory Management System</h1>

      <button onClick={onLoginClick}>
        {userEmail ? `Logged in: ${userEmail}` : "Login"}
      </button>
    </header>
  );
};

export default Header;
