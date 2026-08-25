import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "./route-guard";
import { AppLayout } from "./AppLayout";
import { SplashPage } from "../pages/SplashPage";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { PersonalizacionPage } from "../features/personalizacion/PersonalizacionPage";
import { CreateTournamentPage } from "../pages/CreateTournamentPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />
      <Route path="/splash" element={<SplashPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/personalizacion" element={<PersonalizacionPage />} />
          <Route path="/torneos/crear" element={<CreateTournamentPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
