/**
 * Builds a WhatsApp send URL with prefilled message containing consultation details.
 * Uses wa.me format for better cross-platform compatibility.
 * Ensures all consultation details are properly URL-encoded and included.
 */

interface ConsultationDetails {
  consultationType: string;
  name: string;
  email: string;
  message: string;
}

export function buildConsultWhatsAppLink(details: ConsultationDetails): string {
  const { consultationType, name, email, message } = details;

  // Phone number for Agrigence (from ContactPage: +91 9452571317)
  const phoneNumber = '919452571317';

  // Build the message text with all consultation details
  const messageText = `Hello Agrigence Team,

I would like to request a consultation.

*Consultation Type:* ${consultationType}
*Name:* ${name}
*Email:* ${email}

*Message:*
${message}

Thank you!`;

  // URL encode the message to ensure special characters are handled
  const encodedMessage = encodeURIComponent(messageText);

  // Return wa.me URL format with encoded text parameter
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
