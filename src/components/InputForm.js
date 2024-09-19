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
    <div className="input-form">
      <h2>Analyze YouTube Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="input-group">
          <textarea
            placeholder="Enter your prompt (e.g., Summarize the video)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="form-textarea"
            required
          />
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Processing..." : "Analyze Video"}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
