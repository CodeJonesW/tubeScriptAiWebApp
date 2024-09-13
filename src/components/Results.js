import React from "react";

const Results = ({ result, title }) => {
  return (
    <div className="results">
      <h2>{title}</h2>
      <p>{result}</p>
    </div>
  );
};

export default Results;
