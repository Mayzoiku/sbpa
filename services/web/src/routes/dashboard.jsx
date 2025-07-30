import DashboardLayout from "@/layouts/dashboard";
import Dashboard from "@/pages/dashboard";
import { Routes, Route } from "react-router-dom";
import Budget from "@/pages/budget";
import Wallets from "@/pages/wallets";
import Chat from "@/pages/chat";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard/budget" element={<Budget />} />
        <Route path="/dashboard/wallets" element={<Wallets />} />
        <Route path="/dashboard/chat" element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
