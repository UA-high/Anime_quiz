import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function McqCard({ question, selectedAnswer, onSelectAnswer }) {
  if (!question) return null;

  const { title, desc, opts = [], image } = question;

  return (
    <div className="w-full bg-white border-[2.5px] border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0_#111] relative">
      {/* Optional image if present */}
      {image && (
        <div className="mb-6 rounded-xl border-[2px] border-black overflow-hidden max-h-64 flex justify-center bg-zinc-100 shadow-[3px_3px_0_#111]">
          <img
            src={image}
            alt="Question illustration"
            className="w-full h-auto object-cover max-h-64"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title & Desc */}
      <h2 className="font-['Gabarito',sans-serif] font-black text-xl md:text-2xl text-black mb-2 leading-tight">
        {title}
      </h2>
      {desc && <p className="text-gray-600 font-semibold text-sm mb-6">{desc}</p>}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {opts.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const letter = String.fromCharCode(65 + idx);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAnswer(option)}
              className={`text-left p-4 rounded-xl border-[2.5px] border-black font-['Nunito',sans-serif] font-bold text-sm md:text-base flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#FDE047] shadow-[4px_4px_0_#111] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#F5F4EF] shadow-[3px_3px_0_#111] hover:bg-white hover:shadow-[4px_4px_0_#111] hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg border-[2px] border-black flex items-center justify-center font-black text-xs ${
                    isSelected ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-black font-extrabold">{option}</span>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
