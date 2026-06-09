"use server";

export type B2BFormState = {
  success: boolean;
  error?: string;
};

export async function submitB2BForm(
  _prevState: B2BFormState,
  formData: FormData,
): Promise<B2BFormState> {
  const company = formData.get("company") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!company || !name || !email) {
    return { success: false, error: "Molimo popunite sva obavezna polja." };
  }

  // TODO: wire Brevo email sending
  console.log("B2B form submission:", { company, name, email, message });

  return { success: true };
}
