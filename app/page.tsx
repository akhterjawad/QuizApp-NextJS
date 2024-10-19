'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";
const page = () => {

  interface QuizQuestion {
    id: string;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
  }
  let selectedOption = useRef<HTMLInputElement | null>(null)
  let [quizData, setQuizData] = useState<QuizQuestion[] | null>(null)
  let [currentQuestionIndex, setcurrentQuestionIndex] = useState<number>(0)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((response) => {
        console.log(response.data);
        setQuizData(response.data);
      })
      .catch((error) => {
        alert('check your internet connection')
        console.log(error);
      });
  }, [])


  function nextQuestion() {
    if (currentQuestionIndex >= (quizData?.length || 0) - 1) {
      alert('question is complete')
    } else {
      setcurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }


  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <React.Fragment>
      <h1 className='mt-5 text-center'>Quiz APP</h1>
      <h1>Q{currentQuestionIndex + 1}{quizData ?
        quizData[currentQuestionIndex].question.text :
        'loading...'}</h1>
      <ol className="space-y-4">
        {quizData && shuffleArray([
          ...quizData[currentQuestionIndex].incorrectAnswers,
          quizData[currentQuestionIndex].correctAnswer
        ]).map((answer, index) => (
          <li key={index} className="flex items-center">
            <input
              id={answer}
              name="quiz"
              type="radio"
              value={answer}
              ref={selectedOption}
              className="mr-2"
            />
            <label className="text-lg" htmlFor={answer}>
              {answer}
            </label>
          </li>
        ))}
      </ol>
      <button onClick={nextQuestion}>next</button>
    </React.Fragment>
  )
}

export default page