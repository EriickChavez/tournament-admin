import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "./route-guard";
import { AppLayout } from "./AppLayout";
import { SplashPage } from "../pages/SplashPage";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { PersonalizacionPage } from "../features/personalizacion/PersonalizacionPage";
import { CreateTournamentPage } from "../pages/CreateTournamentPage";
import { EditTournamentPage } from "../pages/EditTournamentPage";
import { PhasesPage } from "../pages/PhasesPage";

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
          <Route path="/torneos/:id/editar" element={<EditTournamentPage />} />
          <Route
            path="/torneos/:tournamentId/categorias/:categoryId/fases"
            element={<PhasesPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
