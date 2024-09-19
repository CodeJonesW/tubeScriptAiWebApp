import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import Profile from "./components/Profile";
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
  const [displayComponent, setDisplayComponent] = useState("welcome");

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
        setDisplayComponent("analyze");
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
    setDisplayComponent("welcome");
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div style={{ width: "100%" }}>
          <div className="nav-container">
            <h2>TubeScript AI</h2>
            <div className="logout-container">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          <div className="profile-container">
            <Profile profile={profile} />
          </div>
        </div>
      ) : null}

      {!isAuthenticated ? (
        <div>
          {displayComponent === "welcome" ? (
            <div>
              <h2>TubeScript.Ai</h2>
              <HowToUseCard displayComponent={setDisplayComponent} />
            </div>
          ) : null}
          {displayComponent === "register" ? (
            <div className="auth-form">
              <Register
                onRegister={() => {
                  alert("Registered successfully! Please log in.");
                  setDisplayComponent("login");
                }}
              />
            </div>
          ) : null}
          {displayComponent === "login" ? (
            <div className="auth-form">
              <Login onLogin={handleLogin} />
            </div>
          ) : null}
        </div>
      ) : (
        <Analyze profile={profile} setProfile={setProfile} />
      )}
    </div>
  );
};

export default App;
