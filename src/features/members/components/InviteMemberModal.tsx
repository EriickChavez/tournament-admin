import { useState } from "react";
import {
  useLookupUser,
  isUserNotFound,
} from "../../auth/hooks/use-lookup-user";
import { useInviteMember } from "../hooks/use-invite-member";
import { useCreateMemberAccount } from "../hooks/use-create-member-account";
import { getMemberErrorMessage } from "../utils/member-error-message";

type Mode = "invite" | "create";

function generatePassword(): string {
  // Contraseña temporal para compartir por fuera con la persona invitada
  // (no hay proveedor de correo, así que no hay invitación por email).
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/[+/=]/g, "")
    .slice(0, 12);
}

export function InviteMemberModal({
  tournamentId,
  onClose,
}: {
  tournamentId: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("invite");

  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const lookup = useLookupUser(searchEmail, searchEmail.length > 0);
  const invite = useInviteMember(tournamentId);

  const [createEmail, setCreateEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const createAccount = useCreateMemberAccount(tournamentId);

  function handleSearch() {
    setSearchEmail(email.trim());
  }

  function handleInvite(userId: string) {
    invite.mutate(userId, {
      onSuccess: () => onClose(),
    });
  }

  function switchToCreate(prefillEmail: string) {
    setCreateEmail(prefillEmail);
    setMode("create");
  }

  function handleGeneratePassword() {
    setPassword(generatePassword());
    setCopied(false);
  }

  async function handleCopyPassword() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAccount.mutate(
      {
        email: createEmail.trim(),
        displayName: displayName.trim(),
        password,
      },
      { onSuccess: () => onClose() },
    );
  }

  const inputClass =
    "flex-1 min-h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          {mode === "invite" ? "Invitar miembro" : "Crear cuenta nueva"}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {mode === "invite"
            ? "Busca a alguien que ya tenga cuenta en la plataforma."
            : "Crea una cuenta y agrégala como Admin de este torneo."}
        </p>

        {mode === "invite" && (
          <>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="correo@ejemplo.com"
                className={inputClass}
              />
              <button
                onClick={handleSearch}
                disabled={!email.trim()}
                className="min-h-10 px-4 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Buscar
              </button>
            </div>

            <div className="mt-4 min-h-16">
              {lookup.isLoading && (
                <p className="text-sm text-gray-400">Buscando...</p>
              )}

              {lookup.isError && (
                <div>
                  <p className="text-sm text-red-600">
                    {isUserNotFound(lookup.error)
                      ? "No existe ninguna cuenta con ese correo"
                      : getMemberErrorMessage(lookup.error)}
                  </p>
                  {isUserNotFound(lookup.error) && (
                    <button
                      type="button"
                      onClick={() => switchToCreate(searchEmail)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Crear cuenta nueva con este correo
                    </button>
                  )}
                </div>
              )}

              {lookup.data && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {lookup.data.user.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {lookup.data.user.displayName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInvite(lookup.data.user.id)}
                    disabled={invite.isPending}
                    className="min-h-9 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Invitar como Admin
                  </button>
                </div>
              )}

              {invite.isError && (
                <p className="text-sm text-red-600 mt-2">
                  {getMemberErrorMessage(invite.error)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => switchToCreate(email.trim())}
              className="mt-4 text-xs font-medium text-gray-500 hover:text-primary transition-colors"
            >
              ¿No tiene cuenta todavía? Crear una nueva
            </button>
          </>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Correo
              </label>
              <input
                type="email"
                required
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className={`${inputClass} w-full`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nombre y apellido"
                className={`${inputClass} w-full`}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Contraseña temporal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setCopied(false);
                  }}
                  placeholder="Mínimo 8 caracteres"
                  className={inputClass}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="min-h-10 px-3 rounded-xl bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Generar
                </button>
              </div>
              {password && (
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="mt-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {copied ? "Copiada ✓" : "Copiar contraseña"}
                </button>
              )}
              <p className="text-[11px] text-gray-400 mt-1">
                Compártela con la persona por fuera de la plataforma; no se
                envía por correo.
              </p>
            </div>

            {createAccount.isError && (
              <p className="text-sm text-red-600">
                {getMemberErrorMessage(createAccount.error)}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setMode("invite")}
                className="text-xs font-medium text-gray-500 hover:text-primary transition-colors"
              >
                ← Invitar cuenta existente
              </button>
              <button
                type="submit"
                disabled={createAccount.isPending}
                className="min-h-9 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {createAccount.isPending ? "Creando..." : "Crear y agregar"}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="min-h-9 px-4 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
