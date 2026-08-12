import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../features/auth/api/auth-api";
import { ApiError } from "../shared/types/api-error";

const TIMEOUT_MS = 10_000;
const MIN_DISPLAY_MS = 3_000;

export function SplashPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const startedAt = Date.now();

    function navigateAfterMinDisplay(callback: () => void) {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        if (!cancelled) callback();
      }, remaining);
    }

    async function checkSession() {
      setHasError(false);
      try {
        const data = await authApi.me();
        if (cancelled) return;
        queryClient.setQueryData(["auth", "me"], data);
        navigateAfterMinDisplay(() => navigate("/home", { replace: true }));
      } catch (error) {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          navigateAfterMinDisplay(() => navigate("/login", { replace: true }));
          return;
        }

        navigateAfterMinDisplay(() => setHasError(true));
      } finally {
        clearTimeout(timeoutId);
      }
    }

    checkSession();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [attempt, navigate, queryClient]);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-center text-gray-700">
          No pudimos conectar con el servidor.
        </p>
        <button
          onClick={() => setAttempt((n) => n + 1)}
          className="min-h-11 px-6 rounded bg-gray-900 text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );
}
