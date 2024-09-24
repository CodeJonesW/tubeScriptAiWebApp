import React, { useState } from "react";
import axios from "axios";
import { validateEmail } from "../utils/account_verify";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("authToken", access_token);
      onLogin(access_token); // Notify App component of successful login
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
