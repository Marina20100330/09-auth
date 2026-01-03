import NotesClient from "./Notes.client"; 
import { fetchNotes } from "@/lib/api/clientApi"; 
import type { Metadata } from "next";
import type { CategoryNoAll } from "@/types/note";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const tagNote = params.slug[0] === "all" ? undefined : (params.slug[0] as CategoryNoAll);

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
     
      queryKey: ["notes", "", 1, tagNote], 
      queryFn: () => fetchNotes("", 1, tagNote), 
    });
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tagNote} />
    </HydrationBoundary>
  );
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const category = params.slug[0];
  return {
   
    title: `Notes: ${category} | NoteHub`,
  };
}
