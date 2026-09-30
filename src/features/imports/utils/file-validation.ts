export const MAX_IMPORT_FILE_MB = 5;

export function validateImportFile(file: File): string | null {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
        return "Formato no permitido. Usa un archivo .xlsx.";
    }
    if (file.size > MAX_IMPORT_FILE_MB * 1024 * 1024) {
        return `El archivo excede el máximo de ${MAX_IMPORT_FILE_MB}MB.`;
    }
    return null;
}