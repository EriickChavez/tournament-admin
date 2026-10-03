import { httpClient } from "../../../shared/api/http-client";
import type { Match } from "../../matches/types";
import type {
    BracketNode,
    GenerateBracketPayload,
    ScheduleBracketNodePayload,
} from "../types";

export const bracketsApi = {
    get: (phaseId: string) =>
        httpClient.get<{ nodes: BracketNode[] }>(`/phases/${phaseId}/bracket`),

    generate: (phaseId: string, payload: GenerateBracketPayload) =>
        httpClient.post<{ nodes: BracketNode[] }>(
            `/phases/${phaseId}/bracket/generate`,
            payload,
        ),

    scheduleNode: (
        phaseId: string,
        nodeId: string,
        payload: ScheduleBracketNodePayload,
    ) =>
        httpClient.post<{ node: BracketNode; match: Match }>(
            `/phases/${phaseId}/bracket/nodes/${nodeId}/schedule`,
            payload,
        ),
};