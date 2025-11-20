import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError("Invalid login. Please check email/password.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          width: "300px",
          borderRadius: "8px",
        }}
      >
        <h2>Login</h2>

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            borderRadius: "5px",
            border: "none",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
