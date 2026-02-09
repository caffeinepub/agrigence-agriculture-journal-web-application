/**
 * Generates a properly URL-encoded mailto link for expert consultation requests.
 * Supports both static template (backward compatible) and dynamic consultation details.
 * Ensures all consultation details are properly URL-encoded and included in subject/body.
 */

interface ConsultationDetails {
  consultationType: string;
  name: string;
  email: string;
  message: string;
}

/**
 * Legacy function for backward compatibility - generates a static mailto template
 */
export function getConsultExpertMailto(): string {
  const recipient = 'agrigence@gmail.com';
  const subject = 'Request for Expert Consultation';
  const body = `Dear Agrigence Team,

I would like to request a consultation with an expert regarding:

[Please describe your inquiry or topic here]

Best regards,
[Your Name]`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Builds a mailto link with dynamic consultation details
 * All fields are URL-encoded to ensure proper handling of special characters
 */
export function buildConsultExpertMailto(details: ConsultationDetails): string {
  const { consultationType, name, email, message } = details;
  const recipient = 'agrigence@gmail.com';
  
  // Subject includes consultation type
  const subject = `Consultation Request - ${consultationType}`;
  
  // Body includes all consultation details
  const body = `Dear Agrigence Team,

I would like to request a consultation with an expert.

Consultation Type: ${consultationType}
Name: ${name}
Email: ${email}

Message:
${message}

Best regards,
${name}`;

  // URL encode both subject and body to handle special characters
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // Return properly formatted mailto URL
  return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
}
