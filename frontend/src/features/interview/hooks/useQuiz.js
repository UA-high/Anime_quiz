import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQuizQuestions, submitQuizAnswers } from '../services/quiz.api';
import { useAuth } from '../../auth/hooks/useAuth';

export const useQuiz = () => {
  const [quizType, setQuizType] = useState('mcq');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedAnswer }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const { refreshUserData } = useAuth();

  const timerRef = useRef(null);

  // Load questions
  const loadQuiz = useCallback(async ({ type = 'mcq', count = 10 } = {}) => {
    setLoading(true);
    setError('');
    setIsFinished(false);
    setResult(null);
    setUserAnswers({});
    setCurrentIndex(0);
    setQuizType(type);

    try {
      const data = await fetchQuizQuestions({ type, count });
      if (data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTimeLeft(30);
      } else {
        setError('No questions found for this category.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Answer selection
  const selectAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Submit all answers
  const submitQuiz = useCallback(async () => {
    if (submitting || isFinished) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const submissionArray = questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: userAnswers[q._id] || '',
    }));

    try {
      const res = await submitQuizAnswers({
        submissionArray,
        type: quizType,
      });
      setResult(res);
      setIsFinished(true);
      // Refresh user totalScore in context
      await refreshUserData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [submitting, isFinished, questions, userAnswers, quizType, refreshUserData]);

  // Next Question
  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      submitQuiz();
    }
  }, [currentIndex, questions.length, submitQuiz]);

  // Previous Question
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Per-question timer countdown
  useEffect(() => {
    if (loading || isFinished || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, isFinished, questions.length, currentIndex, nextQuestion]);

  return {
    quizType,
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    totalQuestions: questions.length,
    userAnswers,
    timeLeft,
    loading,
    submitting,
    isFinished,
    result,
    error,
    loadQuiz,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    restartQuiz: () => loadQuiz({ type: quizType, count: questions.length || 10 }),
  };
};
