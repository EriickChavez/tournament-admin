import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import { useLogin } from "../hooks/use-login";
import { getLoginErrorMessage } from "../utils/login-error-message";
import { ApiError } from "../../../shared/types/api-error";

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.code === "VALIDATION_ERROR" &&
          error.details
        ) {
          error.details.forEach((d) => {
            if (d.path === "email" || d.path === "password") {
              setError(d.path, { message: d.message });
            }
          });
        }
      },
    });
  }

  const generalError =
    login.isError &&
    !(
      login.error instanceof ApiError && login.error.code === "VALIDATION_ERROR"
    )
      ? getLoginErrorMessage(login.error)
      : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-5"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          {...register("email", { setValueAs: (value) => value.trim() })}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          {...register("password", { setValueAs: (value) => value.trim() })}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
        )}
      </div>

      {generalError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="min-h-11 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity active:scale-[0.98] transition-transform"
      >
        {login.isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
