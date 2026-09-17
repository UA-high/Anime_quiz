import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { uploadMcq, uploadPicq } from '../services/quiz.api';
import { ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';

export default function AdminUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mcq');

  // MCQ Form State
  const [mcqTitle, setMcqTitle] = useState('');
  const [mcqDesc, setMcqDesc] = useState('');
  const [mcqAns, setMcqAns] = useState('');
  const [mcqOpts, setMcqOpts] = useState(['', '', '', '']);
  const [mcqImage, setMcqImage] = useState(null);

  // Picq Form State
  const [picqAns, setPicqAns] = useState('');
  const [picqHints, setPicqHints] = useState(['', '', '']);
  const [picqImage, setPicqImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMcqSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!mcqTitle || !mcqDesc || !mcqAns || mcqOpts.some((o) => !o)) {
      setError('Please fill all MCQ fields including 4 options and the correct answer.');
      return;
    }

    const formData = new FormData();
    formData.append('title', mcqTitle);
    formData.append('desc', mcqDesc);
    formData.append('ans', mcqAns);
    formData.append('opts', JSON.stringify(mcqOpts));
    if (mcqImage) {
      formData.append('image', mcqImage);
    }

    setLoading(true);
    try {
      await uploadMcq(formData);
      setMessage('MCQ question uploaded successfully!');
      setMcqTitle('');
      setMcqDesc('');
      setMcqAns('');
      setMcqOpts(['', '', '', '']);
      setMcqImage(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload MCQ');
    } finally {
      setLoading(false);
    }
  };

  const handlePicqSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const filteredHints = picqHints.filter((h) => h.trim());
    if (!picqAns || filteredHints.length === 0) {
      setError('Please provide at least 1 hint and the correct answer.');
      return;
    }

    const formData = new FormData();
    formData.append('ans', picqAns);
    formData.append('hints', JSON.stringify(filteredHints));
    if (picqImage) {
      formData.append('image', picqImage);
    } else {
      formData.append(
        'image',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop'
      );
    }

    setLoading(true);
    try {
      await uploadPicq(formData);
      setMessage('Picture question uploaded successfully!');
      setPicqAns('');
      setPicqHints(['', '', '']);
      setPicqImage(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload Picture Question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4EF] [background-image:radial-gradient(circle,#ccc_1px,transparent_1px)] [background-size:22px_22px] px-4 py-8 md:py-12 font-['Nunito',sans-serif]">
      <div className="max-w-2xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-white border-[2px] border-black px-4 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-sm text-black shadow-[3px_3px_0_#111] hover:bg-zinc-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="bg-[#FDE047] border-[2px] border-black px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_#111]">
            🛡️ Admin Panel
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white border-[3px] border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#111]">
          <h1 className="font-['Gabarito',sans-serif] font-black text-3xl text-black mb-2">
            Upload Quiz Questions
          </h1>
          <p className="text-gray-600 font-bold text-sm mb-6">
            Add new MCQs or Picture Guessing questions directly to the database.
          </p>

          {/* Feedback alerts */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-100 border-[2px] border-black rounded-xl text-emerald-900 font-bold text-sm shadow-[2px_2px_0_#000] flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-700" />
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-[2px] border-black rounded-xl text-red-900 font-bold text-sm shadow-[2px_2px_0_#000] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-700" />
              {error}
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => {
                setActiveTab('mcq');
                setMessage('');
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl border-[2.5px] border-black font-['Gabarito',sans-serif] font-black text-sm transition-all cursor-pointer ${
                activeTab === 'mcq'
                  ? 'bg-[#FDE047] shadow-[4px_4px_0_#111]'
                  : 'bg-[#F5F4EF] hover:bg-zinc-100 text-gray-700 shadow-[2px_2px_0_#111]'
              }`}
            >
              ⚡ Upload MCQ
            </button>
            <button
              onClick={() => {
                setActiveTab('picq');
                setMessage('');
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl border-[2.5px] border-black font-['Gabarito',sans-serif] font-black text-sm transition-all cursor-pointer ${
                activeTab === 'picq'
                  ? 'bg-[#C4B5FD] shadow-[4px_4px_0_#111]'
                  : 'bg-[#F5F4EF] hover:bg-zinc-100 text-gray-700 shadow-[2px_2px_0_#111]'
              }`}
            >
              🖼️ Upload Picture Question
            </button>
          </div>

          {/* MCQ Form */}
          {activeTab === 'mcq' ? (
            <form onSubmit={handleMcqSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  value={mcqTitle}
                  onChange={(e) => setMcqTitle(e.target.value)}
                  placeholder="e.g., Who is the protagonist of One Piece?"
                  className="w-full border-[2px] border-black rounded-xl px-4 py-2.5 text-sm font-bold bg-[#F5F4EF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Description / Clue</label>
                <input
                  type="text"
                  required
                  value={mcqDesc}
                  onChange={(e) => setMcqDesc(e.target.value)}
                  placeholder="e.g., A boy with rubber body who wants to be Pirate King."
                  className="w-full border-[2px] border-black rounded-xl px-4 py-2.5 text-sm font-bold bg-[#F5F4EF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">4 Options</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mcqOpts.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      required
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...mcqOpts];
                        newOpts[idx] = e.target.value;
                        setMcqOpts(newOpts);
                      }}
                      className="border-[2px] border-black rounded-xl px-3 py-2 text-sm font-bold bg-[#F5F4EF] outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Correct Answer</label>
                <input
                  type="text"
                  required
                  value={mcqAns}
                  onChange={(e) => setMcqAns(e.target.value)}
                  placeholder="Must exactly match one of the options above (e.g., Luffy)"
                  className="w-full border-[2px] border-black rounded-xl px-4 py-2.5 text-sm font-bold bg-[#F5F4EF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Optional Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMcqImage(e.target.files[0])}
                  className="w-full text-xs font-bold border-[2px] border-black rounded-xl p-2 bg-[#F5F4EF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#FDE047] hover:bg-[#facc15] border-[2.5px] border-black rounded-xl py-3 font-['Gabarito',sans-serif] font-black text-base shadow-[4px_4px_0_#111] active:translate-y-0.5 cursor-pointer transition-all"
              >
                {loading ? 'Uploading...' : '⚡ Publish MCQ'}
              </button>
            </form>
          ) : (
            /* Picq Form */
            <form onSubmit={handlePicqSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Correct Answer (Character Name)
                </label>
                <input
                  type="text"
                  required
                  value={picqAns}
                  onChange={(e) => setPicqAns(e.target.value)}
                  placeholder="e.g., Monkey D. Luffy"
                  className="w-full border-[2px] border-black rounded-xl px-4 py-2.5 text-sm font-bold bg-[#F5F4EF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Hints (At least 1-3 hints)
                </label>
                <div className="flex flex-col gap-2">
                  {picqHints.map((hint, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Hint ${idx + 1} (e.g., Straw Hat, Gum-Gum Fruit)`}
                      value={hint}
                      onChange={(e) => {
                        const newHints = [...picqHints];
                        newHints[idx] = e.target.value;
                        setPicqHints(newHints);
                      }}
                      className="border-[2px] border-black rounded-xl px-3 py-2 text-sm font-bold bg-[#F5F4EF] outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Character Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPicqImage(e.target.files[0])}
                  className="w-full text-xs font-bold border-[2px] border-black rounded-xl p-2 bg-[#F5F4EF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#C4B5FD] hover:bg-[#a78bfa] border-[2.5px] border-black rounded-xl py-3 font-['Gabarito',sans-serif] font-black text-base shadow-[4px_4px_0_#111] active:translate-y-0.5 cursor-pointer transition-all"
              >
                {loading ? 'Uploading...' : '🖼️ Publish Picture Question'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
