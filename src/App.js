import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import axios from "axios";

const App = () => {
  const [result, setResult] = useState("");
  const [transcript, setTranscript] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (youtubeUrl, prompt) => {
    setLoading(true);
    setResult("");
    setStatus("");

    try {
      // Start the task by sending the request to /process
      const response = await axios.post("http://localhost:5000/process", {
        url: youtubeUrl,
        prompt: prompt,
      });

      // Get the task ID from the response
      const taskId = response.data.task_id;
      setTaskId(taskId);

      // Start polling for the task status
      pollTaskStatusService(taskId);
    } catch (error) {
      console.error("Error during analysis:", error);
      setLoading(false);
    }
  };

  const pollTaskStatusService = (taskId) => {
    const intervalId = setInterval(async () => {
      try {
        // Poll the /status/<task_id> endpoint
        const statusResponse = await axios.get(
          `http://localhost:5000/status/${taskId}`
        );
        console.log("status", statusResponse);
        const taskStatus = statusResponse.data.status;
        const taskResult = statusResponse.data.result;

        setStatus(taskStatus); // Update the current status in the UI

        // If the task is completed, show the result and stop polling
        if (statusResponse.data.state === "SUCCESS") {
          setResult(taskResult.analysis); // Set the result from the response
          setTranscript(taskResult.transcript); // Set the transcript from the response
          clearInterval(intervalId); // Stop polling
          setLoading(false); // Stop the loading state
        }

        // If the task has failed, stop polling
        if (statusResponse.data.state === "FAILURE") {
          setStatus("Task failed. Please try again.");
          clearInterval(intervalId); // Stop polling
          setLoading(false);
        }
      } catch (error) {
        console.error("Error while polling task status:", error);
        clearInterval(intervalId); // Stop polling on error
        setLoading(false);
      }
    }, 3000); // Poll every 3 seconds
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
      <InputForm onSubmit={handleAnalyze} />
      {loading ? <p>{status || "Processing..."}</p> : null}
      {result ? <Results result={result} title="Analysis" /> : null}
      {transcript ? <Results result={transcript} title={"Transcript"} /> : null}
    </div>
  );
};

export default App;
