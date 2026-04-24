# Kyle Santos Portfolio

Resume-ready portfolio site for an electronics engineer and software builder.

## Overview

This version of the site is designed to:

- follow the resume and portfolio flow from `document (1).md`
- position Kyle as an embedded systems and AI computer vision candidate
- present MICROTECT as the flagship capstone case study
- organize each project by problem, solution, architecture, hardware, logic, results, and fixes
- present a research-paper case study with 3D design and prototype evidence slots
- organize project-based experience and skill groups in a resume-friendly format
- keep project content maintainable through structured data
- stay lightweight as a static site

## Project Structure

```text
PORTFOLIO/
|-- index.html
|-- resume.html
|-- css/
|   |-- resume.css
|   `-- styles.css
|-- assets/
|   |-- images/
|   |   `-- microtect/
|   `-- papers/
|       |-- kyle-santos-resume.pdf
|       `-- microtect-final-paper.pdf
|-- data/
|   |-- electronics.json
|   `-- projects.json
|-- js/
|   |-- main.js
|   |-- project-data.mjs
|   |-- projects.mjs
|   `-- search.js
|-- tests/
|   `-- project-data.test.mjs
`-- README.md
```

## Local Preview

Open `index.html` directly, or run a local server:

```bash
py -m http.server 8000
```

Then open `http://localhost:8000`.

## Update Content

### Projects

Edit `data/projects.json` to update:

- project names
- summaries and impact statements
- problem, solution, architecture, hardware, software logic, results, and challenges
- tech stacks
- featured status
- GitHub links

### Personal Details

Edit `index.html` and `resume.html` for:

- hero/profile copy
- research paper, prototype, experience, skills, and resume snapshot content
- email address
- education details
- phone number
- GitHub link
- LinkedIn link

### Resume PDF

Open `resume.html`, then use the `Print or Save PDF` button. The resume is designed
as two print pages. The generated PDF used by the portfolio buttons is stored at
`assets/papers/kyle-santos-resume.pdf`.

### MICROTECT Assets

The MICROTECT paper and visuals are stored in:

- `assets/papers/microtect-final-paper.pdf`
- `assets/papers/kyle-santos-resume.pdf`
- `assets/images/microtect/microtect-3d-render-transparent.png`
- `assets/images/microtect/microtect-detection-ui.png`
- `assets/images/microtect/microtect-3d-perspective.jpg`
- `assets/images/microtect/microtect-3d-front.jpg`
- `assets/images/microtect/microtect-3d-cutaway.jpg`

### Electronics Lab

Edit `data/electronics.json` to expand the searchable electronics reference.

## Tests

Run the project-data checks with:

```bash
node tests/project-data.test.mjs
```

## Notes

- The project cards are rendered from `data/projects.json` by `js/projects.mjs`.
- The electronics search is powered by `data/electronics.json` and `js/search.js`.
- The portfolio resume buttons open `assets/papers/kyle-santos-resume.pdf`, generated from `resume.html`.
