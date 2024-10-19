'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Results from './Results'; // Import the Results component
import Spinner from './Spinner'; // Import the Spinner component
import Swal from 'sweetalert2'; // Import SweetAlert2

const page = () => {
  interface QuizQuestion {
    id: string;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
  }

  let selectedOption = useRef<(HTMLInputElement | null)[]>([]);
  let [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  let [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    axios('https://the-trivia-api.com/v2/questions')
      .then((response) => {
        setQuizData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        Swal.fire('Error!', 'Check your internet connection', 'error'); // Use SweetAlert for error
        console.log(error);
      });
  }, []);

  function nextQuestion() {
    const selectedOptionMain = selectedOption.current.find(item => item && item.checked);

    if (!selectedOptionMain) {
      Swal.fire('Please select an answer!'); // SweetAlert for no selection
      return;
    }

    if (currentQuestionIndex === (quizData?.length || 0) - 1) {
      setIsQuizCompleted(true);
      return;
    }

    if (selectedOptionMain.value === quizData[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }

    selectedOption.current.forEach(item => {
      if (item) {
        item.checked = false;
      }
    });

    setCurrentQuestionIndex(prev => prev + 1);
  }

  function retryQuiz() {
    setIsQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    selectedOption.current = [];
  }

  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 p-5">
      {isQuizCompleted ? (
        <Results
          correctAnswers={correctAnswers}
          totalQuestions={quizData?.length || 0}
          onRetry={retryQuiz}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h1 className="mt-5 text-2xl font-bold text-center text-blue-700">Quiz App</h1>
          <h2 className="mt-5 text-xl text-center">
            Q{currentQuestionIndex + 1}: {quizData ? quizData[currentQuestionIndex].question.text : 'Loading...'}
          </h2>
          <ol className="space-y-4 mt-5">
            {quizData && shuffleArray([
              ...quizData[currentQuestionIndex].incorrectAnswers,
              quizData[currentQuestionIndex].correctAnswer,
            ]).map((answer, index) => (
              <li key={index} className="flex items-center">
                <input
                  id={answer}
                  name="quiz"
                  type="radio"
                  value={answer}
                  ref={el => selectedOption.current[index] = el}
                  className="mr-2"
                />
                <label className="text-lg" htmlFor={answer}>
                  {answer}
                </label>
              </li>
            ))}
          </ol>
          <Button
            variant="contained"
            color="primary"
            className="mt-5 w-full"
            onClick={nextQuestion}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default page;
