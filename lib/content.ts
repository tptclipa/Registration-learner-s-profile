export const SITE_CONFIG = {
  REGISTRATION_URL: "#register",
  supportEmail: "ptclipa@tesda.gov.ph",
  hotline: "(043) 272-9646",
  phone: "0994 790 0252",
  address: "TESDA PTC - Lipa, Olan's Place, Marawoy, Lipa City, Batangas"
} as const;

export const REGISTRATION_STEPS = [
  {
    id: 1,
    title: "Prepare Your Documents",
    description: "Gather all required documents listed in the requirements section below."
  },
  {
    id: 2,
    title: "Complete and print the Registration Form",
    description: "Fill out the online registration form accurately with your personal and educational information. Print the form and bring it to the registration session."
  },
  {
    id: 3,
    title: "Submit Required Documents",
    description: "Submit the hard copies of all required documents to the registration session."
  },
  {
    id: 4,
    title: "Wait for Confirmation",
    description: "You will receive any updates about the course you enrolled in your group chat."
  },
  {
    id: 5,
    title: "Attend Orientation",
    description: "Attend the mandatory orientation session on the scheduled date provided in your group chat."
  }
] as const;

export const REQUIREMENTS = [
  "Birth Certificate (PSA-issued)",
  "Highest Educational Attainment (Diploma/Certificate of Completion, or Transcript of Records)",
  "4 pieces of Passport-size ID Photo (recent, white background, with name)",
  "4 pieces of 1x1 ID Photo (recent, white background, with name)",
  "Barangay Certificate of Residency/NBI Clearance, or Police Clearance",
  "Medical Certificate (issued within the last 6 months)",
  // "Preventive Covid-19 Certificate"
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
    title: "Printing Requirement",
    description: "The printed registration form should be on A4 size bond paper."
  },
  // {
  //   title: "Contact Support",
  //   description: `For questions or assistance, contact us at ${SITE_CONFIG.supportEmail} or call our hotline at ${SITE_CONFIG.hotline}.`
  // }
] as const;

export const FAQS = [
  {
    question: "What if I don't have all the required documents?",
    answer: "You may submit your application with available documents, but your enrollment will be pending until all requirements are completed. Contact our support team for guidance on alternative documents."
  },
  {
    question: "Can I edit my application after submission?",
    answer: "Yes, this registration portal is not recorded in our enrollment system. You can generate and print a new registration form anytime you want before submitting it to the registration session."
  },
  {
    question: "How long does the registration process take?",
    answer: "The entire registration process typically takes 40 minutes to 1 hour to complete."
  },
  {
    question: "Is there a registration fee?",
    answer: "No, the TESDA scholarship program is free of charge. You will not be asked to pay any registration or processing fees."
  },
  {
    question: "What happens if I miss the orientation?",
    answer: "Attendance at orientation is required. Because it is part of your training hours, missing it (even for valid reasons) results in an absence. Please be aware that too many absences will result in being dropped from the course."
  }
] as const;
