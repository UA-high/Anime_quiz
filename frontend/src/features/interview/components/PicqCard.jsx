import React, { useState } from 'react';
import { Lightbulb, Sparkles, Check } from 'lucide-react';

export default function PicqCard({ question, selectedAnswer, onSelectAnswer }) {
  const [revealedHints, setRevealedHints] = useState({});

  if (!question) return null;

  const { image, hints = [], ans } = question;

  const toggleHint = (index) => {
    setRevealedHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full bg-white border-[2.5px] border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0_#111] relative">
      <div className="flex items-center justify-between mb-4">
        <span className="bg-[#C4B5FD] border-[2px] border-black px-3 py-0.5 rounded-lg text-xs font-black uppercase tracking-wide shadow-[2px_2px_0_#111]">
          🔍 Visual Challenge
        </span>
        <span className="text-xs font-bold text-gray-500">Name this character/anime</span>
      </div>

      {/* Picture Frame */}
      <div className="w-full flex justify-center mb-6">
        <div className="relative border-[3px] border-black rounded-2xl p-2 bg-[#FDE047] shadow-[5px_5px_0_#111] max-w-md w-full">
          <div className="overflow-hidden rounded-xl border-[2px] border-black bg-zinc-900 aspect-video md:aspect-[4/3] flex items-center justify-center">
            <img
              src={image}
              alt="Guess this anime character"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop';
              }}
            />
          </div>
        </div>
      </div>

      {/* Hints Accordion */}
      {hints && hints.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 font-black text-sm text-gray-700">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Need a clue? Tap to reveal hints:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hints.map((hint, idx) => {
              const isRevealed = revealedHints[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleHint(idx)}
                  className={`px-3 py-1.5 rounded-xl border-[2px] border-black text-xs font-bold transition-all shadow-[2px_2px_0_#111] cursor-pointer ${
                    isRevealed
                      ? 'bg-[#86EFAC] text-black font-extrabold'
                      : 'bg-[#F5F4EF] hover:bg-zinc-200 text-gray-700'
                  }`}
                >
                  {isRevealed ? `💡 Hint ${idx + 1}: ${hint}` : `🔒 Reveal Hint ${idx + 1}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* User Answer Input */}
      <div className="flex flex-col gap-2">
        <label className="font-['Gabarito',sans-serif] font-black text-sm text-black uppercase tracking-wide">
          Your Answer:
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedAnswer || ''}
            onChange={(e) => onSelectAnswer(e.target.value)}
            placeholder="Type character name (e.g., Luffy, Naruto, Goku)..."
            className="w-full border-[2.5px] border-black rounded-xl px-4 py-3.5 text-base font-bold bg-[#F5F4EF] placeholder-gray-400 outline-none focus:shadow-[4px_4px_0_#C4B5FD] focus:border-black transition-shadow"
          />
          {selectedAnswer && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#86EFAC] border-[1.5px] border-black rounded-lg p-1">
              <Check className="w-4 h-4 text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
