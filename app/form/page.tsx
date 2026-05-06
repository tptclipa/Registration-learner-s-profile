"use client";

import { useState, useEffect, Fragment } from "react";

type PsgcItem = { code: string; name: string };
type PsgcCityItem = PsgcItem & { district?: string };

/** Batangas provincial legislative districts (PSGC city/municipality code → ordinal). Source: user-provided grouping vs PSA PSGC `district` field. */
const BATANGAS_LGU_DISTRICT: Record<string, string> = {
  // 1st — Balayan, Calaca, Calatagan, Lemery, Lian, Nasugbu, Taal, Tuy
  "0401003000": "1st",
  "0401007000": "1st",
  "0401008000": "1st",
  "0401012000": "1st",
  "0401013000": "1st",
  "0401019000": "1st",
  "0401029000": "1st",
  "0401034000": "1st",
  // 2nd — Bauan, Lobo, Mabini, San Luis, San Pascual, Tingloy
  "0401006000": "2nd",
  "0401015000": "2nd",
  "0401016000": "2nd",
  "0401024000": "2nd",
  "0401026000": "2nd",
  "0401033000": "2nd",
  // 3rd — Agoncillo, Alitagtag, Balete, Cuenca, Laurel, Malvar, Mataasnakahoy, San Nicolas, Sta. Teresita, Sto. Tomas, Talisay, Tanauan
  "0401001000": "3rd",
  "0401002000": "3rd",
  "0401004000": "3rd",
  "0401009000": "3rd",
  "0401011000": "3rd",
  "0401017000": "3rd",
  "0401018000": "3rd",
  "0401025000": "3rd",
  "0401027000": "3rd",
  "0401028000": "3rd",
  "0401030000": "3rd",
  "0401031000": "3rd",
  // 4th — Ibaan, Padre Garcia, Rosario, San Jose, San Juan, Taysan
  "0401010000": "4th",
  "0401020000": "4th",
  "0401021000": "4th",
  "0401022000": "4th",
  "0401023000": "4th",
  "0401032000": "4th",
  // 5th — Batangas City
  "0401005000": "5th",
  // 6th — Lipa City
  "0401014000": "6th",
};

function districtForLgu(cityCode: string, psgcDistrict?: string): string {
  return BATANGAS_LGU_DISTRICT[cityCode] ?? psgcDistrict ?? "";
}

function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

function parseBirthParts(yStr: string, mStr: string, dStr: string): {
  y: number;
  m: number;
  d: number;
} | null {
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  if (!yStr || !mStr || !dStr || Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
    return null;
  }
  if (m < 1 || m > 12 || d < 1) return null;
  const maxD = daysInMonth(y, m);
  if (d > maxD) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return { y, m, d };
}

/** Completed years as of local "today"; empty string if incomplete or invalid or future date. */
function computeAgeString(month_bday: string, day_bday: string, year_bday: string): string {
  const parts = parseBirthParts(year_bday, month_bday, day_bday);
  if (!parts) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(parts.y, parts.m - 1, parts.d);
  if (birth > today) return "";
  let age = today.getFullYear() - birth.getFullYear();
  const td = today.getDate();
  const tm = today.getMonth();
  const bd = birth.getDate();
  const bm = birth.getMonth();
  if (tm < bm || (tm === bm && td < bd)) age--;
  return age >= 0 ? String(age) : "";
}

function formatDateNowMMDDYYYY(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

const EDUCATIONAL_ATTAINMENT_OPTIONS = [
  { value: "educ1", label: "No Grade Completed" },
  { value: "educ2", label: "Elementary Undergraduate" },
  { value: "educ3", label: "Elementary Graduate" },
  { value: "educ4", label: "High School Undergraduate" },
  { value: "educ5", label: "High School Graduate" },
  { value: "educ6", label: "Junior High (K-12)" },
  { value: "educ7", label: "Senior High (K-12)" },
  {
    value: "educ8",
    label:
      "Post Secondary Non-Tertiary/ Technical-Vocational Course Undergraduate",
  },
  {
    value: "educ9",
    label:
      "Post Secondary Non-Tertiary/ Technical-Vocational Course Graduate",
  },
  { value: "educ10", label: "College Undergraduate" },
  { value: "educ11", label: "College Graduate" },
  { value: "educ12", label: "Masteral" },
  { value: "educ13", label: "Doctorate" },
] as const;

const COURSE_OPTIONS = [
  {
    sector: "Tourism (Hotel and Restaurant)",
    qualifications: [
      "Bread and Pastry Production NC II",
      "Cookery NC II",
      "Food and Beverage Services NC II",
    ],
  },
  {
    sector: "Electrical and Electronics",
    qualifications: [
      "Computer Systems Servicing NC II",
      "Electronic Products Assembly and Servicing NC II",
      "Electrical Installation and Maintenance NC II",
      "Electrical Installation and Maintenance NC III",
    ],
  },
  {
    sector: "Automotive and Land Transportation",
    qualifications: [
      "Driving NC II",
      "Automotive Servicing NC I",
      "Motorcycle/Small Engine Servicing NC II",
    ],
  },
  {
    sector: "Construction",
    qualifications: [
      "Masonry NC I",
      "Carpentry NC II",
      "Plumbing NC I",
      "Plumbing NC II",
    ],
  },
  {
    sector: "Metals and Engineering",
    qualifications: [
      "Shielded Metal Arc Welding (SMAW) NC I",
      "Shielded Metal Arc Welding (SMAW) NC II",
      "Shielded Metal Arc Welding (SMAW) NC III",
    ],
  },
  {
    sector: "Agriculture, Forestry and Fishery",
    qualifications: [
      "Agricultural Crops Production NC II",
      "Organic Agriculture Production NC II",
    ],
  },
  {
    sector: "Garments",
    qualifications: ["Dressmaking NC II"],
  },
  {
    sector: "HVAC and Refrigeration",
    qualifications: ["RAC Servicing (DOMRAC) NC II"],
  },
  {
    sector: "TVET",
    qualifications: ["Trainers Methodology Level NC I"],
  },
  {
    sector: "Social, Community Development and Other Services",
    qualifications: ["Bookkeeping NC III"],
  },
] as const;

/** PSGC proxy returns a JSON array on success; on error it may return `{ error: string }`. */
function sortPsgcList<T extends PsgcItem>(data: unknown): T[] {
  if (!Array.isArray(data)) {
    if (data && typeof data === "object" && "error" in data) {
      console.warn("[psgc]", (data as { error?: string }).error ?? data);
    }
    return [];
  }
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
}

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
  employment_status: "" | "emp1" | "emp2" | "emp3" | "emp4";
  // step 3 — employment type (enabled only when emp1 or emp2 is selected)
  employment_type:
    | ""
    | "empt1"
    | "empt2"
    | "empt3"
    | "empt4"
    | "empt5"
    | "empt6"
    | "empt7"
    | "empt8";
  /** Birthdate parts — docx: {month_bday}, {day_bday}, {year_bday}; age derived as {age} */
  month_bday: string;
  day_bday: string;
  year_bday: string;
  /** Place of birth — PSGC codes; docx resolves to place names {city_birth}, {province_birth}, {region_birth} */
  region_birth: string;
  province_birth: string;
  city_birth: string;
  /** Step 3 — single-select; exported as {educ1}..{educ13} checkmarks */
  educational_attainment: string;
  /** Step 3 — parent/guardian info */
  name_parent: string;
  address_parent: string;
  // Step 4 — beneficiary classification (independent checkboxes)
  "4ps": boolean;
  displaced_worker: boolean;
  afp_pnp: boolean;
  industry_worker: boolean;
  outofschoolyouth: boolean;
  rebel: boolean;
  tesda_alumni: boolean;
  victim: boolean;
  reform: boolean;
  drug: boolean;
  farmer: boolean;
  inmate: boolean;
  ofw_dependent: boolean;
  ofw_returning: boolean;
  tvet: boolean;
  wounded: boolean;
  balik_probinsya: boolean;
  afp_pnp_killed: boolean;
  indigenous: boolean;
  milf: boolean;
  rcef: boolean;
  student: boolean;
  personnel: boolean;
  others: boolean;
  /** Free-text "Please specify" for Others — shown only when `others` is true */
  classification: string;
  // Step 5 — Type of Disability (independent checkboxes; for Persons with Disability Only)
  dis1: boolean;
  dis2: boolean;
  dis3: boolean;
  dis4: boolean;
  dis5: boolean;
  dis6: boolean;
  dis7: boolean;
  dis8: boolean;
  dis9: boolean;
  // Step 6 — Causes of Disability (independent checkboxes; for Persons with Disability Only)
  cause1: boolean;
  cause2: boolean;
  cause3: boolean;
  // Step 7 — Name of Course/Qualification (single-select dropdown; sent to docx as {course})
  course: string;
  /** Free-text specify when `course === "other"`; replaces {course} in docx output */
  course_other: string;
  // Step 8 — Scholarship Package (single-select dropdown; sent to docx as {type_isko})
  type_isko: string;
  /** Free-text specify when `type_isko === "other"`; replaces {type_isko} in docx output */
  type_isko_other: string;
  // Step 9 — Privacy Consent and Disclaimer (single-select; exported as {consent_agree}/{consent_disagree})
  consent: "" | "agree" | "disagree";
};

const initialFormData: FormData = {
  last_name: "",
  extension_name: " ",
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
  employment_status: "",
  employment_type: "",
  month_bday: "",
  day_bday: "",
  year_bday: "",
  region_birth: "",
  province_birth: "",
  city_birth: "",
  educational_attainment: "",
  name_parent: "",
  address_parent: "",
  "4ps": false,
  displaced_worker: false,
  afp_pnp: false,
  industry_worker: false,
  outofschoolyouth: false,
  rebel: false,
  tesda_alumni: false,
  victim: false,
  reform: false,
  drug: false,
  farmer: false,
  inmate: false,
  ofw_dependent: false,
  ofw_returning: false,
  tvet: false,
  wounded: false,
  balik_probinsya: false,
  afp_pnp_killed: false,
  indigenous: false,
  milf: false,
  rcef: false,
  student: false,
  personnel: false,
  others: false,
  classification: "",
  dis1: false,
  dis2: false,
  dis3: false,
  dis4: false,
  dis5: false,
  dis6: false,
  dis7: false,
  dis8: false,
  dis9: false,
  cause1: false,
  cause2: false,
  cause3: false,
  course: "",
  course_other: "",
  type_isko: "",
  type_isko_other: "",
  consent: "",
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

type AddressLists = {
  regions: PsgcItem[];
  provinces: PsgcItem[];
  cities: PsgcCityItem[];
  barangays: PsgcItem[];
  loadingProvinces: boolean;
  loadingCities: boolean;
  loadingBarangays: boolean;
  birthProvinces: PsgcItem[];
  birthCities: PsgcCityItem[];
  loadingBirthProvinces: boolean;
  loadingBirthCities: boolean;
};

type StepContentProps = {
  step: number;
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addressLists: AddressLists;
};

function StepContent({ step, formData, onChange, addressLists }: StepContentProps) {
  const {
    regions,
    provinces,
    cities,
    barangays,
    loadingProvinces,
    loadingCities,
    loadingBarangays,
    birthProvinces,
    birthCities,
    loadingBirthProvinces,
    loadingBirthCities,
  } = addressLists;
  const isNCR = formData.region === "1300000000";
  if (step === 3) {
    const isNCRBirth = formData.region_birth === "1300000000";
    const yNum = parseInt(formData.year_bday, 10);
    const mNum = parseInt(formData.month_bday, 10);
    const maxDay =
      formData.year_bday && formData.month_bday && !Number.isNaN(yNum) && !Number.isNaN(mNum)
        ? daysInMonth(yNum, mNum)
        : 31;
    const dayOptions = Array.from({ length: maxDay }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
    const birthAgeDisplay = computeAgeString(
      formData.month_bday,
      formData.day_bday,
      formData.year_bday
    );
    const currentYear = new Date().getFullYear();
    const yearOptions: string[] = [];
    for (let y = currentYear; y >= currentYear - 100; y--) {
      yearOptions.push(String(y));
    }

    const isWageOrUnder =
      formData.employment_status === "emp1" || formData.employment_status === "emp2";

    const employmentStatusOptions = [
      { value: "emp1", label: "Wage-Employed" },
      { value: "emp2", label: "Underemployed" },
      { value: "emp3", label: "Self Employed" },
      { value: "emp4", label: "Unemployed" },
    ] as const;

    const employmentTypeOptions = [
      { value: "empt1", label: "None" },
      { value: "empt2", label: "Casual" },
      { value: "empt3", label: "Probationary" },
      { value: "empt4", label: "Contractual" },
      { value: "empt5", label: "Regular" },
      { value: "empt6", label: "Job Order" },
      { value: "empt7", label: "Permanent" },
      { value: "empt8", label: "Temporary" },
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
              {employmentStatusOptions.map(({ value, label }) => (
                <label key={value} className="form-checkbox-item">
                  <input
                    type="radio"
                    className="form-checkbox"
                    name="employment_status"
                    value={value}
                    checked={formData.employment_status === value}
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
              {employmentTypeOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`form-checkbox-item${!isWageOrUnder ? " form-checkbox-item--disabled" : ""}`}
                >
                  <input
                    type="radio"
                    className="form-checkbox"
                    name="employment_type"
                    value={value}
                    checked={formData.employment_type === value}
                    onChange={onChange}
                    disabled={!isWageOrUnder}
                  />
                  <span className="form-checkbox-label">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Birthdate</h2>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-label" htmlFor="month_bday">
                Month of Birth
              </label>
              <select
                className="form-select"
                id="month_bday"
                name="month_bday"
                value={formData.month_bday}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select month
                </option>
                {MONTH_OPTIONS.map((mo) => (
                  <option key={mo.value} value={mo.value}>
                    {mo.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="day_bday">
                Date of Birth
              </label>
              <select
                className="form-select"
                id="day_bday"
                name="day_bday"
                value={formData.day_bday}
                onChange={onChange}
                disabled={!formData.month_bday || !formData.year_bday}
              >
                <option value="" disabled>
                  Select day
                </option>
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {parseInt(d, 10)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="year_bday">
                Year of Birth
              </label>
              <select
                className="form-select"
                id="year_bday"
                name="year_bday"
                value={formData.year_bday}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select year
                </option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="age_display">
              Age
            </label>
            <input
              className="form-input"
              type="text"
              id="age_display"
              readOnly
              value={birthAgeDisplay}
              placeholder="—"
              aria-live="polite"
            />
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Birthplace</h2>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-label" htmlFor="region_birth">
                Region
              </label>
              <select
                className="form-select"
                id="region_birth"
                name="region_birth"
                value={formData.region_birth}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select region
                </option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="province_birth">
                Province
              </label>
              <select
                className="form-select"
                id="province_birth"
                name="province_birth"
                value={formData.province_birth}
                onChange={onChange}
                disabled={!formData.region_birth || isNCRBirth || loadingBirthProvinces}
              >
                <option value="" disabled>
                  {loadingBirthProvinces
                    ? "Loading…"
                    : isNCRBirth
                      ? "N/A (NCR)"
                      : "Select province"}
                </option>
                {birthProvinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="city_birth">
              City / Municipality
            </label>
            <select
              className="form-select"
              id="city_birth"
              name="city_birth"
              value={formData.city_birth}
              onChange={onChange}
              disabled={
                (!formData.province_birth && !isNCRBirth) ||
                (isNCRBirth && !formData.region_birth) ||
                loadingBirthCities
              }
            >
              <option value="" disabled>
                {loadingBirthCities ? "Loading…" : "Select city/municipality"}
              </option>
              {birthCities.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Educational Attainment Before Training (Trainee)</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="educational_attainment">
              Educational Attainment
            </label>
            <select
              className="form-select"
              id="educational_attainment"
              name="educational_attainment"
              value={formData.educational_attainment}
              onChange={onChange}
            >
              <option value="" disabled>
                Select educational attainment
              </option>
              {EDUCATIONAL_ATTAINMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <h2 className="form-group-title">Parent/Guardian</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="name_parent">
              Name
            </label>
            <input
              className="form-input"
              type="text"
              id="name_parent"
              name="name_parent"
              placeholder="{name_parent}"
              value={formData.name_parent}
              onChange={onChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="address_parent">
              Complete Permanent Mailing Address
            </label>
            <input
              className="form-input"
              type="text"
              id="address_parent"
              name="address_parent"
              placeholder="{address_parent}"
              value={formData.address_parent}
              onChange={onChange}
            />
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
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
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
                disabled={!formData.region || isNCR || loadingProvinces}
              >
                <option value="" disabled>
                  {loadingProvinces ? "Loading…" : isNCR ? "N/A (NCR)" : "Select province"}
                </option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
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
                disabled={
                  (!formData.province && !isNCR) ||
                  (isNCR && !formData.region) ||
                  loadingCities
                }
              >
                <option value="" disabled>
                  {loadingCities ? "Loading…" : "Select city/municipality"}
                </option>
                {cities.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="barangay">
                Barangay
              </label>
              <select
                className="form-select"
                id="barangay"
                name="barangay"
                value={formData.barangay}
                onChange={onChange}
                disabled={!formData.city || loadingBarangays}
              >
                <option value="" disabled>
                  {loadingBarangays ? "Loading…" : "Select barangay"}
                </option>
                {barangays.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
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
            <input
              className="form-input"
              type="text"
              id="nationality"
              name="nationality"
              placeholder="{nationality}"
              value={formData.nationality}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    const beneficiaryOptions: { name: keyof FormData; label: string }[] = [
      { name: "4ps",            label: "4Ps Beneficiary" },
      { name: "displaced_worker", label: "Displaced Workers" },
      { name: "afp_pnp",        label: "Family Members of AFP and PNP Wounded-in-Action" },
      { name: "industry_worker", label: "Industry Workers" },
      { name: "outofschoolyouth", label: "Out-of-School Youth" },
      { name: "rebel",          label: "Rebel Returnees / Decommissioned Combatants" },
      { name: "tesda_alumni",   label: "TESDA Alumni" },
      { name: "victim",         label: "Victim of Natural Disasters and Calamities" },
      { name: "reform",         label: "Agrarian Reform Beneficiary" },
      { name: "drug",           label: "Drug Dependents Surrenderees / Surrenderers" },
      { name: "farmer",         label: "Farmers / Fishermen" },
      { name: "inmate",         label: "Inmates and Detainees" },
      { name: "ofw_dependent",  label: "Overseas Filipino Workers Dependent" },
      { name: "ofw_returning",  label: "Returning / Repatriated Overseas Filipino Workers" },
      { name: "tvet",           label: "TVET Trainers" },
      { name: "wounded",        label: "Wounded-in-Action AFP & PNP Personnel" },
      { name: "balik_probinsya", label: "Balik Probinsya" },
      { name: "afp_pnp_killed", label: "Family Members of AFP and PNP Killed-in-Action" },
      { name: "indigenous",     label: "Indigenous People & Cultural Communities" },
      { name: "milf",           label: "MILF Beneficiary" },
      { name: "rcef",           label: "RCEF-RESP" },
      { name: "student",        label: "Student" },
      { name: "personnel",      label: "Uniformed Personnel" },
      { name: "others",         label: "Others" },
    ];

    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Beneficiary Classification</h2>
          <div className="form-field">
            <span className="form-label">Select all that apply</span>
            <div className="form-checkbox-grid">
              {beneficiaryOptions.map(({ name, label }) => (
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

          {formData.others && (
            <div className="form-field">
              <label className="form-label" htmlFor="classification">
                Please Specify
              </label>
              <input
                className="form-input"
                type="text"
                id="classification"
                name="classification"
                placeholder="{classification}"
                value={formData.classification}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 5) {
    const disabilityOptions: { name: keyof FormData; label: string }[] = [
      { name: "dis1", label: "Mental/Intellectual" },
      { name: "dis2", label: "Hearing Disability" },
      { name: "dis3", label: "Psychosocial Disability" },
      { name: "dis4", label: "Visual Disability" },
      { name: "dis5", label: "Speech Impairment" },
      { name: "dis6", label: "Disability Due to Chronic Illness" },
      { name: "dis7", label: "Orthopedic (Musculoskeletal) Disability" },
      { name: "dis8", label: "Multiple Disabilities, specify" },
      { name: "dis9", label: "Learning Disability" },
    ];

    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Type of Disability</h2>
          <div className="form-field">
            <span className="form-label">
              For Persons with Disability Only — select all that apply.
            </span>
            <div className="form-checkbox-grid">
              {disabilityOptions.map(({ name, label }) => (
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
        </div>
      </div>
    );
  }

  if (step === 6) {
    const causeOptions: { name: keyof FormData; label: string }[] = [
      { name: "cause1", label: "Congenital/Inborn" },
      { name: "cause2", label: "Illness" },
      { name: "cause3", label: "Injury" },
    ];

    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Causes of Disability</h2>
          <div className="form-field">
            <span className="form-label">
              For Persons with Disability Only — select all that apply.
            </span>
            <div className="form-checkbox-grid">
              {causeOptions.map(({ name, label }) => (
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
        </div>
      </div>
    );
  }

  if (step === 7) {
    const isOtherCourse = formData.course === "other";
    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Name of Course/Qualification</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="course">
              Course / Qualification
            </label>
            <select
              className="form-select"
              id="course"
              name="course"
              value={formData.course}
              onChange={onChange}
            >
              <option value="" disabled>
                Select course/qualification
              </option>
              {COURSE_OPTIONS.map((group) => (
                <optgroup key={group.sector} label={group.sector}>
                  {group.qualifications.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="other">Other (please specify)</option>
            </select>
          </div>

          {isOtherCourse && (
            <div className="form-field">
              <label className="form-label" htmlFor="course_other">
                Please Specify
              </label>
              <input
                className="form-input"
                type="text"
                id="course_other"
                name="course_other"
                placeholder="{course}"
                value={formData.course_other}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 8) {
    const isOtherIsko = formData.type_isko === "other";
    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Scholarship Package</h2>
          <div className="form-field">
            <label className="form-label" htmlFor="type_isko">
              If Scholar — select the scholarship package
            </label>
            <select
              className="form-select"
              id="type_isko"
              name="type_isko"
              value={formData.type_isko}
              onChange={onChange}
            >
              <option value="" disabled>
                Select scholarship package
              </option>
              <option value="TWSP">TWSP</option>
              <option value="PESFA">PESFA</option>
              <option value="STEP">STEP</option>
              <option value="other">Other (please specify)</option>
            </select>
          </div>

          {isOtherIsko && (
            <div className="form-field">
              <label className="form-label" htmlFor="type_isko_other">
                Please Specify
              </label>
              <input
                className="form-input"
                type="text"
                id="type_isko_other"
                name="type_isko_other"
                placeholder="{type_isko}"
                value={formData.type_isko_other}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 9) {
    const consentOptions = [
      { value: "agree", label: "I Agree" },
      { value: "disagree", label: "I Disagree" },
    ] as const;

    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Privacy Consent and Disclaimer</h2>

          <div className="form-field">
            <p className="form-step-placeholder">
              <em>
                I hereby attest that I have read and understood the Privacy
                Notice of TESDA through its website (
                <a
                  href="https://www.tesda.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.tesda.gov.ph
                </a>
                ) and thereby giving my consent in the processing of my personal
                information indicated in this Learners Profile. The processing
                includes scholarships, employment, survey, and all other related
                TESDA programs that may be beneficial to my qualifications.
              </em>
            </p>
          </div>

          <div className="form-field">
            <span className="form-label">Consent</span>
            <div className="form-checkbox-group">
              {consentOptions.map(({ value, label }) => (
                <label key={value} className="form-checkbox-item">
                  <input
                    type="radio"
                    className="form-checkbox"
                    name="consent"
                    value={value}
                    checked={formData.consent === value}
                    onChange={onChange}
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

  if (step === 10) {
    return (
      <div className="step-form">
        <div className="form-group">
          <h2 className="form-group-title">Print and Sign</h2>

          <div className="form-field">
            <p className="form-step-placeholder">
              You&apos;re ready to generate your Learners Profile.
            </p>
          </div>

          <div className="form-field">
            <ol className="form-step-placeholder" style={{ paddingLeft: "1.25rem", lineHeight: 1.6 }}>
              <li>
                Click <strong>Generate Document</strong> below to download your
                Learners Profile (.docx).
              </li>
              <li>Print the document on A4 size bond paper.</li>
              <li>
                <strong>Sign your name over the printed name</strong> in the
                &ldquo;Applicant&apos;s Signature&rdquo; section, and place
                your right thumbmark in the box provided.
              </li>
              <li>
                Submit the signed printout, together with the requirements
                listed on the home page, during your registration session.
              </li>
            </ol>
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
  const totalSteps = 10
  // PSGC address lists
  const [regions, setRegions] = useState<PsgcItem[]>([]);
  const [provinces, setProvinces] = useState<PsgcItem[]>([]);
  const [cities, setCities] = useState<PsgcCityItem[]>([]);
  const [barangays, setBarangays] = useState<PsgcItem[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [birthProvinces, setBirthProvinces] = useState<PsgcItem[]>([]);
  const [birthCities, setBirthCities] = useState<PsgcCityItem[]>([]);
  const [loadingBirthProvinces, setLoadingBirthProvinces] = useState(false);
  const [loadingBirthCities, setLoadingBirthCities] = useState(false);

  const NCR_CODE = "1300000000";

  // Fetch regions once on mount
  useEffect(() => {
    fetch("/api/psgc/regions")
      .then((r) => r.json())
      .then((data: unknown) => setRegions(sortPsgcList<PsgcItem>(data)))
      .catch(console.error);
  }, []);

  // Fetch provinces when region changes
  useEffect(() => {
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setFormData((prev) => ({ ...prev, province: "", city: "", barangay: "" }));

    if (!formData.region) return;

    // NCR has no provinces — go straight to cities
    if (formData.region === NCR_CODE) {
      setLoadingCities(true);
      fetch(`/api/psgc/cities?regionCode=${formData.region}`)
        .then((r) => r.json())
        .then((data: unknown) => setCities(sortPsgcList<PsgcCityItem>(data)))
        .catch(console.error)
        .finally(() => setLoadingCities(false));
      return;
    }

    setLoadingProvinces(true);
    fetch(`/api/psgc/provinces?regionCode=${formData.region}`)
      .then((r) => r.json())
      .then((data: unknown) => setProvinces(sortPsgcList<PsgcItem>(data)))
      .catch(console.error)
      .finally(() => setLoadingProvinces(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.region]);

  // Fetch cities when province changes
  useEffect(() => {
    setCities([]);
    setBarangays([]);
    setFormData((prev) => ({ ...prev, city: "", barangay: "" }));

    if (!formData.province) return;

    setLoadingCities(true);
    fetch(`/api/psgc/cities?provinceCode=${formData.province}`)
      .then((r) => r.json())
      .then((data: unknown) => setCities(sortPsgcList<PsgcCityItem>(data)))
      .catch(console.error)
      .finally(() => setLoadingCities(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.province]);

  // Auto-fill district from selected city/municipality.
  useEffect(() => {
    if (!formData.city) {
      setFormData((prev) => ({ ...prev, district: "" }));
      return;
    }
    const selectedCity = cities.find((c) => c.code === formData.city);
    const district = districtForLgu(formData.city, selectedCity?.district);
    setFormData((prev) => ({
      ...prev,
      district,
    }));
  }, [formData.city, cities]);

  // Fetch barangays when city changes
  useEffect(() => {
    setBarangays([]);
    setFormData((prev) => ({ ...prev, barangay: "" }));

    if (!formData.city) return;

    setLoadingBarangays(true);
    fetch(`/api/psgc/barangays?cityCode=${formData.city}`)
      .then((r) => r.json())
      .then((data: unknown) => setBarangays(sortPsgcList<PsgcItem>(data)))
      .catch(console.error)
      .finally(() => setLoadingBarangays(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city]);

  // Birthplace: provinces when birth region changes
  useEffect(() => {
    setBirthProvinces([]);
    setBirthCities([]);
    setFormData((prev) => ({
      ...prev,
      province_birth: "",
      city_birth: "",
    }));

    if (!formData.region_birth) return;

    if (formData.region_birth === NCR_CODE) {
      setLoadingBirthCities(true);
      fetch(`/api/psgc/cities?regionCode=${formData.region_birth}`)
        .then((r) => r.json())
        .then((data: unknown) => setBirthCities(sortPsgcList<PsgcCityItem>(data)))
        .catch(console.error)
        .finally(() => setLoadingBirthCities(false));
      return;
    }

    setLoadingBirthProvinces(true);
    fetch(`/api/psgc/provinces?regionCode=${formData.region_birth}`)
      .then((r) => r.json())
      .then((data: unknown) => setBirthProvinces(sortPsgcList<PsgcItem>(data)))
      .catch(console.error)
      .finally(() => setLoadingBirthProvinces(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.region_birth]);

  // Birthplace: cities when birth province changes (non-NCR; NCR cities come from region effect)
  useEffect(() => {
    if (formData.region_birth === NCR_CODE) return;

    setBirthCities([]);
    setFormData((prev) => ({ ...prev, city_birth: "" }));

    if (!formData.province_birth) return;

    setLoadingBirthCities(true);
    fetch(`/api/psgc/cities?provinceCode=${formData.province_birth}`)
      .then((r) => r.json())
      .then((data: unknown) => setBirthCities(sortPsgcList<PsgcCityItem>(data)))
      .catch(console.error)
      .finally(() => setLoadingBirthCities(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.province_birth, formData.region_birth]);

  // Clamp day when month/year change (e.g. 31 → 28 when switching to February).
  useEffect(() => {
    if (!formData.month_bday || !formData.year_bday || !formData.day_bday) return;
    const y = parseInt(formData.year_bday, 10);
    const m = parseInt(formData.month_bday, 10);
    const d = parseInt(formData.day_bday, 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
    const max = daysInMonth(y, m);
    if (d <= max) return;
    setFormData((prev) => ({
      ...prev,
      day_bday: String(max).padStart(2, "0"),
    }));
  }, [formData.month_bday, formData.year_bday, formData.day_bday]);

  const progressPct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    scrollToTop();
  };
  const goPrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => {
      // Keep employment as single-select (radio) and clear type
      // when status is not Wage-Employed / Underemployed.
      if (name === "employment_status") {
        const nextStatus = value as FormData["employment_status"];
        const enableType = nextStatus === "emp1" || nextStatus === "emp2";
        return {
          ...prev,
          employment_status: nextStatus,
          employment_type: enableType ? prev.employment_type : "",
        };
      }
      if (name === "employment_type") {
        return {
          ...prev,
          employment_type: value as FormData["employment_type"],
        };
      }
      // Clear "Please Specify" when the Others checkbox is unchecked.
      if (name === "others" && type === "checkbox" && !checked) {
        return { ...prev, others: false, classification: "" };
      }
      // Clear free-text "Please Specify" when course changes away from "other".
      if (name === "course" && value !== "other") {
        return { ...prev, course: value, course_other: "" };
      }
      // Clear free-text "Please Specify" when scholarship package changes away from "other".
      if (name === "type_isko" && value !== "other") {
        return { ...prev, type_isko: value, type_isko_other: "" };
      }
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const chk = (val: boolean) => (val ? "☑" : "");
      const selectedRegion = regions.find((r) => r.code === formData.region);
      const selectedProvince = provinces.find((p) => p.code === formData.province);
      const selectedCity = cities.find((c) => c.code === formData.city);
      const selectedBarangay = barangays.find((b) => b.code === formData.barangay);

      const selectedBirthRegion = regions.find((r) => r.code === formData.region_birth);
      const selectedBirthProvince = birthProvinces.find(
        (p) => p.code === formData.province_birth
      );
      const selectedBirthCity = birthCities.find((c) => c.code === formData.city_birth);

      const birthRegionName =
        selectedBirthRegion?.name ?? formData.region_birth ?? "";
      const birthProvinceName =
        selectedBirthProvince?.name ?? formData.province_birth ?? "";
      const birthCityName =
        selectedBirthCity?.name ?? formData.city_birth ?? "";

      const monthBdayLabel =
        MONTH_OPTIONS.find((m) => m.value === formData.month_bday)?.label ??
        formData.month_bday;

      const docxPayload = {
        ...formData,
        age: computeAgeString(
          formData.month_bday,
          formData.day_bday,
          formData.year_bday
        ),
        date_now: formatDateNowMMDDYYYY(new Date()),
        // Word tag {m_initial_name} expects the middle initial (e.g. "J.") derived from {middle_name}
        m_initial_name: formData.middle_name.trim()
          ? `${formData.middle_name.trim().charAt(0).toUpperCase()}.`
          : "",
        // Word tag {month_bday} expects "January".."December" not "01".."12"
        month_bday: monthBdayLabel,
        // Convert PSGC codes to readable names for document output.
        mailing_region: selectedRegion?.name ?? formData.region,
        province: selectedProvince?.name ?? formData.province,
        city: selectedCity?.name ?? formData.city,
        barangay: selectedBarangay?.name ?? formData.barangay,
        district: districtForLgu(formData.city, selectedCity?.district) || formData.district,
        // Place of birth — template: {city_birth}, {province_birth}, {region}; use {mailing_region} for permanent address region
        city_birth: birthCityName,
        province_birth: birthProvinceName,
        region_birth: birthRegionName,
        region: selectedRegion?.name ?? formData.region,
        name_parent: formData.name_parent,
        address_parent: formData.address_parent,
        // Educational attainment — exactly one selected -> ☑ ; all others -> blank
        educ1: chk(formData.educational_attainment === "educ1"),
        educ2: chk(formData.educational_attainment === "educ2"),
        educ3: chk(formData.educational_attainment === "educ3"),
        educ4: chk(formData.educational_attainment === "educ4"),
        educ5: chk(formData.educational_attainment === "educ5"),
        educ6: chk(formData.educational_attainment === "educ6"),
        educ7: chk(formData.educational_attainment === "educ7"),
        educ8: chk(formData.educational_attainment === "educ8"),
        educ9: chk(formData.educational_attainment === "educ9"),
        educ10: chk(formData.educational_attainment === "educ10"),
        educ11: chk(formData.educational_attainment === "educ11"),
        educ12: chk(formData.educational_attainment === "educ12"),
        educ13: chk(formData.educational_attainment === "educ13"),
        // sex → checkmark placeholders for docx template
        male: chk(formData.sex === "male"),
        female: chk(formData.sex === "female"),
        // civil_status → checkmark placeholders for docx template
        single: chk(formData.civil_status === "single"),
        married: chk(formData.civil_status === "married"),
        separated: chk(formData.civil_status === "separated"),
        widow: chk(formData.civil_status === "widow"),
        livein: chk(formData.civil_status === "livein"),
        // employment (radio in UI; exported as checkmarks in docx)
        emp1: chk(formData.employment_status === "emp1"),
        emp2: chk(formData.employment_status === "emp2"),
        emp3: chk(formData.employment_status === "emp3"),
        emp4: chk(formData.employment_status === "emp4"),
        empt1: chk(formData.employment_type === "empt1"),
        empt2: chk(formData.employment_type === "empt2"),
        empt3: chk(formData.employment_type === "empt3"),
        empt4: chk(formData.employment_type === "empt4"),
        empt5: chk(formData.employment_type === "empt5"),
        empt6: chk(formData.employment_type === "empt6"),
        empt7: chk(formData.employment_type === "empt7"),
        empt8: chk(formData.employment_type === "empt8"),
        // Step 4 — beneficiary classification checkboxes
        "4ps":             chk(formData["4ps"]),
        displaced_worker:  chk(formData.displaced_worker),
        afp_pnp:           chk(formData.afp_pnp),
        industry_worker:   chk(formData.industry_worker),
        outofschoolyouth:  chk(formData.outofschoolyouth),
        rebel:             chk(formData.rebel),
        tesda_alumni:      chk(formData.tesda_alumni),
        victim:            chk(formData.victim),
        reform:            chk(formData.reform),
        drug:              chk(formData.drug),
        farmer:            chk(formData.farmer),
        inmate:            chk(formData.inmate),
        ofw_dependent:     chk(formData.ofw_dependent),
        ofw_returning:     chk(formData.ofw_returning),
        tvet:              chk(formData.tvet),
        wounded:           chk(formData.wounded),
        balik_probinsya:   chk(formData.balik_probinsya),
        afp_pnp_killed:    chk(formData.afp_pnp_killed),
        indigenous:        chk(formData.indigenous),
        milf:              chk(formData.milf),
        rcef:              chk(formData.rcef),
        student:           chk(formData.student),
        personnel:         chk(formData.personnel),
        others:            chk(formData.others),
        classification:    formData.others ? formData.classification : "",
        // Step 5 — type of disability checkboxes
        dis1:              chk(formData.dis1),
        dis2:              chk(formData.dis2),
        dis3:              chk(formData.dis3),
        dis4:              chk(formData.dis4),
        dis5:              chk(formData.dis5),
        dis6:              chk(formData.dis6),
        dis7:              chk(formData.dis7),
        dis8:              chk(formData.dis8),
        dis9:              chk(formData.dis9),
        // Step 6 — causes of disability checkboxes
        cause1:            chk(formData.cause1),
        cause2:            chk(formData.cause2),
        cause3:            chk(formData.cause3),
        // Step 7 — name of course/qualification
        // When the user picks "Other", emit the typed text instead of the sentinel "other".
        course:
          formData.course === "other"
            ? formData.course_other
            : formData.course,
        // Step 8 — scholarship package
        type_isko:
          formData.type_isko === "other"
            ? formData.type_isko_other
            : formData.type_isko,
        // Step 9 — privacy consent (single-select source -> two checkmark placeholders)
        consent_agree:    chk(formData.consent === "agree"),
        consent_disagree: chk(formData.consent === "disagree"),
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
      const safe = (s: string) =>
        s
          .trim()
          .replace(/[\\/:*?"<>|]/g, "")
          .replace(/\s+/g, " ");
      const last = safe(formData.last_name || "LastName");
      const first = safe(formData.first_name || "FirstName");
      a.href = url;
      a.download = `${last}, ${first} - Learners_Profile.docx`;
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
              addressLists={{
                regions,
                provinces,
                cities,
                barangays,
                loadingProvinces,
                loadingCities,
                loadingBarangays,
                birthProvinces,
                birthCities,
                loadingBirthProvinces,
                loadingBirthCities,
              }}
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
