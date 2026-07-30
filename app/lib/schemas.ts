import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your name").max(100);
const email = z.email("Please enter a valid email address").trim();
const optionalText = (max: number) => z.string().trim().max(max).optional();

export const studentSchema = z.object({
  name,
  email,
  grade: z.string().trim().min(1, "Please tell us your age or grade").max(50),
  school: optionalText(150),
  interests: optionalText(500),
  experience: z.string().trim().min(1, "Please pick your experience level"),
  goals: optionalText(1000),
});

export const mentorSchema = z.object({
  name,
  email,
  profession: z.string().trim().min(2, "Please enter your profession").max(150),
  skills: z.string().trim().min(2, "Please list a few skills").max(500),
  experience: optionalText(1000),
  availability: z.string().trim().min(1, "Please pick your availability"),
});

export const contactSchema = z.object({
  name,
  email,
  topic: z.string().trim().min(1, "Please choose a topic"),
  message: z.string().trim().min(10, "Please write a bit more").max(2000),
});

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string[]>;
};

export const INITIAL_FORM_STATE: FormState = { status: "idle", message: "" };
