import { useRef, useState } from "react";
import { useImportData } from "../hooks/use-import-data";
import { validateImportFile } from "../utils/file-validation";
import {
  getImportErrorMessage,
  getImportRowErrors,
} from "../utils/import-error-message";
import type { ImportRowError, ImportSummary } from "../types";

const UploadIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const Spinner = () => (
  <svg
    className="animate-spin text-primary"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <p className="text-2xl font-bold text-gray-900">
        {value.toLocaleString("es-MX")}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

interface ImportSectionProps {
  tournamentId: string;
}

export function ImportSection({ tournamentId }: ImportSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const importData = useImportData(tournamentId);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportSummary | null>(null);
  const [rowErrors, setRowErrors] = useState<{
    errors: ImportRowError[];
    truncated: boolean;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState<ImportSummary | null>(null);

  const isValidating =
    importData.isPending && importData.variables?.dryRun === true;
  const isImporting =
    importData.isPending && importData.variables?.dryRun === false;

  function clearFeedback() {
    setPreview(null);
    setRowErrors(null);
    setMessage(null);
    setDone(null);
  }

  function handleError(err: unknown) {
    const rows = getImportRowErrors(err);
    if (rows) setRowErrors(rows);
    else setMessage(getImportErrorMessage(err));
  }

  function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    clearFeedback();
    const fileError = validateImportFile(selected);
    if (fileError) {
      setFile(null);
      setMessage(fileError);
      return;
    }

    setFile(selected);
    // Al elegir el archivo se simula la importación (dryRun): no escribe nada.
    importData.mutate(
      { file: selected, dryRun: true },
      {
        onSuccess: (result) => setPreview(result.summary),
        onError: handleError,
      },
    );
  }

  function handleConfirm() {
    if (!file) return;
    setMessage(null);
    importData.mutate(
      { file, dryRun: false },
      {
        onSuccess: (result) => {
          setPreview(null);
          setFile(null);
          setDone(result.summary);
        },
        onError: (err) => {
          // Los datos pudieron cambiar desde la simulación: se invalida la vista previa.
          setPreview(null);
          handleError(err);
        },
      },
    );
  }

  function handleReset() {
    setFile(null);
    clearFeedback();
    importData.reset();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <UploadIcon />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">
              Importar desde Excel
            </h2>
            <p className="text-xs text-gray-500">
              Carga equipos y jugadores en bloque. Las categorías deben existir
              antes de importar.
            </p>
          </div>
        </div>
        <a
          href="/plantilla-equipos-jugadores.xlsx"
          download
          className="min-h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 flex items-center hover:bg-gray-50 transition-colors shrink-0"
        >
          Descargar plantilla
        </a>
      </div>

      {/* Selector de archivo */}
      {!done && (
        <div
          onClick={() => !importData.isPending && fileRef.current?.click()}
          className={[
            "rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center gap-1.5 transition-colors",
            importData.isPending
              ? "cursor-wait border-gray-200 bg-gray-50"
              : "cursor-pointer border-gray-200 bg-gray-50 hover:border-primary hover:bg-blue-50/40 text-gray-400 hover:text-primary",
          ].join(" ")}
        >
          <UploadIcon />
          <p className="text-sm font-medium text-gray-700">
            {file ? file.name : "Selecciona el archivo .xlsx"}
          </p>
          <p className="text-xs text-gray-400">
            Máximo 5MB · hojas "Equipos" y "Jugadores"
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={handleSelectFile}
          />
        </div>
      )}

      {isValidating && (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <Spinner /> Validando archivo...
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
          {message}
        </div>
      )}

      {/* Errores por fila */}
      {rowErrors && (
        <div className="mt-4">
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 mb-3">
            <p className="text-sm font-medium text-red-700">
              El archivo tiene errores. Corrígelos y vuelve a subirlo; no se
              importó nada.
            </p>
            {rowErrors.truncated && (
              <p className="text-xs text-red-600 mt-1">
                Se muestran solo los primeros {rowErrors.errors.length} errores.
              </p>
            )}
          </div>
          <div className="max-h-80 overflow-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Hoja</th>
                  <th className="px-3 py-2 font-medium">Fila</th>
                  <th className="px-3 py-2 font-medium">Columna</th>
                  <th className="px-3 py-2 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {rowErrors.errors.map((err, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-700">{err.sheet}</td>
                    <td className="px-3 py-2 text-gray-700">{err.row}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {err.field || "—"}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{err.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista previa (resultado del dryRun) */}
      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-3">
            El archivo es válido. Esto es lo que se importará:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Equipos nuevos" value={preview.teamsCreated} />
            <StatCard
              label="Equipos existentes"
              value={preview.teamsExisting}
            />
            <StatCard
              label="Jugadores a crear"
              value={preview.playersCreated}
            />
            <StatCard
              label="Jugadores omitidos"
              value={preview.playersSkipped}
            />
          </div>
          {preview.playersSkipped > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Los jugadores omitidos ya existen en su equipo.
            </p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isImporting}
              className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isImporting ? "Importando..." : "Confirmar importación"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isImporting}
              className="min-h-9 px-4 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Resultado final */}
      {done && (
        <div className="mt-2">
          <div className="rounded-xl bg-green-50 border border-green-100 p-4 mb-4">
            <p className="text-sm font-medium text-green-700">
              Importación completada.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Equipos creados" value={done.teamsCreated} />
            <StatCard label="Equipos existentes" value={done.teamsExisting} />
            <StatCard label="Jugadores creados" value={done.playersCreated} />
            <StatCard label="Jugadores omitidos" value={done.playersSkipped} />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 min-h-9 px-4 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Importar otro archivo
          </button>
        </div>
      )}
    </div>
  );
}
