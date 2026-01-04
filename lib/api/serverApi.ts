import { cookies } from "next/headers";
import type { Note, NewNoteData } from "../../types/note"; 
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


export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString(); 

  try {
    const { data } = await axiosInstance.get<User>("/auth/session", {
      headers: {
        Cookie: allCookies, 
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
  const allCookies = cookieStore.toString();

  try {
    const res = await axiosInstance.get<NotesHttpResponse>("/notes", {
      params,
      headers: {
        Cookie: allCookies,
      },
    });
    return res.data ?? { notes: [], totalPages: 0 };
  } catch (error) {
    console.error("Server fetchNotes error:", error);
    return { notes: [], totalPages: 0 };
  }
}


export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();
  
  const response = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: { 
        Cookie: allCookies 
    },
  });
  return response.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();
  
  const response = await axiosInstance.post<Note>("/notes", note, {
    headers: { 
        Cookie: allCookies 
    },
  });
  return response.data;
};
