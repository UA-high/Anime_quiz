import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../../auth/hooks/useAuth';
import QuizHeader from '../components/QuizHeader';
import McqCard from '../components/McqCard';
import PicqCard from '../components/PicqCard';
import QuizResultModal from '../components/QuizResultModal';
import Loader from '../../auth/components/Loader';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Trophy } from 'lucide-react';

export default function InterviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';
  const [selectedType, setSelectedType] = useState(initialType);
  const [questionCount, setQuestionCount] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    quizType,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
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
    restartQuiz,
  } = useQuiz();

  // If initial URL has type parameter, auto-start that type
  useEffect(() => {
    if (initialType && (initialType === 'mcq' || initialType === 'picq') && !quizStarted) {
      setSelectedType(initialType);
      handleStartQuiz(initialType);
    }
  }, [initialType]);

  const handleStartQuiz = async (type) => {
    setSelectedType(type);
    setQuizStarted(true);
    setSearchParams({ type });
    await loadQuiz({ type, count: questionCount });
  };

  const handleModeReset = () => {
    setQuizStarted(false);
    setSelectedType('');
    setSearchParams({});
  };

  if (loading || submitting) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#F5F4EF] [background-image:radial-gradient(circle,#ccc_1px,transparent_1px)] [background-size:22px_22px] px-4 py-8 md:py-12 font-['Nunito',sans-serif]">
      {/* Container */}
      <div className="max-w-3xl mx-auto">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-white border-[2px] border-black px-4 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-sm text-black shadow-[3px_3px_0_#111] hover:bg-zinc-50 active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-['Gabarito',sans-serif] font-black text-sm bg-[#FDE047] border-[2px] border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0_#111]">
              Score: {user?.totalScore ?? 0} pts
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-[2.5px] border-black rounded-2xl text-red-800 font-bold shadow-[4px_4px_0_#000] flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => handleStartQuiz(selectedType || 'mcq')}
              className="bg-white border-[2px] border-black px-3 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0_#000] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Mode Selector Screen (when not started) */}
        {!quizStarted ? (
          <div className="bg-white border-[3px] border-black rounded-3xl p-6 md:p-10 shadow-[8px_8px_0_#111] relative">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#C4B5FD] border-[2px] border-black rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
                Select Your Challenge
              </span>
              <h1 className="font-['Gabarito',sans-serif] font-black text-3xl md:text-4xl text-black">
                Ready to test your Anime Knowledge?
              </h1>
              <p className="text-gray-600 font-bold mt-2">
                Choose a mode below and battle for the high score!
              </p>
            </div>

            {/* Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* MCQ Mode */}
              <div
                onClick={() => handleStartQuiz('mcq')}
                className="bg-[#F5F4EF] hover:bg-[#FDE047] border-[3px] border-black rounded-2xl p-6 shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-['Gabarito',sans-serif] font-black text-2xl text-black mb-2">
                    Classic MCQ
                  </h3>
                  <p className="text-sm font-bold text-gray-700">
                    Multiple-choice questions covering popular shonen, lore, characters, and iconic
                    moments.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-extrabold bg-white border-[2px] border-black px-2.5 py-1 rounded-lg">
                    4 Options
                  </span>
                  <span className="font-['Gabarito',sans-serif] font-black text-sm text-black flex items-center gap-1">
                    Play Now →
                  </span>
                </div>
              </div>

              {/* Picq Mode */}
              <div
                onClick={() => handleStartQuiz('picq')}
                className="bg-[#F5F4EF] hover:bg-[#C4B5FD] border-[3px] border-black rounded-2xl p-6 shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-4">🖼️</div>
                  <h3 className="font-['Gabarito',sans-serif] font-black text-2xl text-black mb-2">
                    Guess the Character
                  </h3>
                  <p className="text-sm font-bold text-gray-700">
                    Identify legendary anime characters from pictures with unlockable hints.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-extrabold bg-white border-[2px] border-black px-2.5 py-1 rounded-lg">
                    Visual + Hints
                  </span>
                  <span className="font-['Gabarito',sans-serif] font-black text-sm text-black flex items-center gap-1">
                    Play Now →
                  </span>
                </div>
              </div>
            </div>

            {/* Question count selector */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-black uppercase text-gray-500">Question Count:</span>
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-3 py-1 rounded-xl border-[2px] border-black font-black text-xs cursor-pointer transition-all ${
                    questionCount === cnt
                      ? 'bg-black text-white shadow-[2px_2px_0_#86EFAC]'
                      : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Quiz View */
          <div>
            {questions.length > 0 && currentQuestion && (
              <>
                <QuizHeader
                  currentIndex={currentIndex}
                  totalQuestions={totalQuestions}
                  timeLeft={timeLeft}
                  quizType={quizType}
                  onSubmitEarly={submitQuiz}
                />

                {quizType === 'picq' ? (
                  <PicqCard
                    question={currentQuestion}
                    selectedAnswer={userAnswers[currentQuestion._id]}
                    onSelectAnswer={(ans) => selectAnswer(currentQuestion._id, ans)}
                  />
                ) : (
                  <McqCard
                    question={currentQuestion}
                    selectedAnswer={userAnswers[currentQuestion._id]}
                    onSelectAnswer={(ans) => selectAnswer(currentQuestion._id, ans)}
                  />
                )}

                {/* Footer Navigation Controls */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-white disabled:opacity-50 disabled:cursor-not-allowed border-[2px] border-black px-5 py-3 rounded-xl font-['Gabarito',sans-serif] font-black text-sm shadow-[3px_3px_0_#111] hover:bg-zinc-50 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="flex items-center gap-2 bg-[#FDE047] hover:bg-[#FACC15] border-[2px] border-black px-6 py-3 rounded-xl font-['Gabarito',sans-serif] font-black text-sm shadow-[4px_4px_0_#111] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      Next Question
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitQuiz}
                      className="flex items-center gap-2 bg-[#86EFAC] hover:bg-[#4ade80] border-[2.5px] border-black px-6 py-3 rounded-xl font-['Gabarito',sans-serif] font-black text-base shadow-[4px_4px_0_#111] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Submit & Finish
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Results Modal */}
        {isFinished && result && (
          <QuizResultModal
            result={result}
            onRestart={restartQuiz}
            onSelectMode={handleModeReset}
          />
        )}
      </div>
    </div>
  );
}
