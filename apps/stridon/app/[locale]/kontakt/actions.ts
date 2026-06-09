"use server";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Molimo popunite sva obavezna polja." };
  }

  // TODO: wire Brevo email sending
  console.log("Contact form submission:", { name, email, message });

  return { success: true };
}
