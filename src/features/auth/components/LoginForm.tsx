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
      className="w-full max-w-sm flex flex-col gap-4 p-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full min-h-11 px-3 border rounded"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full min-h-11 px-3 border rounded"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {generalError && <p className="text-sm text-red-600">{generalError}</p>}

      <button
        type="submit"
        disabled={login.isPending}
        className="min-h-11 rounded bg-gray-900 text-white disabled:opacity-50"
      >
        {login.isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
