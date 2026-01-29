import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavigation from "./components/navigation/MainNavigation";
import DesktopHeader from "./components/navigation/DesktopHeader";

import Index from "./pages/Index";
import Search from "./pages/Search";
import CattleDetail from "./pages/CattleDetail";
import Messages from "./pages/Messages";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import Analytics from "./pages/Analytics";
import HealthRecords from "./pages/HealthRecords";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AIChatbot from "./components/chatbot/AIChatbot";
import AddUser from "./pages/AddUser";
import SellCattle from "./pages/SellCattle";

import { useEffect } from "react";
import { BASE_URL } from "./api"; // ✅ ADDED

const queryClient = new QueryClient();

const App = () => {
  // ✅ Backend connection check using BASE_URL
  useEffect(() => {
    fetch(`${BASE_URL}/api`)
      .then((res) => res.json())
      .then((data) => console.log("✅ Backend connected:", data))
      .catch((err) => console.error("❌ Backend not reachable:", err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          {/* ✅ Header */}
          <DesktopHeader />

          <div className="pb-16 lg:pb-0">
            <Routes>
              {/* 🌐 Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/listings/create" element={<CreateListing />} />
              <Route path="/listings/:id" element={<CattleDetail />} />
              <Route path="/listings/:id/edit" element={<EditListing />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/health-records" element={<HealthRecords />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/add-user" element={<AddUser />} />

              {/* ✅ New Sell Cattle page */}
              <Route path="/sell-cattle" element={<SellCattle />} />

              {/* ❌ 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Bottom navigation and chatbot */}
          <MainNavigation />
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
