import { useEffect } from 'react';
import { setSEO } from '@/utils/seo';

export default function AuthorGuidelinesPage() {
  useEffect(() => {
    setSEO(
      'Author Guidelines, Editorial & Publication Policy — Agrigence',
      'At Agrigence, every submitted article undergoes a structured editorial and technical review to ensure quality, originality, and practical relevance for the agricultural community.'
    );
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Author Guidelines, Editorial & Publication Policy — Agrigence
        </h1>

        <div className="space-y-6 text-base leading-relaxed">
          <p>
            At Agrigence, every submitted article undergoes a structured editorial and technical review to ensure quality, originality, and practical relevance for the agricultural community.
          </p>

          <p>
            Our Editorial Board includes Subject Matter Specialist Editors, research scholars from reputed research institutions, and senior professors from universities across India. All articles are initially reviewed by the Chief Editor and relevant Subject Specialists.
          </p>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>Articles not following Agrigence formatting or publishing guidelines are rejected at screening.</li>
            <li>If improvement is required, the article is returned to subject experts and reviewers for correction.</li>
            <li>Only after proper review, correction, and approval is the article scheduled for publication in an upcoming issue.</li>
          </ul>

          <p>
            Agrigence accepts only original "Popular Articles" or "Technical Articles" that have not been published or accepted elsewhere. For any queries regarding preparation or submission, authors must use the Contact Us section.
          </p>

          <p>
            Upon acceptance, copyright of the article belongs to Agrigence (the publisher).
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Publication Policy</h2>

          <ol className="list-decimal list-outside ml-6 space-y-2">
            <li>Articles are published in the monthly issue of Agrigence.</li>
            <li>All authors must be annual members of Agrigence.</li>
            <li>Each author receives a membership certificate and unique membership ID after membership payment.</li>
            <li>Publication is 100% free for annual members. Nominal charges apply for non-member co-authors (refer to Publication Fees).</li>
            <li>Only properly formatted magazine articles and popular stories are accepted.</li>
            <li>Articles must be submitted in .doc / .docx (Word format) only.</li>
            <li>Submissions not in the prescribed format are rejected.</li>
            <li>A monthly submission deadline is displayed on the homepage. Submissions after the due date are not accepted.</li>
            <li>Article length: 2–4 pages maximum.</li>
            <li>Articles must include an Introduction and Conclusion.</li>
            <li>Content must be informative, innovative, and trend-focused.</li>
            <li>Use of tables, figures, and high-quality photographs is encouraged.</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">Formatting Guidelines</h2>

          <ol className="list-decimal list-outside ml-6 space-y-2" start={13}>
            <li>Title: Short, informative; 14 pt, Bold, Times New Roman.</li>
            <li>Author details below title: 12 pt Times New Roman; corresponding author email in 12 pt Bold.</li>
            <li>Body text: 12 pt; Main headings 14 pt bold; Subheadings 12 pt bold.</li>
            <li>Use metric units; define all abbreviations; cite data sources clearly.</li>
            <li>Symbols and abbreviations must follow IUB and IUPAC standards.</li>
            <li>Prefer SI (metric) units consistently throughout.</li>
            <li>Authors are solely responsible for plagiarism issues.</li>
            <li>The published soft copy of the article is emailed to the author and is also downloadable from the website.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
