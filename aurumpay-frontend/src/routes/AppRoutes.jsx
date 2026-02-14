import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Coins from "../pages/admin/Coins";
import Revenue from "../pages/admin/Revenue";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../guards/ProtectedRoute";
import CoinOrders from "../pages/admin/CoinOrders";


const AppRoutes = () => {
  return (
    <Routes>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="coins" element={<Coins />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="orders" element={<CoinOrders />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
