

import axios from "axios";
import type { User } from "@/types/user"; 
import type { NewNoteData, Note, Category } from "@/types/note";


export const nextServer = axios.create({ 
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  withCredentials: true, 
});

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}
export interface RegisterRequest {
  email: string;
  password: string;
}
export type LoginRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};
export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
export const updateMe = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const res = await nextServer.patch<User>("/users/me", { username, email });
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined, 
  perPage: number = 8, 
  sortBy?: "created" | "updated"
): Promise<NotesHttpResponse> => {
  const params: Record<string, string | number> = {
    ...(search && { search }), 
    ...(tag && { tag }),
    page,
    perPage,
    ...(sortBy && { sortBy }),
  };

  const response = await nextServer.get<NotesHttpResponse>("/notes", {
    params,
  });
  return response.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
 
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};
