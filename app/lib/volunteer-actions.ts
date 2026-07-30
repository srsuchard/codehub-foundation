"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAuthClient, getSessionProfile } from "./auth";
import { isStaff } from "./roles";
import type { FormState } from "./schemas";

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum([
    "new",
    "screening",
    "background_check",
    "training",
    "active",
    "inactive",
    "declined",
  ]),
  background_check: z.enum([
    "not_required",
    "pending",
    "cleared",
    "not_cleared",
  ]),
  training_completed: z.union([z.literal("on"), z.literal("")]).optional(),
  assigned_programs: z.string().trim().max(500).optional(),
  internal_notes: z.string().trim().max(4000).optional(),
});

/**
 * Update a volunteer's pipeline state.
 *
 * Enforced twice on purpose: the staff check here, and the RLS policy on
 * mentor_applications. This runs on the signed-in user's own session, so even
 * if this check were wrong, Postgres would still refuse the write.
 */
export async function updateVolunteer(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await getSessionProfile();

  if (!isStaff(profile?.role)) {
    return { status: "error", message: "You don't have access to do that." };
  }

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));

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

  if (!supabase) {
    return { status: "error", message: "Not configured." };
  }

  const { id, training_completed, ...fields } = parsed.data;

  // Checkbox → timestamp. Preserve the original completion date when it's
  // already set, so re-saving the form doesn't keep moving the date forward.
  const { data: existing } = await supabase
    .from("mentor_applications")
    .select("training_completed_at")
    .eq("id", id)
    .single();

  const trainingCompletedAt = training_completed
    ? ((existing?.training_completed_at as string | null) ??
      new Date().toISOString())
    : null;

  const { error } = await supabase
    .from("mentor_applications")
    .update({
      status: fields.status,
      background_check: fields.background_check,
      assigned_programs: fields.assigned_programs || null,
      internal_notes: fields.internal_notes || null,
      training_completed_at: trainingCompletedAt,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/admin/volunteers");
  return { status: "success", message: "Saved." };
}
