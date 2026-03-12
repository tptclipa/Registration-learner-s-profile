export const SITE_CONFIG = {
  REGISTRATION_URL: "#register",
  supportEmail: "support@tesda.gov.ph",
  hotline: "1-800-TESDA-00"
} as const;

export const REGISTRATION_STEPS = [
  {
    id: 1,
    title: "Prepare Your Documents",
    description: "Gather all required documents listed in the requirements section below."
  },
  {
    id: 2,
    title: "Complete Online Registration Form",
    description: "Fill out the registration form accurately with your personal and educational information."
  },
  {
    id: 3,
    title: "Submit Required Documents",
    description: "Upload clear copies of all required documents through the registration portal."
  },
  {
    id: 4,
    title: "Wait for Confirmation",
    description: "You will receive a confirmation email within 3-5 business days after submission."
  },
  {
    id: 5,
    title: "Attend Orientation",
    description: "Attend the mandatory orientation session on the scheduled date provided in your confirmation."
  }
] as const;

export const REQUIREMENTS = [
  "Valid Government-issued ID (PhilSys ID, Passport, Driver's License, or Voter's ID)",
  "Birth Certificate (PSA-issued)",
  "Highest Educational Attainment (Diploma or Certificate of Completion)",
  "2x2 ID Photo (recent, white background)",
  "Proof of Residency (Barangay Certificate or Utility Bill)",
  "Medical Certificate (issued within the last 6 months)",
  "Parent/Guardian Consent Form (for applicants below 18 years old)"
] as const;

export const IMPORTANT_REMINDERS = [
  {
    title: "Registration Deadline",
    description: "All applications must be submitted before the deadline. Late submissions will not be accepted."
  },
  {
    title: "Accuracy of Information",
    description: "Ensure all information provided is accurate and matches your official documents. Discrepancies may result in disqualification."
  },
  {
    title: "Document Requirements",
    description: "All documents must be clear, legible, and in the specified format. Incomplete submissions will be returned."
  },
  {
    title: "Contact Support",
    description: `For questions or assistance, contact us at ${SITE_CONFIG.supportEmail} or call our hotline at ${SITE_CONFIG.hotline}.`
  }
] as const;

export const FAQS = [
  {
    question: "What if I don't have all the required documents?",
    answer: "You may submit your application with available documents, but your enrollment will be pending until all requirements are completed. Contact our support team for guidance on alternative documents."
  },
  {
    question: "Can I edit my application after submission?",
    answer: "Yes, you can request to edit your application by contacting our support team within 24 hours of submission. After this period, amendments may require additional processing time."
  },
  {
    question: "How long does the registration process take?",
    answer: "The entire registration process typically takes 5-7 business days from submission to confirmation. You will receive updates via email at each stage."
  },
  {
    question: "Is there a registration fee?",
    answer: "No, the TESDA scholarship program is free of charge. You will not be asked to pay any registration or processing fees."
  },
  {
    question: "What happens if I miss the orientation?",
    answer: "Orientation attendance is mandatory. If you cannot attend due to valid reasons, contact us immediately to arrange an alternative session. Unexcused absences may result in forfeiture of your slot."
  }
] as const;
