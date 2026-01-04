export type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
}

export type NoteId = Note["id"];
export type TagType = Tag; 
export type SortBy = "title" | "createdAt" | "updatedAt";

export const CATEGORIES = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryNoAll = Exclude<Category, "All">;

export interface NewNoteData {
  title: string;
  content: string;
  tag: Tag;
}

export const Routes = {
  Home: "/",
  NoteDetails: "/notes/",
  NotesFilter: "/notes/filter/",
  NoteAction: "/notes/action/",
  NoteCreate: "/notes/action/create",
  SignIn: "/sign-in",
  SignUp: "/sign-up",
  Profile: "/profile",
  ProfileEdit: "/profile/edit",
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];

