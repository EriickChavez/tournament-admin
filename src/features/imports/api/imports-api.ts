import { httpClient } from "../../../shared/api/http-client";
import type { ImportResult } from "../types";

export const importsApi = {
    upload: (tournamentId: string, file: File, dryRun: boolean) => {
        const formData = new FormData();
        formData.append("file", file); // el backend espera el campo "file"
        return httpClient.postForm<ImportResult>(
            `/tournaments/${tournamentId}/import${dryRun ? "?dryRun=true" : ""}`,
            formData,
        );
    },
};