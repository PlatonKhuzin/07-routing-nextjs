"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { CreateNoteParams } from "@/lib/api";
import css from "./NoteForm.module.css";
interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}
const schema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "At least 3 characters")
    .max(50, "At most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "At most 500 characters"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Choose a valid tag",
    )
    .required("Tag is required"),
});
const initialValues: CreateNoteParams = { title: "", content: "", tag: "Todo" };
export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: createNote });
  async function submit(
    values: CreateNoteParams,
    helpers: FormikHelpers<CreateNoteParams>,
  ): Promise<void> {
    try {
      await mutation.mutateAsync({ ...values, title: values.title.trim() });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      helpers.resetForm();
      onSuccess();
    } catch {
      helpers.setStatus("Could not create the note. Please try again.");
    }
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={submit}
    >
      {({ isSubmitting, status }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>
          {typeof status === "string" && (
            <p className={css.error} role="alert">
              {status}
            </p>
          )}
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
