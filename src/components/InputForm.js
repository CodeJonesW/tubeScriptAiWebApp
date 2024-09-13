import React, { useState } from "react";

const InputForm = ({ onSubmit }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(youtubeUrl, prompt);
    setLoading(false);
  };

  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          margin: "0 auto",
        }}
        onSubmit={handleSubmit}
      >
        <input
          style={{ marginBottom: "10px" }}
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          required
        />
        <textarea
          style={{ marginBottom: "10px" }}
          placeholder="Enter your prompt (e.g., Summarize the video)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Analyze Video"}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
