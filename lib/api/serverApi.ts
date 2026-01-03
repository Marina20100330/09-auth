

import { cookies } from "next/headers";
import type { Note, Category, NewNoteData } from "../../types/note"; 
import type { User } from "../../types/user"; 
import { nextServer as axiosInstance } from "./clientApi";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}
export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: Exclude<Category, "All">;
  perPage?: number;
  sortBy?: "created" | "updated";
}

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('No session found for server-side getMe');
  }

  try {
    const { data } = await axiosInstance.get<User>("/auth/me", {
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Server getMe error:", error);
    throw error;
  }
};

export async function fetchNotes(params: FetchNotesParams): Promise<NotesHttpResponse> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return { notes: [], totalPages: 0 };
  }

  try {
    const res = await axiosInstance.get<NotesHttpResponse>('/notes', {
      params,
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    });
    return res.data ?? { notes: [], totalPages: 0 };
  } catch (error) {
    console.error("Server fetchNotes error:", error);
    return { notes: [], totalPages: 0 };
  }
}

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('No session for createNote');
  const response = await axiosInstance.post<Note>("/notes", note, {
    headers: { Cookie: `session=${sessionCookie}` },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('No session for deleteNote');
  const response = await axiosInstance.delete<Note>(`/notes/${id}`, {
    headers: { Cookie: `session=${sessionCookie}` },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('No session for fetchNoteById');
  const response = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: { Cookie: `session=${sessionCookie}` },
  });
  return response.data;
};