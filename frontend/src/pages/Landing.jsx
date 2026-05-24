import { BottomSec } from "../../components/landing/BottomSec";
import Features from "../../components/landing/Features";
import HeroSection from "../../components/landing/HeroSection";
import Navbar from "../../components/landing/Navbar";
import { Roles } from "../../components/landing/Roles";
import { Stat } from "../../components/landing/Stat";

export default function Landing() {
  return (
    <div className="font-sans bg-stone-50 text-gray-900 min-h-screen">
      <Navbar />

      <HeroSection />

      <Stat />

      <Features />

      <Roles />

      <BottomSec />

      <footer className="border-t border-gray-200 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} RateMyStore.
      </footer>
    </div>
  );
}
