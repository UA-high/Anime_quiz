import React from 'react';
import { Timer, Zap, Flag } from 'lucide-react';

export default function QuizHeader({
  currentIndex,
  totalQuestions,
  timeLeft,
  quizType,
  onSubmitEarly,
}) {
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const isTimeLow = timeLeft <= 5;

  return (
    <div className="w-full bg-white border-[2.5px] border-black rounded-2xl p-4 md:p-6 shadow-[4px_4px_0_#111] mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Category Badge & Counter */}
        <div className="flex items-center gap-3">
          <span className="bg-[#FDE047] border-[2px] border-black px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#111]">
            {quizType === 'picq' ? '🖼️ Guess The Anime' : '⚡ Classic MCQ'}
          </span>
          <span className="font-['Gabarito',sans-serif] font-black text-sm md:text-base text-gray-800">
            Question <span className="text-violet-700 font-extrabold">{currentIndex + 1}</span> of{' '}
            {totalQuestions}
          </span>
        </div>

        {/* Timer & Finish Button */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-[2px] border-black font-black text-sm transition-all duration-200 ${
              isTimeLow
                ? 'bg-[#FCA5A5] text-red-950 animate-pulse shadow-[3px_3px_0_#991b1b]'
                : 'bg-[#C4B5FD] text-black shadow-[2px_2px_0_#111]'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={onSubmitEarly}
            className="flex items-center gap-1 bg-[#86EFAC] hover:bg-[#4ade80] border-[2px] border-black px-3 py-1.5 rounded-xl font-black text-xs md:text-sm shadow-[2px_2px_0_#111] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-transform"
          >
            <Flag className="w-3.5 h-3.5" />
            Finish
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E5E4DF] h-3 border-[2px] border-black rounded-full overflow-hidden p-[1px]">
        <div
          className="bg-[#7C3AED] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
