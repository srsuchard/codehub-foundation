"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthClient, getSessionProfile } from "./auth";
import { isStaff } from "./roles";
import type { FormState } from "./schemas";

/** Empty form fields arrive as "" — store NULL rather than blank strings. */
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null);

const programSchema = z.object({
  name: z.string().trim().min(2, "Give the program a name").max(150),
  kind: z.enum(["class", "workshop", "cybersecurity", "ai_project", "event"]),
  status: z.enum(["draft", "open", "running", "completed", "cancelled"]),
  summary: optional(2000),
  instructor: optional(150),
  schedule: optional(300),
  location: optional(200),
  materials_url: optional(500),
  capacity: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || (Number.isInteger(value) && value > 0), {
      message: "Capacity must be a whole number above zero",
    }),
  starts_on: optional(20),
  ends_on: optional(20),
});

async function requireStaffClient() {
  const profile = await getSessionProfile();
  if (!isStaff(profile?.role)) return null;
  return createAuthClient({ canSetCookies: true });
}

function invalid(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

export async function createProgram(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await requireStaffClient();
  if (!supabase) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const parsed = programSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const { data, error } = await supabase
    .from("programs")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: `Couldn't create: ${error.message}` };
  }

  redirect(`/admin/programs/${data.id}`);
}

export async function updateProgram(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await requireStaffClient();
  if (!supabase) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return { status: "error", message: "Unknown program." };

  const parsed = programSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const { error } = await supabase
    .from("programs")
    .update(parsed.data)
    .eq("id", id.data);

  if (error) {
    return { status: "error", message: `Couldn't save: ${error.message}` };
  }

  revalidatePath(`/admin/programs/${id.data}`);
  revalidatePath("/admin/programs");
  return { status: "success", message: "Saved." };
}

const linkSchema = z.object({
  programId: z.uuid(),
  personId: z.uuid(),
});

/** Enrol an existing student applicant, or assign a volunteer, to a program. */
async function link(
  table: "program_enrollments" | "program_volunteers",
  column: "student_application_id" | "mentor_application_id",
  formData: FormData,
  remove: boolean,
): Promise<FormState> {
  const supabase = await requireStaffClient();
  if (!supabase) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const parsed = linkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Pick someone from the list." };
  }

  const { programId, personId } = parsed.data;

  const query = remove
    ? supabase
        .from(table)
        .delete()
        .eq("program_id", programId)
        .eq(column, personId)
    : supabase.from(table).insert({ program_id: programId, [column]: personId });

  const { error } = await query;

  if (error) {
    // The unique constraint is the guard against double-enrolment.
    const duplicate = error.code === "23505";
    return {
      status: "error",
      message: duplicate
        ? "They're already on this program."
        : `Couldn't update: ${error.message}`,
    };
  }

  revalidatePath(`/admin/programs/${programId}`);
  return { status: "success", message: remove ? "Removed." : "Added." };
}

export async function enrollStudent(_prev: FormState, formData: FormData) {
  return link("program_enrollments", "student_application_id", formData, false);
}

export async function unenrollStudent(_prev: FormState, formData: FormData) {
  return link("program_enrollments", "student_application_id", formData, true);
}

export async function assignVolunteer(_prev: FormState, formData: FormData) {
  return link("program_volunteers", "mentor_application_id", formData, false);
}

export async function unassignVolunteer(_prev: FormState, formData: FormData) {
  return link("program_volunteers", "mentor_application_id", formData, true);
}
