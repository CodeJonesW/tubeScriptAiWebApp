import React, { useState } from "react";
import "../css/HowToUse.css"; // Import the CSS for this component
import Profile from "./Profile";
import Register from "./Register";
import InputForm from "./InputForm";
import Results from "./Results";
import axios from "axios";

const Analyze = ({ profile, setProfile }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [result, setResult] = useState("");
  const [transcript, setTranscript] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const pollTaskStatusService = (taskId) => {
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem("authToken");
        const statusResponse = await axios.get(`${apiUrl}/status/${taskId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const taskStatus = statusResponse.data.status;
        const taskResult = statusResponse.data.result;

        setStatus(taskStatus);

        if (statusResponse.data.state === "NOT FOUND") {
          setStatus("Error: Task not found.");
          clearInterval(intervalId);
          setLoading(false);
        }

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
        `${apiUrl}/process`,
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
      setTimeout(() => {
        pollTaskStatusService(taskId);
      }, 5000);
    } catch (error) {
      console.error("Error during analysis:", error);
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
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
  );
};

export default Analyze;
