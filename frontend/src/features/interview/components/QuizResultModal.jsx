import React from 'react';
import { Trophy, ArrowRight, RotateCcw, Home, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuizResultModal({ result, onRestart, onSelectMode }) {
  const navigate = useNavigate();
  if (!result) return null;

  const scoreEarned = result.Score ?? 0;
  const totalScore = result.total ?? 0;
  const isPositive = scoreEarned >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-[3.5px] border-black rounded-3xl p-8 max-w-md w-full shadow-[8px_8px_0_#111] relative text-center animate-in fade-in zoom-in duration-200">
        {/* Floating Stars */}
        <div className="w-16 h-16 bg-[#FDE047] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0_#111] mx-auto flex items-center justify-center text-3xl mb-4">
          🏆
        </div>

        <span className="inline-block bg-[#C4B5FD] border-[2px] border-black rounded-md px-3 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
          Quiz Completed!
        </span>

        <h2 className="font-['Gabarito',sans-serif] font-black text-3xl text-black mb-1">
          {scoreEarned > 0 ? 'Awesome Job, Otaku!' : 'Keep Training!'}
        </h2>
        <p className="text-gray-600 font-bold text-sm mb-6">
          Backend scoring rule: <span className="text-emerald-600 font-extrabold">+5</span> correct,{' '}
          <span className="text-rose-600 font-extrabold">-2</span> wrong.
        </p>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F5F4EF] border-[2.5px] border-black rounded-2xl p-4 shadow-[3px_3px_0_#111]">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wide block mb-1">
              Round Score
            </span>
            <span
              className={`font-['Gabarito',sans-serif] font-black text-3xl ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? `+${scoreEarned}` : scoreEarned}
            </span>
          </div>

          <div className="bg-[#FDE047] border-[2.5px] border-black rounded-2xl p-4 shadow-[3px_3px_0_#111]">
            <span className="text-xs font-black text-black uppercase tracking-wide block mb-1">
              Total Score
            </span>
            <span className="font-['Gabarito',sans-serif] font-black text-3xl text-black">
              {totalScore}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full bg-[#86EFAC] hover:bg-[#4ade80] border-[2.5px] border-black rounded-xl py-3 font-['Gabarito',sans-serif] font-black text-base text-black shadow-[4px_4px_0_#111] hover:shadow-[6px_6px_0_#111] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>

          <button
            onClick={onSelectMode}
            className="w-full bg-[#C4B5FD] hover:bg-[#a78bfa] border-[2.5px] border-black rounded-xl py-3 font-['Gabarito',sans-serif] font-black text-base text-black shadow-[4px_4px_0_#111] hover:shadow-[6px_6px_0_#111] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <Star className="w-5 h-5" />
            Change Mode
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-white hover:bg-gray-50 border-[2.5px] border-black rounded-xl py-3 font-['Gabarito',sans-serif] font-black text-base text-black shadow-[4px_4px_0_#111] hover:shadow-[6px_6px_0_#111] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-5 h-5" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
