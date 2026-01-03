
import { cookies } from "next/headers";
import type { Note, Category } from "../../types/note";

import { nextServer as axiosInstance } from "./clientApi"; 

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Exclude<Category, "All">;
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieStore = cookies();
  try {
    
    const res = await axiosInstance.get<FetchNotesResponse>('/notes', {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data ?? { notes: [], totalPages: 0 };
  } catch (error) {
    console.error("Server fetchNotes error:", error);
    return { notes: [], totalPages: 0 };
  }
}

