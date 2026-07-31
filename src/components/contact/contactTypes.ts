export type ContactFormData = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

export type ContactValidationErrors = {
  name?: string;
  email?: string;
  message?: string;
};