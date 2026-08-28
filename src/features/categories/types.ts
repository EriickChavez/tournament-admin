export interface Category {
  id: string;
  tournamentId: string;
  title: string;
  minAge: number | null;
  maxAge: number | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  title: string;
  minAge?: number | null;
  maxAge?: number | null;
  description?: string | null;
  order?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
