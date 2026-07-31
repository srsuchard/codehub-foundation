"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { MAX_UPLOAD_BYTES } from "./documents";
import { createAuthClient, getSessionProfile } from "./auth";
import { isStaff } from "./roles";
import type { FormState } from "./schemas";
import { getSupabase } from "./supabase";

const BUCKET = "documents";

const uploadSchema = z.object({
  title: z.string().trim().min(2, "Give the document a title").max(200),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) => value || null),
  category: z.enum([
    "bylaws",
    "policy",
    "agreement",
    "form",
    "minutes",
    "agenda",
    "financial",
    "other",
  ]),
  visibility: z.enum(["board", "staff", "admin_only"]),
  meeting_id: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null),
});

/** Strip anything that could escape the intended prefix or confuse storage. */
function safeName(name: string) {
  return (
    name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .slice(-100) || "file"
  );
}

export async function uploadDocument(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await getSessionProfile();

  if (!isStaff(profile?.role)) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const parsed = uploadSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    visibility: formData.get("visibility"),
    meeting_id: formData.get("meeting_id"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file to upload." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      status: "error",
      message: `That file is too large. The limit is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`,
    };
  }

  // Uploads use the service role because the bucket has no public policies at
  // all. Authorisation already happened above, and the metadata insert below
  // runs on the user's session so RLS still governs who can create records.
  const storage = getSupabase();
  const supabase = await createAuthClient({ canSetCookies: true });

  if (!storage || !supabase) {
    return { status: "error", message: "Storage isn't configured." };
  }

  const path = `${parsed.data.category}/${crypto.randomUUID()}-${safeName(file.name)}`;

  const { error: uploadError } = await storage.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { status: "error", message: `Upload failed: ${uploadError.message}` };
  }

  const { error } = await supabase.from("documents").insert({
    ...parsed.data,
    storage_path: path,
    file_name: file.name,
    mime_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: profile!.id,
  });

  if (error) {
    // Don't leave an orphaned file behind if the metadata row is rejected.
    await storage.storage.from(BUCKET).remove([path]);
    return { status: "error", message: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/admin/documents");
  revalidatePath("/admin/board");
  return { status: "success", message: "Uploaded." };
}

export async function deleteDocument(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await getSessionProfile();

  if (!isStaff(profile?.role)) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return { status: "error", message: "Unknown document." };

  const supabase = await createAuthClient({ canSetCookies: true });
  const storage = getSupabase();

  if (!supabase || !storage) {
    return { status: "error", message: "Not configured." };
  }

  // Read through the user's session first: if RLS won't show them the row,
  // they can't delete the file either.
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", id.data)
    .maybeSingle();

  if (!doc) return { status: "error", message: "Document not found." };

  const { error } = await supabase.from("documents").delete().eq("id", id.data);

  if (error) {
    return { status: "error", message: `Couldn't delete: ${error.message}` };
  }

  await storage.storage.from(BUCKET).remove([doc.storage_path as string]);

  revalidatePath("/admin/documents");
  revalidatePath("/admin/board");
  return { status: "success", message: "Deleted." };
}

/**
 * Mint a short-lived download link.
 *
 * The document row is fetched on the user's own session, so row-level security
 * decides whether they may see it at all. Only if that succeeds is a signed
 * URL created — which chains file access to the same policy that governs the
 * metadata, without ever making the bucket public.
 */
export async function getDownloadUrl(
  documentId: string,
): Promise<{ url: string } | { error: string }> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Not signed in." };

  const supabase = await createAuthClient();
  const storage = getSupabase();

  if (!supabase || !storage) return { error: "Not configured." };

  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .maybeSingle();

  if (!doc) return { error: "Not found." };

  const { data, error } = await storage.storage
    .from(BUCKET)
    .createSignedUrl(doc.storage_path as string, 60);

  if (error || !data) return { error: "Couldn't create a link." };

  return { url: data.signedUrl };
}

const meetingSchema = z.object({
  title: z.string().trim().min(2, "Give the meeting a title").max(200),
  meets_on: z.string().trim().min(1, "Pick a date"),
  location: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => value || null),
  summary: z
    .string()
    .trim()
    .max(4000)
    .optional()
    .transform((value) => value || null),
});

export async function createMeeting(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await getSessionProfile();

  if (!isStaff(profile?.role)) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const parsed = meetingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createAuthClient({ canSetCookies: true });
  if (!supabase) return { status: "error", message: "Not configured." };

  const { error } = await supabase.from("board_meetings").insert(parsed.data);

  if (error) {
    return { status: "error", message: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/admin/board");
  return { status: "success", message: "Meeting added." };
}
