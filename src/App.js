import React, { useState, useEffect } from "react";
import Profile from "./components/Profile";
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
  const [profile, setProfile] = useState(null);
  const [displayComponent, setDisplayComponent] = useState("welcome");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setDisplayComponent("analyze");
      } catch (error) {
        setIsAuthenticated(false);
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

  const BackButton = () => {
    return (
      <div style={{ width: "100%", marginBottom: "44px" }}>
        <button
          onClick={() => setDisplayComponent("welcome")}
          style={{
            width: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="secondary-button"
        >
          {"<"}
        </button>
      </div>
    );
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="onboarding-container">
          {displayComponent === "welcome" ? (
            <div>
              <h2>TubeScript.Ai</h2>
              <HowToUseCard displayComponent={setDisplayComponent} />
            </div>
          ) : null}
          {displayComponent === "register" ? (
            <>
              <BackButton />
              <Register
                back={() => setDisplayComponent("welcome")}
                onRegister={() => {
                  alert("Registered successfully! Please log in.");
                  setDisplayComponent("login");
                }}
              />
            </>
          ) : null}
          {displayComponent === "login" ? (
            <>
              <BackButton />
              <Login
                back={() => setDisplayComponent("welcome")}
                onLogin={handleLogin}
              />
            </>
          ) : null}
        </div>
      ) : (
        <div className="app-container">
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
          <Analyze profile={profile} setProfile={setProfile} />
        </div>
      )}
    </>
  );
};

export default App;
