import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu } from "lucide-react";

// 1. Removed GlobalStyles from the import list
import {
    ChartPatterns, Scribble, Sidebar, SketchButton, TimeToggle,
    OverviewView, AnalyticsView, TeamView, MessagesView, SettingsView
} from "../components/Dashboardcomps.jsx";

// --- Main Layout ---

export default function PaperPopDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeRange, setTimeRange] = useState("Monthly");

    return (
        <div className="min-h-screen flex">
            {/* 2. Removed <GlobalStyles /> from here */}
            <ChartPatterns />

            <Sidebar active={activeTab} setActive={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-24 px-6 md:px-10 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 border-[3px] border-black rounded-lg shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex flex-col">
                            <h1 className="text-3xl font-black relative inline-block">
                                Uilora Dash
                                <Scribble />
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex">
                             {activeTab !== 'Team' && activeTab !== 'Messages' && activeTab !== 'Settings' && (
                                  <TimeToggle active={timeRange} onChange={setTimeRange}/>
                             )}
                        </div>
                        <div className="relative hidden lg:block ml-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search doodles..."
                                className="pl-10 pr-4 py-2 border-[3px] border-black rounded-full font-bold focus:outline-none focus:shadow-[4px_4px_0px_#c084fc] transition-shadow bg-white w-64 shape-wobble-sm"
                            />
                        </div>
                        {/* Note: I removed the extra <Bell /> inside here because you are already passing icon={Bell} as a prop! */}
                        <SketchButton variant="outline" className="w-12 h-12 p-0 rounded-full shape-wobble-sm" onClick={() => { }} icon={Bell} />
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-20">
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