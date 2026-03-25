"use client";

import { useState, Fragment } from "react";

type FormData = {
  last_name: string;
  extension_name: string;
  first_name: string;
  middle_name: string;
  number_street: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  district: string;
  email: string;
  contact_num: string;
  nationality: string;
  // step 3 — sex & civil status (dropdowns; transformed to booleans for docx)
  sex: string;
  civil_status: string;
  // step 3 — employment status checkboxes
  emp1: boolean;
  emp2: boolean;
  emp3: boolean;
  emp4: boolean;
  // step 3 — employment type checkboxes (enabled only when emp1 or emp2 is checked)
  empt1: boolean;
  empt2: boolean;
  empt3: boolean;
  empt4: boolean;
  empt5: boolean;
  empt6: boolean;
  empt7: boolean;
  empt8: boolean;
};

const initialFormData: FormData = {
  last_name: "",
  extension_name: "",
  first_name: "",
  middle_name: "",
  number_street: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  district: "",
  email: "",
  contact_num: "",
  nationality: "",
  sex: "",
  civil_status: "",
  emp1: false,
  emp2: false,
  emp3: false,
  emp4: false,
  empt1: false,
  empt2: false,
  empt3: false,
  empt4: false,
  empt5: false,
  empt6: false,
  empt7: false,
  empt8: false,
};

type StepperProps = {
  totalSteps?: number;
  currentStep: number;
};

function Stepper({ totalSteps = 10, currentStep }: StepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progressPct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="stepper-wrap">
      <div className="stepper">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <Fragment key={step}>
              {index !== 0 && (
                <div
                  className={[
                    "stepper-connector",
                    isCompleted ? "stepper-connector--completed" : "",
                  ].join(" ")}
                />
              )}
              <div
                className={[
                  "stepper-item",
                  isCompleted ? "stepper-item--completed" : "",
                  isActive ? "stepper-item--active" : "",
                ].join(" ")}
                aria-label={`Step ${step}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
              >
                {isCompleted ? (
                  <svg
                    className="stepper-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="stepper-number">{step}</span>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="stepper-progress-track">
        <div
          className="stepper-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

type StepContentProps = {
  step: number;
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

function StepContent({ step, formData, onChange }: StepContentProps) {
  if (step === 3) {
    const isWageOrUnder = formData.emp1 || formData.emp2;

    const employmentStatusOptions = [
      { name: "emp1", label: "Wage-Employed" },
      { name: "emp2", label: "Underemployed" },
      { name: "emp3", label: "Self Employed" },
      { name: "emp4", label: "Unemployed" },
    ] as const;

    const employmentTypeOptions = [
      { name: "empt1", label: "None" },
      { name: "empt2", label: "Casual" },
      { name: "empt3", label: "Probationary" },
      { name: "empt4", label: "Contractual" },
      { name: "empt5", label: "Regular" },
      { name: "empt6", label: "Job Order" },
      { name: "empt7", label: "Permanent" },
      { name: "empt8", label: "Temporary" },
    ] as const;

    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Sex</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="sex">
              Sex
            </label>
            <select
              className="form-select"
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={onChange}
            >
              <option value="" disabled>
                Select sex
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Civil Status</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="civil_status">
              Civil Status
            </label>
            <select
              className="form-select"
              id="civil_status"
              name="civil_status"
              value={formData.civil_status}
              onChange={onChange}
            >
              <option value="" disabled>
                Select civil status
              </option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="separated">Separated / Divorced / Annulled</option>
              <option value="widow">Widow/er</option>
              <option value="livein">Common Law / Live in</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Employment (before training)</h2>

          <div className="form-field">
            <span className="form-label">Employment Status</span>
            <div className="form-checkbox-group">
              {employmentStatusOptions.map(({ name, label }) => (
                <label key={name} className="form-checkbox-item">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    name={name}
                    checked={formData[name] as boolean}
                    onChange={onChange}
                  />
                  <span className="form-checkbox-label">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`form-field${!isWageOrUnder ? " form-field--disabled" : ""}`}>
            <span className="form-label">
              Employment Type
              {!isWageOrUnder && (
                <span className="form-label-hint">
                  {" "}— select Wage-Employed or Underemployed above to enable
                </span>
              )}
            </span>
            <div className="form-checkbox-group">
              {employmentTypeOptions.map(({ name, label }) => (
                <label
                  key={name}
                  className={`form-checkbox-item${!isWageOrUnder ? " form-checkbox-item--disabled" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    name={name}
                    checked={formData[name] as boolean}
                    onChange={onChange}
                    disabled={!isWageOrUnder}
                  />
                  <span className="form-checkbox-label">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Name</h2>

          <div className="form-field-row">
            <div className="form-field form-field--grow">
              <label className="form-label" htmlFor="last_name">
                Last Name
              </label>
              <input
                className="form-input"
                type="text"
                id="last_name"
                name="last_name"
                placeholder="{last_name}"
                value={formData.last_name}
                onChange={onChange}
              />
            </div>
            <div className="form-field form-field--shrink">
              <label className="form-label" htmlFor="extension_name">
                Extension Name
              </label>
              <input
                className="form-input"
                type="text"
                id="extension_name"
                name="extension_name"
                placeholder="{extension_name}"
                value={formData.extension_name}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-input"
              type="text"
              id="first_name"
              name="first_name"
              placeholder="{first_name}"
              value={formData.first_name}
              onChange={onChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="middle_name">
              Middle Name
            </label>
            <input
              className="form-input"
              type="text"
              id="middle_name"
              name="middle_name"
              placeholder="{middle_name}"
              value={formData.middle_name}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Complete Permanent Mailing Address</h2>

          <div className="form-field">
            <label className="form-label" htmlFor="number_street">
              Number, Street
            </label>
            <input
              className="form-input"
              type="text"
              id="number_street"
              name="number_street"
              placeholder="{number_street}"
              value={formData.number_street}
              onChange={onChange}
            />
          </div>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-label" htmlFor="region">
                Region
              </label>
              <select
                className="form-select"
                id="region"
                name="region"
                value={formData.region}
                onChange={onChange}
              >
                <option value="" disabled>Select region</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="province">
                Province
              </label>
              <select
                className="form-select"
                id="province"
                name="province"
                value={formData.province}
                onChange={onChange}
              >
                <option value="" disabled>Select province</option>
              </select>
            </div>
          </div>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-label" htmlFor="city">
                City / Municipality
              </label>
              <select
                className="form-select"
                id="city"
                name="city"
                value={formData.city}
                onChange={onChange}
              >
                <option value="" disabled>Select city/municipality</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="barangay">
                Barangay
              </label>
              <input
                className="form-input"
                type="text"
                id="barangay"
                name="barangay"
                placeholder="{barangay}"
                value={formData.barangay}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="district">
              District
            </label>
            <input
              className="form-input"
              type="text"
              id="district"
              name="district"
              placeholder="{district}"
              value={formData.district}
              onChange={onChange}
            />
          </div>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Active Email Address
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="{email}"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="contact_num">
                Contact No.
              </label>
              <input
                className="form-input"
                type="tel"
                id="contact_num"
                name="contact_num"
                placeholder="{contact_num}"
                value={formData.contact_num}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="nationality">
              Nationality
            </label>
            <select
              className="form-select"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={onChange}
            >
              <option value="" disabled>Select nationality</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className="form-step-placeholder">
      This is where your form fields for step {step} will go. You can replace
      this section with your actual registration content per step.
    </p>
  );
}

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 10;

  const progressPct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const chk = (val: boolean) => (val ? "☑" : "");
      const docxPayload = {
        ...formData,
        // sex → checkmark placeholders for docx template
        male: chk(formData.sex === "male"),
        Female: chk(formData.sex === "female"),
        // civil_status → checkmark placeholders for docx template
        single: chk(formData.civil_status === "single"),
        married: chk(formData.civil_status === "married"),
        separated: chk(formData.civil_status === "separated"),
        widow: chk(formData.civil_status === "widow"),
        livein: chk(formData.civil_status === "livein"),
        // employment status checkboxes
        emp1: chk(formData.emp1),
        emp2: chk(formData.emp2),
        emp3: chk(formData.emp3),
        emp4: chk(formData.emp4),
        // employment type checkboxes
        empt1: chk(formData.empt1),
        empt2: chk(formData.empt2),
        empt3: chk(formData.empt3),
        empt4: chk(formData.empt4),
        empt5: chk(formData.empt5),
        empt6: chk(formData.empt6),
        empt7: chk(formData.empt7),
        empt8: chk(formData.empt8),
      };
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docxPayload),
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => null)) as {
          error?: string;
          details?: string;
        } | null;
        const msg = [errJson?.error, errJson?.details].filter(Boolean).join(": ");
        throw new Error(msg || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Learners-Profile-Filled.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Please try again.";
      alert(`Something went wrong generating the document.\n\n${message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page-main form-page">
      <section className="form-section">
        <div className="form-section-inner">
          <header className="form-header">
            <h1 className="form-title">TESDA Scholar Registration</h1>
            <p className="form-subtitle">
              Step {currentStep} of {totalSteps}
              <span className="form-subtitle-progress">
                {" "}— {progressPct}% complete
              </span>
            </p>
          </header>

          <div className="form-stepper-wrap">
            <Stepper currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div className="form-body">
            <StepContent
              step={currentStep}
              formData={formData}
              onChange={handleChange}
            />
          </div>

          <footer className="form-footer">
            <button
              type="button"
              onClick={goPrev}
              className="btn btn--secondary"
              disabled={currentStep === 1}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={goNext}
                className="btn btn--primary"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="btn btn--primary"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating…" : "Generate Document"}
              </button>
            )}
          </footer>
        </div>
      </section>
    </main>
  );
}
