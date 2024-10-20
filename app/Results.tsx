import React from 'react';
import Button from '@mui/material/Button';

interface ResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onRetry: () => void;
}

const Results: React.FC<ResultsProps> = ({ correctAnswers, totalQuestions, onRetry }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Quiz Results</h1>
        <p className="text-xl mb-6">
          You answered <span className="font-bold text-blue-600">{correctAnswers}</span> out of <span className="font-bold text-blue-600">{totalQuestions}</span> questions correctly!
        </p>
        <Button
          variant="contained"
          color="primary"
          className="mt-5 w-full transition-transform transform hover:scale-105"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default Results;
