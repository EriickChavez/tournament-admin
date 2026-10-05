import { httpClient } from "../../../shared/api/http-client";
import type { Match } from "../../matches/types";
import type {
    BracketNode,
    GenerateBracketPayload,
    ScheduleBracketNodePayload,
    SetBracketNodePenaltiesPayload,
} from "../types";

export const bracketsApi = {
    get: (phaseId: string) =>
        httpClient.get<{ nodes: BracketNode[] }>(`/phases/${phaseId}/bracket`),

    generate: (phaseId: string, payload: GenerateBracketPayload) =>
        httpClient.post<{ nodes: BracketNode[] }>(
            `/phases/${phaseId}/bracket/generate`,
            payload,
        ),

    // Solo mientras ningún cruce tenga partidos ni resultados.
    delete: (phaseId: string) =>
        httpClient.delete<{ message: string }>(`/phases/${phaseId}/bracket`),

    scheduleNode: (
        phaseId: string,
        nodeId: string,
        payload: ScheduleBracketNodePayload,
    ) =>
        httpClient.post<{ node: BracketNode; match: Match }>(
            `/phases/${phaseId}/bracket/nodes/${nodeId}/schedule`,
            payload,
        ),

    // Penales de un cruce a ida y vuelta cuyo global quedó empatado (null en ambos los borra).
    setNodePenalties: (
        phaseId: string,
        nodeId: string,
        payload: SetBracketNodePenaltiesPayload,
    ) =>
        httpClient.put<{ node: BracketNode }>(
            `/phases/${phaseId}/bracket/nodes/${nodeId}/penalties`,
            payload,
        ),
};