
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client"; 
import { fetchNotes } from "@/lib/api/serverApi"; 
import type { Metadata } from "next";
import { CATEGORIES, type Category, type CategoryNoAll } from "@/types/note";
import { notFound } from "next/navigation"; 

const PER_PAGE = 8;

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {

  const { slug } = await params;
 
  const firstParam = slug[0];
  const tag = CATEGORIES.find(c => c.toLowerCase() === firstParam?.toLowerCase()) as Category;

  if (!tag) notFound(); 

  const tagNote: CategoryNoAll | undefined =
    tag === "All" ? undefined : (tag as CategoryNoAll);

  const queryClient = new QueryClient();

  try {
    
    await queryClient.prefetchQuery({
      queryKey: ["notes", "", 1, tagNote ?? null], 
      queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "", tag: tagNote }), 
     
    });
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {}
      <NotesClient tag={tagNote} />
    </HydrationBoundary>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  
  const { slug } = await params;
  const category = slug[0];

  const validCategory = CATEGORIES.find(c => c.toLowerCase() === category?.toLowerCase()) as Category;

  if (!validCategory) {
    return {
      title: "NoteHub - Not Found",
      description: "The requested category does not exist.",
    };
  }

  return {
    
    title: `Notes: ${validCategory} | NoteHub`,
  };
}
