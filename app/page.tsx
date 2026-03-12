import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";
import { FAQ } from "@/components/FAQ";
import {
  SITE_CONFIG,
  REGISTRATION_STEPS,
  REQUIREMENTS,
  IMPORTANT_REMINDERS,
  FAQS
} from "@/lib/content";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-tesda-pattern text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-24 h-24" fill="currentColor" style={{color: '#0047AB'}}>
                <circle cx="50" cy="30" r="8" />
                <path d="M50 40 L35 55 L35 70 L50 80 L65 70 L65 55 Z" />
                <circle cx="35" cy="25" r="3" />
                <circle cx="65" cy="25" r="3" />
                <path d="M25 45 L25 65 L35 70" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M75 45 L75 65 L65 70" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M20 50 L15 50 M80 50 L85 50 M50 20 L50 15 M50 80 L50 85" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Welcome, TESDA Scholar Enrollees
          </h1>
          <p className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto text-balance">
            Please complete your registration to confirm your slot and proceed with onboarding requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ButtonLink href={SITE_CONFIG.REGISTRATION_URL} variant="primary" className="bg-white text-[#0047AB] hover:bg-gray-100 shadow-2xl font-semibold">
              Proceed to Registration
            </ButtonLink>
            <ButtonLink href="#requirements" variant="secondary" className="bg-[#003380] text-white hover:bg-[#002266] border-2 border-white/30">
              View Requirements
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <Section 
        id="steps" 
        title="Registration Steps" 
        subtitle="Follow these steps to complete your enrollment process"
        className="bg-white"
      >
        <div className="space-y-6">
          {REGISTRATION_STEPS.map((step) => (
            <div 
              key={step.id} 
              className="flex gap-6 p-6 bg-white rounded-lg border-l-4 border-[#0047AB] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#0047AB] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {step.id}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Requirements Checklist */}
      <Section 
        id="requirements" 
        title="Requirements Checklist" 
        subtitle="Prepare the following documents before starting your registration"
        className="bg-white"
      >
        <div className="bg-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <ul className="space-y-4">
            {REQUIREMENTS.map((requirement, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <svg 
                    className="w-6 h-6 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg">
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Important Reminders */}
      <Section 
        id="reminders" 
        title="Important Reminders" 
        subtitle="Please read these carefully before proceeding"
        className="bg-white"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {IMPORTANT_REMINDERS.map((reminder, index) => (
            <div 
              key={index} 
              className="p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-amber-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {reminder.title}
              </h3>
              <p className="text-gray-700">
                {reminder.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section 
        id="faq" 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about the registration process"
        className="bg-white"
      >
        <FAQ items={FAQS} />
      </Section>

      {/* Footer */}
      <footer className="bg-[#003380] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-blue-200 mb-6">
              Our support team is here to assist you with your registration.
            </p>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="text-blue-200">Email:</span>{" "}
                <a 
                  href={`mailto:${SITE_CONFIG.supportEmail}`} 
                  className="text-white hover:text-blue-100 transition-colors font-semibold"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </p>
              <p className="text-lg">
                <span className="text-blue-200">Hotline:</span>{" "}
                <a 
                  href={`tel:${SITE_CONFIG.hotline}`} 
                  className="text-white hover:text-blue-100 transition-colors font-semibold"
                >
                  {SITE_CONFIG.hotline}
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Technical Education and Skills Development Authority (TESDA). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
