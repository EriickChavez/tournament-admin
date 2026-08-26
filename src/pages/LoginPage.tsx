import { LoginForm } from "../features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nova</h1>
          <p className="text-sm text-gray-500 mt-1">Administrador de torneos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-gray-500 mb-6">Ingresa tus credenciales para continuar</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
