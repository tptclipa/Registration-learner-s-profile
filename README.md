# TESDA Scholar Registration Landing Page

A modern, responsive landing page for TESDA scholar enrollees to learn about and complete their registration process.

## Features

- Clean, professional design with formal English copy
- Responsive layout (mobile & desktop)
- Clear registration steps and requirements checklist
- Interactive FAQ section
- Important reminders section
- Contact information and support details

## Tech Stack

- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React 19** for UI components

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Customization

All content is centralized in `lib/content.ts` for easy customization:

- `SITE_CONFIG`: Registration URL, support email, hotline
- `REGISTRATION_STEPS`: Step-by-step registration process
- `REQUIREMENTS`: Document checklist
- `IMPORTANT_REMINDERS`: Key reminders for enrollees
- `FAQS`: Frequently asked questions

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ButtonLink.tsx      # CTA button component
│   ├── FAQ.tsx             # Accordion FAQ component
│   └── Section.tsx         # Reusable section wrapper
├── lib/
│   └── content.ts          # Centralized content configuration
└── package.json
```

## License

This project is for TESDA scholarship program use.
