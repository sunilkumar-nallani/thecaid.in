import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Processing..." }) => {
  return (
    <div className="loading-spinner">
      <span className="spinner-text">{message}</span>
      <span className="spinner-dots">
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </span>
    </div>
  );
};

export default LoadingSpinner;