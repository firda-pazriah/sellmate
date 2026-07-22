"use server";

import { loginSchema } from "@/components/login/schema";

export type LoginActionState = {
  error: string | null;
};

const GENERIC_ERROR = "Invalid email or password.";

export async function login(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: GENERIC_ERROR };
  }

  // TODO(auth): auth logic

  return {
    error:
      "Sign-in isn't connected to a real account system yet — this form is UI-only for now.",
  };
}
