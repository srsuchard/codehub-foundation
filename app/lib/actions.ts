"use server";

import { z } from "zod";

import {
  boardSchema,
  contactSchema,
  mentorSchema,
  sponsorSchema,
  studentSchema,
  type FormState,
} from "./schemas";
import { getSupabase } from "./supabase";

/**
 * These forms are public and unauthenticated by design — anyone may apply.
 * Server Actions are reachable by direct POST, so every submission is
 * re-validated here rather than trusting the client.
 */
async function submit<T extends z.ZodType>(
  schema: T,
  table: string,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: a real person never fills a hidden field. Report success so
  // bots don't learn they were caught.
  if (formData.get("website")) {
    return { status: "success", message: "Thanks — we'll be in touch soon." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = getSupabase();

  if (!supabase) {
    console.error(`[${table}] Supabase is not configured; submission dropped.`);
    return {
      status: "error",
      message:
        "We can't accept submissions just yet. Please email hello@codehubfoundation.org.",
    };
  }

  const { error } = await supabase.from(table).insert(parsed.data);

  if (error) {
    console.error(`[${table}] insert failed:`, error.message);
    return {
      status: "error",
      message:
        "Something went wrong saving your application. Please try again, or email hello@codehubfoundation.org.",
    };
  }

  return {
    status: "success",
    message: "Thanks — we got it. We'll be in touch within a few days.",
  };
}

export async function submitStudentApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return submit(studentSchema, "student_applications", formData);
}

export async function submitMentorApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return submit(mentorSchema, "mentor_applications", formData);
}

export async function submitContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return submit(contactSchema, "contact_messages", formData);
}

export async function submitBoardApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return submit(boardSchema, "board_applications", formData);
}

export async function submitSponsorInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return submit(sponsorSchema, "sponsor_inquiries", formData);
}
