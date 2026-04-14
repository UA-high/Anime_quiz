import Navbar      from "./components/Navbar";
import Hero        from "./components/Hero";
import StatsBar    from "./components/StatsBar";
import Categories  from "./components/Categories";
import DashPreview from "./components/DashPreview";
import HowItWorks  from "./components/HowItWorks";
import Leaderboard from "./components/Leaderboard";
import FinalCTA    from "./components/FinalCTA";
import Footer      from "./components/Footer";
import T           from "./tokens";
import PaperPopDashboard from "./pages/PaperPopDashboard";

export default function App() {
  return (
    <div style={{ fontFamily: T.fonts.body, background: T.bg, width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700;900&family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #F5F4EF; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 4px; }
        button { font-family: inherit; }
      `}</style>

      <Navbar />
      <Hero />
      <StatsBar />
      <Categories />
      <DashPreview />
      <HowItWorks />
      <Leaderboard />
      <FinalCTA />
      <Footer />
      
      {/*PaperPopDashboard is working*/}
      {/* <PaperPopDashboard /> */}
      
    </div>
  );
}
