import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import Login from "./components/Login";
import HowToUseCard from "./components/HowToUse";
import Register from "./components/Register";
import Analyze from "./components/Analyze";
import axios from "axios";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [result, setResult] = useState("");
  const [transcript, setTranscript] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        setError("Failed to fetch profile");
        console.error(error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : null}
      <h1>TubeScript AI</h1>

      {!isAuthenticated ? (
        <div>
          <HowToUseCard />
          <div className="auth-container">
            <div className="auth-form">
              <Login onLogin={handleLogin} />
            </div>
            <div className="auth-form">
              <Register
                onRegister={() =>
                  alert("Registered successfully! Please log in.")
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <Analyze profile={profile} setProfile={setProfile} />
      )}
    </div>
  );
};

export default App;
