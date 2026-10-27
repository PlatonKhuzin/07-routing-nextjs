import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { notFound } from "next/navigation";
import { tags } from "@/lib/tags";
import NotesClient from "./Notes.client";
export const dynamic = "force-dynamic";
export default async function Notes({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const selected = slug[0];
  if (
    slug.length !== 1 ||
    (selected !== "all" && !tags.some((tag) => tag === selected))
  )
    notFound();
  const tag = tags.find((tag) => tag === selected);
  const queryClient = new QueryClient();
  const queryKey = ["notes", tag ?? "all", "", 1];
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag }),
  });
  if (queryClient.getQueryState(queryKey)?.status === "error")
    throw new Error(
      "Unable to load notes. Check your NoteHub token and connection.",
    );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={selected} tag={tag} />
    </HydrationBoundary>
  );
}
