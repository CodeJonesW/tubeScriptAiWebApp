import React, { useState } from "react";
import axios from "axios";
import { validateEmail } from "../utils/account_verify";

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/register`, {
        username: email,
        password,
      });
      onRegister();
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="primary-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
