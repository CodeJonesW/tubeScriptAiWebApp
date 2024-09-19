import React from "react";
import "../css/HowToUse.css"; // Import the CSS for this component

const HowToUseCard = () => {
  return (
    <div className="how-to-use-card">
      <h2 className="how-to-use-title">How to Use This Web App</h2>
      <div className="how-to-use-content">
        <p>
          Welcome to the AI Video Analysis App! This app allows you to upload
          YouTube videos and analyze them using AI. Here's how to get started:
        </p>
        <ol>
          <li>
            <strong>Register or Log In:</strong> First, create an account by
            registering or log in if you already have an account.
          </li>
          <li>
            <strong>Enter Video URL:</strong> Copy and paste the YouTube video
            URL into the input box.
          </li>
          <li>
            <strong>Add Your Prompt:</strong> Type in a prompt, such as
            “Summarize the video” or “Provide key insights.”
          </li>
          <li>
            <strong>Analyze the Video:</strong> Hit the "Analyze Video" button
            to start processing the video. Our AI will transcribe and analyze
            the video based on your prompt.
          </li>
          <li>
            <strong>View Results:</strong> Once the processing is complete,
            you'll receive a transcript and the analysis. You can view both
            directly in the app.
          </li>
        </ol>
        <p>
          The app offers free minutes for video analysis. To view how many free
          minutes you have left, check your profile at any time.
        </p>
        <p>Enjoy using our AI-powered video analysis app!</p>
      </div>
    </div>
  );
};

export default HowToUseCard;
