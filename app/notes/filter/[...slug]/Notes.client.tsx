"use client";

import { useCallback, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import StatusMessage from "@/components/StatusMessage/StatusMessage";
import css from "./NotesPage.module.css";
import type { NoteTag } from "@/types/note";
export default function NotesClient({ tag }: { tag?: NoteTag }) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isPending, isFetching, isError, isPlaceholderData } = useQuery({
    queryKey: ["notes", tag ?? "all", search, page],
    queryFn: ({ signal }) =>
      fetchNotes({ page, perPage: 12, search, tag, signal }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  const debouncedSearch = useDebouncedCallback((value: string): void => {
    setSearch(value.trim());
    setPage(1);
  }, 300);
  function changeSearch(value: string): void {
    setInput(value);
    debouncedSearch(value);
  }
  const closeModal = useCallback((): void => setIsModalOpen(false), []);
  function created(): void {
    closeModal();
    debouncedSearch.cancel();
    setInput("");
    setSearch("");
    setPage(1);
  }
  function deleted(): void {
    if (data?.notes.length === 1 && page > 1)
      setPage((previous) => previous - 1);
  }
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={input} onChange={changeSearch} />
        {totalPages > 1 && (
          <Pagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>
      {isPending && (
        <StatusMessage>Loading notes, please wait...</StatusMessage>
      )}
      {!isPending && isFetching && (
        <StatusMessage>Updating notes...</StatusMessage>
      )}
      {isError && (
        <StatusMessage error>
          There was an error, please try again...
        </StatusMessage>
      )}
      {!isError && notes.length > 0 && (
        <NoteList notes={notes} onDeleted={deleted} />
      )}
      {!isPending &&
        !isFetching &&
        !isError &&
        !isPlaceholderData &&
        notes.length === 0 && <StatusMessage>No notes found.</StatusMessage>}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSuccess={created} />
        </Modal>
      )}
    </main>
  );
}
