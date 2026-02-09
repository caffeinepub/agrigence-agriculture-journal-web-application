/**
 * Shared validation utilities for consultation form
 */

export interface ConsultationFormData {
  consultationType: string;
  name: string;
  email: string;
  message: string;
}

/**
 * Validates email format using standard regex pattern
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that all required consultation form fields are filled and valid
 * Returns a strict boolean for use in form gating logic
 */
export function isConsultationFormValid(data: ConsultationFormData): boolean {
  const { consultationType, name, email, message } = data;
  
  // Check all required fields are non-empty
  if (!consultationType || !name.trim() || !email.trim() || !message.trim()) {
    return false;
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return false;
  }
  
  return true;
}
