import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import Login from "./components/Login";
import HowToUseCard from "./components/HowToUse";
import Profile from "./components/Profile";
import Register from "./components/Register";
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

  const handleAnalyze = async (youtubeUrl, prompt) => {
    if (!isAuthenticated) {
      alert("You need to log in to use this feature!");
      return;
    }

    setLoading(true);
    setResult("");
    setStatus("");
    setTranscript("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/process",
        {
          url: youtubeUrl,
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const taskId = response.data.task_id;
      setTaskId(taskId);
      pollTaskStatusService(taskId);
    } catch (error) {
      console.error("Error during analysis:", error);
      setLoading(false);
    }
  };

  const pollTaskStatusService = (taskId) => {
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem("authToken");
        const statusResponse = await axios.get(
          `http://localhost:5000/status/${taskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const taskStatus = statusResponse.data.status;
        const taskResult = statusResponse.data.result;

        setStatus(taskStatus);

        if (statusResponse.data.state === "SUCCESS") {
          setResult(taskResult.analysis);
          setTranscript(taskResult.transcript);
          setProfile({
            ...profile,
            free_minutes: taskResult.free_minutes_left,
          });
          clearInterval(intervalId);
          setLoading(false);
        }

        if (statusResponse.data.state === "FAILURE") {
          setStatus("Task failed. Please try again.");
          clearInterval(intervalId);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error while polling task status:", error);
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 3000);
  };

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
        <div className="main-container">
          <div className="profile-container">
            <Profile profile={profile} />
          </div>
          <div className="form-container">
            <InputForm onSubmit={handleAnalyze} />
          </div>
          <div className="results-container">
            {loading ? (
              <p className="status-message">{status || "Processing..."}</p>
            ) : null}
            {result && <Results result={result} title="Analysis" />}
            {transcript && <Results result={transcript} title="Transcript" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
