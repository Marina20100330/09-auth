import axios from "axios";
import type { User } from "@/types/user"; 
import type { NewNoteData, Note } from "@/types/note";


export const nextServer = axios.create({ 
  baseURL: "/api",
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

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};


export const checkSession = async (): Promise<User | null> => {
  const res = await nextServer.get<User>("/auth/session");
  return res.data; 
};

export const getMe = async (): Promise<User> => {
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

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined, 
  perPage: number = 12, 
): Promise<NotesHttpResponse> => {
  const params = {
    ...(search && { search }), 
    ...(tag && tag !== 'All' && { tag }),
    page,
    perPage,
  };

  const response = await nextServer.get<NotesHttpResponse>("/notes", { params });
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
