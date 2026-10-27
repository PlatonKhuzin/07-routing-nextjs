import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreview.client";
interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}
export const dynamic = "force-dynamic";
export default async function NotePreview({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const queryKey = ["note", id];
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNoteById(id),
  });
  if (queryClient.getQueryState(queryKey)?.status === "error")
    throw new Error(
      "Unable to load note details. The note may no longer exist.",
    );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
