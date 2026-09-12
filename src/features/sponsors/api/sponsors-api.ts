import { httpClient } from "../../../shared/api/http-client";
import type {
    TournamentSponsor,
    CreateSponsorPayload,
    UpdateSponsorPayload,
} from "../types";

function toFormData(payload: CreateSponsorPayload | UpdateSponsorPayload): FormData {
    const formData = new FormData();
    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.description !== undefined)
        formData.append("description", payload.description);
    if (payload.logo) formData.append("logo", payload.logo);
    if (payload.logoUrl !== undefined) formData.append("logoUrl", payload.logoUrl);
    if (payload.websiteUrl !== undefined && payload.websiteUrl !== null)
        formData.append("websiteUrl", payload.websiteUrl);
    if (payload.order !== undefined) formData.append("order", String(payload.order));
    if (payload.isActive !== undefined)
        formData.append("isActive", String(payload.isActive));
    return formData;
}

export const sponsorsApi = {
    // /admin trae todos los sponsors (activos e inactivos); el endpoint público
    // sin auth solo devuelve los vigentes, por eso el panel usa este.
    listByTournament: (tournamentId: string) =>
        httpClient.get<{ sponsors: TournamentSponsor[] }>(
            `/tournaments/${tournamentId}/sponsors/admin`
        ),

    create: (tournamentId: string, payload: CreateSponsorPayload) =>
        httpClient.postForm<{ sponsor: TournamentSponsor }>(
            `/tournaments/${tournamentId}/sponsors`,
            toFormData(payload)
        ),

    update: (tournamentId: string, id: string, payload: UpdateSponsorPayload) =>
        httpClient.patchForm<{ sponsor: TournamentSponsor }>(
            `/tournaments/${tournamentId}/sponsors/${id}`,
            toFormData(payload)
        ),

    delete: (tournamentId: string, id: string) =>
        httpClient.delete<{ message: string }>(
            `/tournaments/${tournamentId}/sponsors/${id}`
        ),
};