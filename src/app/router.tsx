import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "./route-guard";
import { SplashPage } from "../pages/SplashPage";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />

      <Route path="/splash" element={<SplashPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
