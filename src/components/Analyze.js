import React, { useState } from "react";
import "../css/HowToUse.css"; // Import the CSS for this component
import InputForm from "./InputForm";
import Results from "./Results";
import axios from "axios";

const Analyze = ({ profile, setProfile }) => {
  const [result, setResult] = useState("");
  const [transcript, setTranscript] = useState("");
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
      setTimeout(() => {
        pollTaskStatusService(taskId);
      }, 5000);
    } catch (error) {
      console.error("Error during analysis:", error);
      if (error.response.data.error) {
        setError(error.response.data.error);
        setLoading(false);
        return;
      }
    }
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <InputForm
          analyzing={loading}
          onSubmit={handleAnalyze}
          error={error}
          status={status}
        />
      </div>
      <div className="results-container">
        {result && <Results result={result} title="Analysis" />}
        {transcript && <Results result={transcript} title="Transcript" />}
      </div>
    </div>
  );
};

export default Analyze;
