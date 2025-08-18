// app/routes/_index.tsx
import * as React from "react";
import type { MetaFunction } from "react-router";

// SEO metadata for the landing page
export const meta: MetaFunction = () => {
  const title = "GPA Calculator and Grade Tools | iLoveGrades";
  const description =
    "Free GPA calculator for high school and college. Compute term and cumulative GPA, plan your grades, and explore grade tools on iLoveGrades.";
  const url = "https://ilovegrades.com/";
  const image = "https://ilovegrades.com/og-image.png"; // replace when you have one

  return [
    { title },
    { name: "description", content: description },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    // Canonical
    { tagName: "link", rel: "canonical", href: url },
  ];
};

// GPA scale map for a standard 4.0 scale
const LETTER_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

function gradeOptions() {
  return Object.keys(LETTER_POINTS).map((g) => (
    <option key={g} value={g}>
      {g}
    </option>
  ));
}

type Row = {
  id: string;
  course: string;
  credits: string; // keep as string for inputs, parse to number for math
  grade: string; // letter grade
};

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    course: "",
    credits: "3",
    grade: "A",
  };
}

function calcGPA(rows: Row[]): {
  gpa: number;
  totalCredits: number;
  qualityPoints: number;
} {
  let totalCredits = 0;
  let qualityPoints = 0;
  for (const r of rows) {
    const c = Number(r.credits);
    const p = LETTER_POINTS[r.grade] ?? 0;
    if (!isFinite(c) || c <= 0) continue;
    totalCredits += c;
    qualityPoints += c * p;
  }
  const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;
  return { gpa, totalCredits, qualityPoints };
}

export default function IndexPage() {
  const [rows, setRows] = React.useState<Row[]>([
    emptyRow(),
    emptyRow(),
    emptyRow(),
  ]);

  const { gpa, totalCredits, qualityPoints } = React.useMemo(
    () => calcGPA(rows),
    [rows]
  );

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function resetTable() {
    setRows([emptyRow(), emptyRow(), emptyRow()]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iLoveGrades",
    url: "https://ilovegrades.com/",
    description:
      "Free GPA calculator and grade planning tools for students. Compute GPA and explore study resources.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ilovegrades.com/?q={query}",
      "query-input": "required name=query",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate GPA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter each course with its credit hours and letter grade. The calculator multiplies grade points by credits, sums everything, then divides by total credits.",
        },
      },
      {
        "@type": "Question",
        name: "What GPA scale does this tool use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The default is a standard 4.0 scale with A+ equal to 4.0. You can change scales later when the advanced settings are available.",
        },
      },
      {
        "@type": "Question",
        name: "Is this calculator free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The GPA calculator is free to use for everyone.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-sky-700">
      {/* Structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero Section */}
      <header className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Free GPA Calculator for Students
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Compute your semester GPA in seconds. Plan the grades you need for
              your targets. Save time with a clean, focused interface.
            </p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>• Fast and accurate GPA math</li>
              <li>• Works with standard 4.0 scale</li>
              <li>• Add many courses and credits</li>
              <li>• Mobile friendly design</li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a
                href="#gpa-calculator"
                className="rounded-2xl bg-teal-600 px-6 py-3 text-white shadow-md transition hover:opacity-90"
              >
                Try the GPA Calculator
              </a>
              <a
                href="#features"
                className="rounded-2xl border border-sky-300 px-6 py-3 text-sky-700 hover:bg-gray-50"
              >
                Learn more
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-teal-200 p-6 shadow-sm">
            {/* Preview card */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Instant GPA Preview</p>
              <p
                className="text-2xl font-bold"
                aria-live="polite"
                aria-atomic="true"
              >
                {totalCredits > 0 ? gpa.toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total Credits:{" "}
              <span className="font-semibold">{totalCredits}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Quality Points:{" "}
              <span className="font-semibold">{qualityPoints.toFixed(2)}</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-teal-600 transition-all"
                style={{ width: `${Math.min(100, (gpa / 4) * 100)}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={
                  Number.isFinite(gpa) ? Number(gpa.toFixed(2)) : 0
                }
                aria-label="GPA progress toward 4.0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* GPA Calculator */}
      <section id="gpa-calculator" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">GPA Calculator</h2>
        <p className="mt-2 text-gray-700">
          Enter your courses, credits, and grades. The calculator uses the
          standard 4.0 scale.
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl border border-teal-200 shadow-sm">
          <div className="grid grid-cols-12 gap-3 border-b border-teal-200 bg-gray-50 p-4 text-sm font-semibold">
            <div className="col-span-6 sm:col-span-6">Course</div>
            <div className="col-span-3 sm:col-span-3">Credits</div>
            <div className="col-span-3 sm:col-span-3">Grade</div>
          </div>

          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-3 p-4">
              <div className="col-span-6 sm:col-span-6">
                <label className="sr-only" htmlFor={`course-${row.id}`}>
                  Course name
                </label>
                <input
                  id={`course-${row.id}`}
                  type="text"
                  inputMode="text"
                  placeholder="e.g., Calculus I"
                  value={row.course}
                  onChange={(e) =>
                    updateRow(row.id, { course: e.target.value })
                  }
                  className="w-full rounded-xl border border-sky-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-800"
                />
              </div>
              <div className="col-span-3 sm:col-span-3">
                <label className="sr-only" htmlFor={`credits-${row.id}`}>
                  Credit hours
                </label>
                <input
                  id={`credits-${row.id}`}
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="3"
                  value={row.credits}
                  onChange={(e) =>
                    updateRow(row.id, { credits: e.target.value })
                  }
                  className="w-full rounded-xl border border-sky-300 px-3 py-2 outline-none [appearance:textfield] focus:ring-2 focus:ring-sky-800 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                <label className="sr-only" htmlFor={`grade-${row.id}`}>
                  Letter grade
                </label>
                <select
                  id={`grade-${row.id}`}
                  value={row.grade}
                  onChange={(e) => updateRow(row.id, { grade: e.target.value })}
                  className="w-full rounded-xl border border-sky-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-800"
                >
                  {gradeOptions()}
                </select>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="rounded-xl border border-sky-300 px-3 py-2 text-sm hover:bg-gray-50"
                  aria-label="Remove course"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-teal-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">GPA:</span>{" "}
              {totalCredits > 0 ? gpa.toFixed(3) : "0.000"}
              <span className="mx-2">·</span>
              <span className="font-semibold">Credits:</span> {totalCredits}
              <span className="mx-2">·</span>
              <span className="font-semibold">Quality Points:</span>{" "}
              {qualityPoints.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addRow}
                className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:opacity-90"
              >
                Add course
              </button>
              <button
                type="button"
                onClick={resetTable}
                className="rounded-xl border border-sky-300 px-4 py-2 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          Note: Schools can use different scales. You can add a custom scale
          soon in the advanced settings.
        </p>
      </section>

      {/* Feature section with SEO friendly copy */}
      {/* <section id="features" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">
          Grade tools that help you plan and improve
        </h2>
        <p className="mt-2 max-w-3xl text-gray-700">
          iLoveGrades offers simple calculators and guides that help you track
          performance and set goals. Start with the GPA calculator. Come back
          for term planners, grade needed calculators, and weighted average
          tools.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Term GPA Calculator",
              href: "/gpa",
              desc: "Compute GPA for a single term using letter grades and credits.",
            },
            {
              title: "Cumulative GPA",
              href: "/cumulative-gpa",
              desc: "Track your overall GPA across many terms.",
            },
            {
              title: "What Grade Do I Need?",
              href: "/grade-needed",
              desc: "Figure out the score needed on your final to reach a target grade.",
            },
            {
              title: "Weighted Average",
              href: "/weighted-average",
              desc: "Combine assignments with different weights to get a course grade.",
            },
            {
              title: "Percentage to Letter",
              href: "/percent-to-letter",
              desc: "Convert raw percentages to common letter grades.",
            },
            {
              title: "Study Planner",
              href: "/study-planner",
              desc: "Plan study sessions and keep a steady schedule.",
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group block rounded-3xl border border-teal-200 p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold group-hover:underline">
                {card.title}
              </h3>
              <p className="mt-2 text-gray-700">{card.desc}</p>
              <span className="mt-4 inline-block text-sm text-gray-600">
                Open tool →
              </span>
            </a>
          ))}
        </div>
      </section> */}

      <section id="how-to-calculate" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">How to Calculate GPA</h2>
        <p className="mt-2 text-gray-700">
          Follow these steps to calculate GPA on a 4.0 scale:
        </p>
        <ol className="mt-4 list-decimal pl-6 text-gray-700 space-y-2">
          <li>
            Multiply the grade points for each course by its credit hours.
          </li>
          <li>Add up all the quality points for every course.</li>
          <li>
            Divide the total quality points by the total number of credit hours.
          </li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          This formula works for most high school and college GPAs.
        </p>
      </section>

      <section
        id="weighted-vs-unweighted"
        className="mx-auto max-w-6xl px-6 pb-16"
      >
        <h2 className="text-2xl font-bold">Weighted vs. Unweighted GPA</h2>
        <p className="mt-2 text-gray-700">
          An <span className="font-semibold">unweighted GPA</span> uses the
          standard 4.0 scale where an A equals 4.0 points. A{" "}
          <span className="font-semibold">weighted GPA</span> gives extra points
          for honors, AP, or IB classes. For example, an A in an AP course might
          be worth 5.0 points instead of 4.0.
        </p>
        <p className="mt-2 text-gray-700">
          Colleges often look at both, so understanding the difference is
          important when planning your courses.
        </p>
      </section>

      <section id="why-gpa-matters" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">Why GPA Matters</h2>
        <p className="mt-2 text-gray-700">
          GPA plays a major role in{" "}
          <span className="font-semibold">college admissions</span>,{" "}
          <span className="font-semibold">scholarship eligibility</span>, and
          even <span className="font-semibold">job applications</span>. A higher
          GPA can increase your opportunities for financial aid, competitive
          programs, and career advancement.
        </p>
      </section>

      <section id="gpa-scales" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">Common GPA Scales</h2>
        <p className="mt-2 text-gray-700">
          Different schools use different GPA scales. Here are a few examples:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-teal-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2 text-left">Scale Type</th>
                <th className="border px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">4.0 Scale</td>
                <td className="border px-4 py-2">
                  Most common in the U.S., A = 4.0, B = 3.0, etc.
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">4.3 Scale</td>
                <td className="border px-4 py-2">
                  Some schools give an A+ a 4.3 instead of 4.0.
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">5.0 Scale</td>
                <td className="border px-4 py-2">
                  Weighted GPA, honors/AP classes can earn 5.0 points.
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">100-Point Scale</td>
                <td className="border px-4 py-2">
                  Grades are percentages, converted to GPA by school policy.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ section for SEO */}
      {/* SEO-rich educational sections inserted before FAQ */}
      <section
        id="how-to-calculate-gpa"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">How to Calculate GPA</h2>
        <p className="mt-2 text-gray-700">
          Follow this quick method for a standard 4.0 scale.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-800">
          <li>
            List each course with its{" "}
            <span className="font-semibold">credit hours</span> and{" "}
            <span className="font-semibold">letter grade</span>.
          </li>
          <li>
            Convert each letter to{" "}
            <span className="font-semibold">grade points</span> on the 4.0 GPA
            scale.
          </li>
          <li>
            Multiply grade points by credits to get{" "}
            <span className="font-semibold">quality points</span>.
          </li>
          <li>
            Add all quality points, then divide by total credits to get your{" "}
            <span className="font-semibold">GPA</span>.
          </li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          Example: A in a 3 credit course is 4.0 × 3 = 12 quality points.
        </p>
      </section>

      <section
        id="weighted-vs-unweighted-gpa"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">Weighted vs. Unweighted GPA</h2>
        <p className="mt-2 text-gray-700">
          An <span className="font-semibold">unweighted GPA</span> uses the
          standard 4.0 scale for all courses. A{" "}
          <span className="font-semibold">weighted GPA</span> gives extra points
          for advanced courses like Honors or AP, often up to 5.0 or more.
          Weighted systems help distinguish course rigor.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-teal-200">
          <div className="grid grid-cols-2 bg-gray-50 p-3 text-sm font-semibold">
            <div>Type</div>
            <div>Typical Scale</div>
          </div>
          <div className="grid grid-cols-2 p-3 text-gray-800">
            <div>Unweighted</div>
            <div>4.0 (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0)</div>
          </div>
          <div className="grid grid-cols-2 border-t border-teal-200 p-3 text-gray-800">
            <div>Weighted</div>
            <div>Up to 5.0 with Honors or AP weighting</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Try the{" "}
          <a href="/weighted-average" className="underline">
            Weighted Average
          </a>{" "}
          tool to experiment with different systems.
        </p>
      </section>

      <section id="why-gpa-matters" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Why GPA Matters</h2>
        <p className="mt-2 text-gray-700">
          GPA is a quick summary of academic performance. Colleges and
          scholarship committees often set GPA thresholds. Recruiters may ask
          for GPA on early resumes. Use the calculator to monitor progress and
          plan targets.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-800">
          <li>Scholarship eligibility and academic standing</li>
          <li>Program admissions and graduation requirements</li>
          <li>Internship and entry level job applications</li>
        </ul>
      </section>

      <section id="common-gpa-scales" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Common GPA Scales</h2>
        <p className="mt-2 text-gray-700">
          Schools may use different scales. Here are popular options.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-teal-200">
          <div className="grid grid-cols-3 bg-gray-50 p-3 text-sm font-semibold">
            <div>Scale</div>
            <div>Top Grade</div>
            <div>Notes</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-gray-800">
            <div>4.0</div>
            <div>A = 4.0</div>
            <div>Standard in many colleges</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>4.3</div>
            <div>A+ = 4.3</div>
            <div>Some schools treat A+ above A</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>5.0</div>
            <div>A (AP/Honors) ≈ 5.0</div>
            <div>Weighted for advanced courses</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>100‑point</div>
            <div>100 = A+</div>
            <div>Converted to 4.0 scale for applications</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Need conversions? Try{" "}
          <a href="/percent-to-letter" className="underline">
            Percent to Letter
          </a>{" "}
          or see custom scale options when available.
        </p>
      </section>

      <section
        id="how-to-calculate-gpa"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">How to Calculate GPA</h2>
        <p className="mt-2 text-gray-700">
          Follow this quick method for a standard 4.0 scale.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-800">
          <li>
            List each course with its{" "}
            <span className="font-semibold">credit hours</span> and{" "}
            <span className="font-semibold">letter grade</span>.
          </li>
          <li>
            Convert each letter to{" "}
            <span className="font-semibold">grade points</span> on the 4.0 GPA
            scale.
          </li>
          <li>
            Multiply grade points by credits to get{" "}
            <span className="font-semibold">quality points</span>.
          </li>
          <li>
            Add all quality points, then divide by total credits to get your{" "}
            <span className="font-semibold">GPA</span>.
          </li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          Example: A in a 3 credit course is 4.0 × 3 = 12 quality points.
        </p>
      </section>

      <section
        id="weighted-vs-unweighted-gpa"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">Weighted vs. Unweighted GPA</h2>
        <p className="mt-2 text-gray-700">
          An <span className="font-semibold">unweighted GPA</span> uses the
          standard 4.0 scale for all courses. A{" "}
          <span className="font-semibold">weighted GPA</span> gives extra points
          for advanced courses like Honors or AP, often up to 5.0 or more.
          Weighted systems help distinguish course rigor.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-teal-200">
          <div className="grid grid-cols-2 bg-gray-50 p-3 text-sm font-semibold">
            <div>Type</div>
            <div>Typical Scale</div>
          </div>
          <div className="grid grid-cols-2 p-3 text-gray-800">
            <div>Unweighted</div>
            <div>4.0 (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0)</div>
          </div>
          <div className="grid grid-cols-2 border-t border-teal-200 p-3 text-gray-800">
            <div>Weighted</div>
            <div>Up to 5.0 with Honors or AP weighting</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Try the{" "}
          <a href="/weighted-average" className="underline">
            Weighted Average
          </a>{" "}
          tool to experiment with different systems.
        </p>
      </section>

      <section id="why-gpa-matters" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Why GPA Matters</h2>
        <p className="mt-2 text-gray-700">
          GPA is a quick summary of academic performance. Colleges and
          scholarship committees often set GPA thresholds. Recruiters may ask
          for GPA on early resumes. Use the calculator to monitor progress and
          plan targets.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-800">
          <li>Scholarship eligibility and academic standing</li>
          <li>Program admissions and graduation requirements</li>
          <li>Internship and entry level job applications</li>
        </ul>
      </section>

      <section id="common-gpa-scales" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Common GPA Scales</h2>
        <p className="mt-2 text-gray-700">
          Schools may use different scales. Here are popular options.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-teal-200">
          <div className="grid grid-cols-3 bg-gray-50 p-3 text-sm font-semibold">
            <div>Scale</div>
            <div>Top Grade</div>
            <div>Notes</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-gray-800">
            <div>4.0</div>
            <div>A = 4.0</div>
            <div>Standard in many colleges</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>4.3</div>
            <div>A+ = 4.3</div>
            <div>Some schools treat A+ above A</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>5.0</div>
            <div>A (AP/Honors) ≈ 5.0</div>
            <div>Weighted for advanced courses</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>100‑point</div>
            <div>100 = A+</div>
            <div>Converted to 4.0 scale for applications</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Need conversions? Try{" "}
          <a href="/percent-to-letter" className="underline">
            Percent to Letter
          </a>{" "}
          or see custom scale options when available.
        </p>
      </section>

      {/* Additional SEO-rich, user-helpful sections inserted before FAQ */}
      <section
        id="grade-needed-explainer"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">
          What Grade Do I Need on My Final?
        </h2>
        <p className="mt-2 text-gray-700">
          Use target grade math to find the score you need on your remaining
          assignments or final exam to reach your goal. This is one of the most
          searched grade questions for students.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-800">
          <li>Add your current average for the course.</li>
          <li>Enter the weight of the final exam or remaining work.</li>
          <li>
            Set your target course grade and solve for the required score.
          </li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          Try the{" "}
          <a href="/grade-needed" className="underline">
            Grade Needed
          </a>{" "}
          calculator to run the numbers.
        </p>
      </section>

      <section id="semester-planning" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Semester Planning Tips</h2>
        <ul className="mt-3 grid gap-3 text-gray-800 sm:grid-cols-2">
          <li className="rounded-2xl border border-teal-200 p-4">
            Distribute credits evenly across terms to avoid overload.
          </li>
          <li className="rounded-2xl border border-teal-200 p-4">
            Balance hard STEM courses with writing or seminar courses when
            possible.
          </li>
          <li className="rounded-2xl border border-teal-200 p-4">
            Use office hours early. Improvement is faster when feedback comes
            sooner.
          </li>
          <li className="rounded-2xl border border-teal-200 p-4">
            Create weekly study blocks and protect them in your calendar.
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          See the{" "}
          <a href="/study-planner" className="underline">
            Study Planner
          </a>{" "}
          to build a schedule you can keep.
        </p>
      </section>

      <section id="gpa-by-system" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">GPA Systems by School or Country</h2>
        <p className="mt-2 text-gray-700">
          Different regions use different grading scales. Here is a quick
          overview.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-teal-200">
          <div className="grid grid-cols-3 bg-gray-50 p-3 text-sm font-semibold">
            <div>Region</div>
            <div>Common Scale</div>
            <div>Notes</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-gray-800">
            <div>United States</div>
            <div>4.0 or 4.3</div>
            <div>Letter grades convert to points</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>Canada</div>
            <div>4.0 or 12-point</div>
            <div>Varies by province and university</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>Europe</div>
            <div>ECTS or 10-point</div>
            <div>Often converted for applications</div>
          </div>
          <div className="grid grid-cols-3 border-t border-teal-200 p-3 text-gray-800">
            <div>India</div>
            <div>10-point CGPA</div>
            <div>Universities publish conversion guidance</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Always confirm the official conversion your school or program
          requires.
        </p>
      </section>

      <section id="gpa-improvement" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">How to Improve Your GPA</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
          <li>
            Focus on courses with higher credit hours for the biggest impact.
          </li>
          <li>
            Retake courses that allow grade replacement if your school supports
            it.
          </li>
          <li>Use weekly practice exams to identify weak areas early.</li>
          <li>
            Join study groups and alternate teaching and quizzing each other.
          </li>
        </ul>
      </section>

      <section id="honors-weighting" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Honors, AP, and IB Weighting</h2>
        <p className="mt-2 text-gray-700">
          Many high schools add extra points for advanced courses. Policies
          differ. Some add 0.5 for Honors and 1.0 for AP or IB on a 4.0 base.
          Check your handbook for exact rules.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Build scenarios in the{" "}
          <a href="/weighted-average" className="underline">
            Weighted Average
          </a>{" "}
          tool.
        </p>
      </section>

      <section id="pass-fail-impact" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Pass or Fail Courses and GPA</h2>
        <p className="mt-2 text-gray-700">
          Pass or Fail courses can affect progress without changing GPA,
          depending on your policy.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
          <li>Pass often gives credit but no grade points.</li>
          <li>Fail usually gives zero points and may not give credit.</li>
          <li>
            Some programs limit how many Pass or Fail courses you can take.
          </li>
        </ul>
      </section>

      <section id="repeat-policy" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">
          Course Repeat and Grade Replacement
        </h2>
        <p className="mt-2 text-gray-700">
          Policies vary. Some schools replace the old grade. Others average
          attempts. This matters for GPA planning.
        </p>
      </section>

      <section
        id="major-vs-cumulative"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">Major GPA vs. Cumulative GPA</h2>
        <p className="mt-2 text-gray-700">
          Major GPA uses only courses from your declared program. Cumulative GPA
          includes all graded courses. Applications may ask for one or both.
        </p>
      </section>

      <section
        id="deans-list-and-standing"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">
          Dean's List and Academic Standing
        </h2>
        <p className="mt-2 text-gray-700">
          Schools post GPA thresholds for Dean's List, probation, and good
          standing. Track your status and plan ahead.
        </p>
      </section>

      <section id="study-techniques" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">
          Study Techniques That Raise Grades
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
          <li>Use spaced repetition for definitions and formulas.</li>
          <li>Practice active recall with low-stakes quizzes.</li>
          <li>Teach the topic to a friend to check understanding.</li>
          <li>Schedule short review sessions after each lecture.</li>
        </ul>
      </section>

      <section id="glossary" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl font-bold">Glossary: GPA and Grades</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-200 p-4">
            <span className="font-semibold">Credit Hours:</span> Units that
            measure course workload and weight in GPA.
          </div>
          <div className="rounded-2xl border border-teal-200 p-4">
            <span className="font-semibold">Grade Points:</span> Numeric value
            for each letter grade on your GPA scale.
          </div>
          <div className="rounded-2xl border border-teal-200 p-4">
            <span className="font-semibold">Quality Points:</span> Credit hours
            multiplied by grade points.
          </div>
          <div className="rounded-2xl border border-teal-200 p-4">
            <span className="font-semibold">Cumulative GPA:</span> GPA across
            all completed terms.
          </div>
        </div>
      </section>

      {/* FAQ section for SEO */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">
              How do I calculate GPA with credits?
            </h3>
            <p className="mt-2 text-gray-700">
              Multiply the grade points for each course by its credit hours. Sum
              all quality points. Divide by total credits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use a different GPA scale?</h3>
            <p className="mt-2 text-gray-700">
              Many schools use a 4.0 scale. Some use 4.3 or weight honors and
              AP. Support for custom scales is on the roadmap.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is my data saved?</h3>
            <p className="mt-2 text-gray-700">
              This page runs in your browser. When sign in is available, you can
              save terms and courses to your account.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Does this work on mobile?</h3>
            <p className="mt-2 text-gray-700">
              Yes. The layout is responsive and touch friendly.
            </p>
          </div>
        </div>
      </section>

      <section
        id="privacy-and-accessibility"
        className="mx-auto max-w-6xl px-6 pb-12"
      >
        <h2 className="text-2xl font-bold">Privacy and Accessibility</h2>
        <p className="mt-2 text-gray-700">
          This calculator runs in your browser. No account is required to use
          it. We aim for keyboard and screen reader support for all controls.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Read our{" "}
          <a href="/privacy" className="underline">
            Privacy
          </a>{" "}
          page and our accessibility notes when available.
        </p>
      </section>

      <footer className="border-t border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-6xl px-6 pb-4 text-sm text-sky-900">
          {/* <nav className="flex flex-wrap gap-4">
            <a href="/gpa" className="hover:underline">
              GPA Calculator
            </a>
            <a href="/cumulative-gpa" className="hover:underline">
              Cumulative GPA
            </a>
            <a href="/grade-needed" className="hover:underline">
              Grade Needed
            </a>
            <a href="/weighted-average" className="hover:underline">
              Weighted Average
            </a>
            <a href="/study-planner" className="hover:underline">
              Study Planner
            </a>
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
          </nav> */}
          <p className="mt-4">
            © {new Date().getFullYear()} iLoveGrades. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
