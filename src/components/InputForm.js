import React, { useState } from "react";

const InputForm = ({ onSubmit, analyzing, error, status }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("https://vimeo.com/154191595");
  const [prompt, setPrompt] = useState("summarize");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(youtubeUrl, prompt);
    setLoading(false);
  };

  return (
    <div className="input-form">
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
        <button
          type="submit"
          className="primary-button"
          disabled={loading || analyzing}
        >
          {loading || analyzing ? (
            <p className="status-message">{status || "Processing..."}</p>
          ) : (
            "Analyze Video"
          )}
        </button>
        {error ? <p className="error-message">{error}</p> : null}
      </form>
    </div>
  );
};

export default InputForm;
