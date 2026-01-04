import { cookies } from "next/headers";
import type { Note } from "../../types/note"; 
import type { User } from "../../types/user"; 
import { nextServer as axiosInstance } from "./api"; 

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
  perPage?: number;
}

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    if (!allCookies) return null; 

    const { data } = await axiosInstance.get<User>("/auth/session", {
      headers: { Cookie: allCookies },
    });
    return data;
  } catch (error) {
    return null; 
  }
};

export async function fetchNotes(params: FetchNotesParams): Promise<NotesHttpResponse> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    if (!allCookies) return { notes: [], totalPages: 0 };

    const res = await axiosInstance.get<NotesHttpResponse>("/notes", {
      params,
      headers: { Cookie: allCookies },
    });
    return res.data ?? { notes: [], totalPages: 0 };
  } catch (error) {
    return { notes: [], totalPages: 0 };
  }
}

export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    if (!allCookies) return null;

    const response = await axiosInstance.get<Note>(`/notes/${id}`, {
      headers: { Cookie: allCookies },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
