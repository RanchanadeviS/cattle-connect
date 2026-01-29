import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import CategoryTiles from "@/components/home/CategoryTiles";
import FeaturedListings from "@/components/home/FeaturedListings";
import MarketTrends from "@/components/home/MarketTrends";
import { BASE_URL } from "../api";

const Index = () => {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    // 👇 Fetch data from backend
    fetch(`${BASE_URL}/api`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Backend says:", data.message);
        setBackendMessage(data.message);
      })
      .catch((err) => {
        console.error("❌ Backend connection error:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-center p-4">
      <h1 className="text-2xl font-bold text-green-700">
        {backendMessage || "Connecting to backend..."}
      </h1>

      <HeroSection />
      <CategoryTiles />
      <FeaturedListings />
      <MarketTrends />
    </div>
  );
};

export default Index;
