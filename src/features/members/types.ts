export interface Member {
    id: string;
    tournamentId: string;
    userId: string;
    roleId: string;
    roleName: "OWNER" | "ADMIN";
    status: string;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}
