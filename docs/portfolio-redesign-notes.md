# Portfolio Redesign Notes

## Design Direction Summary

- Aesthetic name: instrument-panel editorial
- DFII score: 13
- Purpose: help recruiters and hiring managers understand Kyle Santos as an electronics engineer who also builds software
- Tone: industrial and confident with a clear product-design layer
- Differentiation anchor: a signal-sheet style portfolio with real project evidence and an electronics lab search section

## Understanding Summary

- The previous site was still a generic developer template with placeholder experience, blog, and testimonial content.
- The portfolio needed to feel more credible for job applications and resume use.
- GitHub, LinkedIn, email, and real project information needed to be easy to find.
- The electronics-engineer identity needed to be explicit, not implied.
- The site needed to include all current public projects from the GitHub profile.
- Maintainability mattered, so project content should not stay hardcoded in HTML.

## Assumptions

- Kyle Santos is the public-facing name to use on the portfolio.
- The five public GitHub repositories found on the profile are the projects that should currently be represented.
- Direct email plus GitHub and LinkedIn links are more reliable than a browser contact form for this portfolio.
- A resume PDF is not currently stored in the repo, so the design should avoid a broken download link.

## Decision Log

- Decision: remove the placeholder experience, testimonials, and blog sections.
  Why: fake or filler content weakens trust for hiring.

- Decision: replace the generic developer framing with "electronics engineer plus software builder."
  Why: this better matches the user request and makes the portfolio more memorable.

- Decision: move project content into `data/projects.json`.
  Why: this keeps the portfolio maintainable and lets the project grid stay data-driven.

- Decision: keep the electronics search section.
  Why: it is a useful differentiator and supports the engineering identity of the site.

- Decision: replace the contact form with direct contact cards and copy-email behavior.
  Why: simpler, more reliable, and better suited for recruiter workflows.
