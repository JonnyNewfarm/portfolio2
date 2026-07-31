import type {
  ContactFormData,
  ContactValidationErrors,
} from "./contactTypes";

export const CONTACT_EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

export const EMPTY_CONTACT_FORM: ContactFormData = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

export function validateContactForm(
  form: ContactFormData,
): ContactValidationErrors {
  const errors: ContactValidationErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.email,
    )
  ) {
    errors.email = "Email must be valid.";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 10) {
    errors.message =
      "Message must be at least 10 characters.";
  }

  return errors;
}