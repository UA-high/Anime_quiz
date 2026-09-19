import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, LogOut, Zap, Trophy, Shield, Play, HelpCircle, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

import {
    ChartPatterns, Scribble, Sidebar, SketchButton, TimeToggle,
    OverviewView, AnalyticsView, TeamView, MessagesView, SettingsView, PopCard
} from "../components/Dashboardcomps.jsx";

export default function PaperPopDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeRange, setTimeRange] = useState("Monthly");

    const { user, handleLogout, refreshUserData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUserData();
    }, []);

    const onLogout = async () => {
        await handleLogout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-[#fdfbf7]">
            <ChartPatterns />

            <Sidebar active={activeTab} setActive={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-24 px-6 md:px-10 flex items-center justify-between flex-shrink-0 border-b-[2px] border-black/10 bg-[#fdfbf7]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 border-[3px] border-black rounded-lg shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none bg-white">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-black relative inline-block font-['Gabarito',sans-serif]">
                                    Otaku Dashboard
                                    <Scribble />
                                </h1>
                                {user?.role === 'admin' && (
                                    <span className="bg-[#FDE047] border-[2px] border-black text-xs font-black px-2 py-0.5 rounded-md shadow-[1.5px_1.5px_0_#000]">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-bold text-gray-500">
                                Logged in as: <strong className="text-black">{user?.username || 'Otaku'}</strong> ({user?.email})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Start Quiz Buttons */}
                        <Link
                            to="/interview?type=mcq"
                            className="hidden sm:flex items-center gap-1.5 bg-[#FDE047] hover:bg-[#facc15] border-[2.5px] border-black px-3.5 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-xs shadow-[2px_2px_0_#000] transition-all cursor-pointer active:translate-y-0.5"
                        >
                            <Zap className="w-4 h-4" />
                            Play MCQ
                        </Link>

                        <Link
                            to="/interview?type=picq"
                            className="hidden sm:flex items-center gap-1.5 bg-[#C4B5FD] hover:bg-[#a78bfa] border-[2.5px] border-black px-3.5 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-xs shadow-[2px_2px_0_#000] transition-all cursor-pointer active:translate-y-0.5"
                        >
                            🖼️ Guess Anime
                        </Link>

                        <Link
                            to="/rooms"
                            className="hidden md:flex items-center gap-1.5 bg-[#86EFAC] hover:bg-[#4ade80] border-[2.5px] border-black px-3.5 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-xs shadow-[2px_2px_0_#000] transition-all cursor-pointer active:translate-y-0.5"
                        >
                            <Users className="w-4 h-4" />
                            Room Quiz
                        </Link>

                        {/* Admin Link if admin */}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin/upload"
                                className="hidden md:flex items-center gap-1.5 bg-[#86EFAC] hover:bg-[#4ade80] border-[2.5px] border-black px-3.5 py-2 rounded-xl font-['Gabarito',sans-serif] font-black text-xs shadow-[2px_2px_0_#000] transition-all cursor-pointer active:translate-y-0.5"
                            >
                                <Shield className="w-4 h-4" />
                                Admin Upload
                            </Link>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            title="Log Out"
                            className="p-2.5 bg-white hover:bg-rose-100 border-[2.5px] border-black rounded-xl shadow-[2px_2px_0_#000] active:translate-y-0.5 cursor-pointer transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-black" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-20">
                    {/* User Stats Hero Banner */}
                    <div className="max-w-6xl mx-auto mb-8">
                        <PopCard color="bg-[#FDE047]" className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0_#000]">
                                    🎌
                                </div>
                                <div>
                                    <span className="text-xs font-black uppercase tracking-wider bg-white/80 border-[1.5px] border-black px-2.5 py-0.5 rounded-md inline-block mb-1">
                                        Otaku Profile
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-black font-['Gabarito',sans-serif] text-black">
                                        Konnichiwa, {user?.username || 'Fellow Otaku'}!
                                    </h2>
                                    <p className="text-sm font-bold text-black/80 mt-1">
                                        Answer anime quizzes to level up your score (+5 correct, -2 wrong).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                <div className="bg-white border-[3px] border-black rounded-2xl px-6 py-3 shadow-[4px_4px_0_#000] text-center">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-wide block">
                                        Career Score
                                    </span>
                                    <span className="text-3xl font-black font-['Gabarito',sans-serif] text-violet-700">
                                        {user?.totalScore ?? 0} pts
                                    </span>
                                </div>

                                <Link
                                    to="/interview"
                                    className="bg-black text-white hover:bg-zinc-800 border-[3px] border-black rounded-2xl px-6 py-4 font-['Gabarito',sans-serif] font-black text-sm shadow-[4px_4px_0_#C4B5FD] active:translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-white" />
                                    Launch Quiz
                                </Link>
                            </div>
                        </PopCard>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'Dashboard' && <OverviewView timeRange={timeRange} />}
                            {activeTab === 'Analytics' && <AnalyticsView timeRange={timeRange} />}
                            {activeTab === 'Team' && <TeamView />}
                            {activeTab === 'Messages' && <MessagesView />}
                            {activeTab === 'Settings' && <SettingsView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
