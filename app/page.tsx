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
    <main className="page-main">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-icon-wrap">
            <div className="hero-icon-circle">
              <svg viewBox="0 0 100 100" className="hero-icon-svg" fill="currentColor">
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
          <h1 className="hero-title">
            Welcome, TESDA Scholar Enrollees
          </h1>
          <p className="hero-subtitle">
            Please complete your registration to confirm your slot and proceed with onboarding requirements.
          </p>
          <div className="hero-actions">
            <ButtonLink href={SITE_CONFIG.REGISTRATION_URL} variant="primary" className="btn--hero-primary">
              Proceed to Registration
            </ButtonLink>
            <ButtonLink href="#requirements" variant="secondary" className="btn--hero-secondary">
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
        className="section--white"
      >
        <div className="steps-list">
          {REGISTRATION_STEPS.map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-number-wrap">
                <div className="step-number">
                  {step.id}
                </div>
              </div>
              <div>
                <h3 className="step-title">
                  {step.title}
                </h3>
                <p className="step-desc">
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
        className="section--white"
      >
        <div className="requirements-box">
          <ul className="requirements-list">
            {REQUIREMENTS.map((requirement, index) => (
              <li key={index} className="requirement-item">
                <div className="requirement-check">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="requirement-text">
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
        className="section--white"
      >
        <div className="reminders-grid">
          {IMPORTANT_REMINDERS.map((reminder, index) => (
            <div key={index} className="reminder-card">
              <h3 className="reminder-title">
                <svg className="reminder-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {reminder.title}
              </h3>
              <p className="reminder-desc">
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
        className="section--white"
      >
        <FAQ items={FAQS} />
      </Section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-heading-wrap">
            <h3 className="footer-heading">Need Help?</h3>
            <p className="footer-heading-desc">
              Our support team is here to assist you with your registration.
            </p>
            <div className="footer-links">
              <p className="footer-link-line">
                <span className="footer-link-label">Email:</span>{" "}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="footer-link">
                  {SITE_CONFIG.supportEmail}
                </a>
              </p>
              <p className="footer-link-line">
                <span className="footer-link-label">Hotline:</span>{" "}
                <a href={`tel:${SITE_CONFIG.hotline}`} className="footer-link">
                  {SITE_CONFIG.hotline}
                </a>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Technical Education and Skills Development Authority (TESDA). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
