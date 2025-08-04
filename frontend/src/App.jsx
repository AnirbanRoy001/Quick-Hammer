import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import AuctionManager from "./pages/AuctionManager";
import AllAuctions from "./pages/AllAuctions";
import BiddersTable from "./pages/BiddersTable";

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const hideFooter = hideNavbar; // Optionally hide footer too

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auction-manager" element={<AuctionManager />} />
          <Route path="/auctions" element={<AllAuctions />} />
          <Route path="/bidders-table" element={<BiddersTable />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;

