import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import axios from "axios";

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
      console.log("token", token);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h1>AI Video Analysis</h1>

      {!isAuthenticated ? (
        <div>
          <Login onLogin={handleLogin} />
          <Register
            onRegister={() => alert("Registered successfully! Please log in.")}
          />
        </div>
      ) : (
        <div>
          <Profile profile={profile} />
          <button onClick={handleLogout}>Logout</button>
          <InputForm onSubmit={handleAnalyze} />
          {loading ? <p>{status || "Processing..."}</p> : null}
          {result ? <Results result={result} title="Analysis" /> : null}
          {transcript ? (
            <Results result={transcript} title={"Transcript"} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default App;
