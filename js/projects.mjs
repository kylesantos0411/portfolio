import {
  buildProjectStats,
  filterProjects,
  getProjectCategories,
  prepareProjects,
} from "./project-data.mjs";

const heroStatsElement = document.getElementById("heroStats");
const projectGridElement = document.getElementById("projectsGrid");
const projectFiltersElement = document.getElementById("projectFilters");
const projectSearchElement = document.getElementById("projectSearch");
const projectMetaElement = document.getElementById("projectMeta");
const projectsEmptyElement = document.getElementById("projectsEmpty");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const initialProjectSlug = new URLSearchParams(window.location.search).get("project");

let allProjects = [];
let activeCategory = "all";
let pendingProjectSlug = initialProjectSlug;

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => escapeMap[character]);
}

function safeKind(value) {
  return String(value || "general").replace(/[^a-z0-9-]/gi, "") || "general";
}

function detailValueTemplate(value) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return "";
    }

    return `
      <ul>
        ${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  }

  if (!value) {
    return "";
  }

  return `<p>${escapeHtml(value)}</p>`;
}

function projectDetailsTemplate(project) {
  const details = project.details || {};
  const items = [
    ["Problem", details.problem],
    ["Solution", details.solution],
    ["System Architecture", details.architecture],
    ["Hardware Used", details.hardware],
    ["Software & Logic", details.software],
    ["Results", details.results],
    ["Challenges & Fixes", details.challenges],
  ];

  const content = items
    .map(([label, value]) => {
      const detailContent = detailValueTemplate(value);

      if (!detailContent) {
        return "";
      }

      return `
        <div class="project-card__case-item">
          <span>${escapeHtml(label)}</span>
          ${detailContent}
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  if (!content) {
    return "";
  }

  return `<div class="project-card__case">${content}</div>`;
}

function renderHeroStats(stats) {
  if (!heroStatsElement) {
    return;
  }

  const items = [
    { value: stats.total, label: "public projects" },
    { value: stats.featured, label: "flagship builds" },
    { value: stats.categories, label: "focus tracks" },
    { value: stats.technologies, label: "stack signals" },
  ];

  heroStatsElement.innerHTML = items
    .map(
      (item) => `
        <li class="hero-stat">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </li>
      `,
    )
    .join("");
}

function closePortfolioSidebar() {
  const sidebar = document.getElementById("portfolioSidebar");

  if (!sidebar) {
    return;
  }

  sidebar.classList.remove("is-open");
  document.body.classList.remove("portfolio-sidebar-open");

  sidebar
    .querySelectorAll("[data-sidebar-toggle], [data-sidebar-search]")
    .forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
}

function showProjectDisplay() {
  const section = document.getElementById("projects");

  if (!section) {
    return;
  }

  closePortfolioSidebar();

  window.requestAnimationFrame(() => {
    const offset = section.getBoundingClientRect().top + window.scrollY - 84;

    window.scrollTo({
      top: offset,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

function showProjectCard(card) {
  if (!card) {
    return;
  }

  setProjectCardOpen(card, true);

  window.requestAnimationFrame(() => {
    const offset = card.getBoundingClientRect().top + window.scrollY - 84;

    window.scrollTo({
      top: offset,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

function renderProjectFilters(categories) {
  if (!projectFiltersElement) {
    return;
  }

  projectFiltersElement.innerHTML = categories
    .map((category) => {
      const activeClass = category === activeCategory ? "is-active" : "";
      const label = category === "all" ? "All" : category;

      return `
        <button
          type="button"
          class="filter-chip ${activeClass}"
          data-category="${escapeHtml(category)}"
          aria-pressed="${category === activeCategory ? "true" : "false"}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    })
    .join("");

  projectFiltersElement.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      renderProjectFilters(categories);
      renderProjects();
      showProjectDisplay();
    });
  });
}

function projectCardTemplate(project, index) {
  const panelId = `project-panel-${project.slug}`;
  const isPriorityProject = project.priority < 10;
  const compactHighlights = project.highlights.slice(0, 2);
  const compactTech = project.tech.slice(0, 5);
  const badge = project.featured
    ? '<span class="project-card__badge">Flagship</span>'
    : '<span class="project-card__badge project-card__badge--muted">Archive</span>';

  const githubLink = project.links.github
    ? `<a class="inline-link" href="${escapeHtml(project.links.github)}" target="_blank" rel="noreferrer">GitHub repo</a>`
    : "";

  const liveLink = project.links.live
    ? `<a class="inline-link" href="${escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Live build</a>`
    : "";

  const notesLink = project.links.notes
    ? `<a class="inline-link" href="${escapeHtml(project.links.notes)}" target="_blank" rel="noreferrer">Research paper</a>`
    : "";

  return `
    <article class="project-card project-card--compact ${project.featured ? "project-card--featured" : ""} ${isPriorityProject ? "project-card--priority" : ""} fade-in" data-project-card data-project-slug="${escapeHtml(project.slug)}">
      <div class="project-card__frame">
        <div class="project-card__visual" data-kind="${safeKind(project.kind)}">
          <div class="project-card__visual-top">
            <span class="project-card__serial">${String(index + 1).padStart(2, "0")}</span>
            ${badge}
          </div>
          <div class="project-card__visual-copy">
            <p>${escapeHtml(project.posterEyebrow)}</p>
            <h3>${escapeHtml(project.name)}</h3>
            <span>${escapeHtml(project.posterNote)}</span>
          </div>
        </div>

        <div class="project-card__body">
          <div class="project-card__meta-row">
            <span class="project-card__category">${escapeHtml(project.category)}</span>
            <span class="project-card__status">${escapeHtml(project.status)}</span>
          </div>

          <h3 class="project-card__title">${escapeHtml(project.name)}</h3>
          <p class="project-card__summary">${escapeHtml(project.summary)}</p>

          <div class="project-card__role">
            <span>Focus</span>
            <p>${escapeHtml(project.role)}</p>
          </div>

          <ul class="project-card__highlights project-card__highlights--compact">
            ${compactHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>

          <div class="project-card__tags project-card__tags--compact">
            ${compactTech.map((item) => `<span class="tech-tag">${escapeHtml(item)}</span>`).join("")}
          </div>

          <div class="project-card__footer">
            <div class="project-card__links">
              ${githubLink}
              ${liveLink}
              ${notesLink}
            </div>
            <button
              type="button"
              class="project-card__toggle"
              data-project-toggle
              aria-expanded="false"
              aria-controls="${escapeHtml(panelId)}"
            >
              <span data-project-toggle-text>View details</span>
            </button>
            <span class="project-card__updated">${escapeHtml(project.updated)}</span>
          </div>

          <div class="project-card__details" id="${escapeHtml(panelId)}" hidden>
            <div class="project-card__details-intro">
              <span>Why it matters</span>
              <p>${escapeHtml(project.impact)}</p>
            </div>

            <div class="project-card__details-intro">
              <span>Project highlights</span>
              <ul>
                ${project.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>

            ${projectDetailsTemplate(project)}

            <div class="project-card__tags">
              ${project.tech.map((item) => `<span class="tech-tag">${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function setProjectCardOpen(card, open) {
  const button = card.querySelector("[data-project-toggle]");
  const text = card.querySelector("[data-project-toggle-text]");
  const panel = button ? document.getElementById(button.getAttribute("aria-controls")) : null;

  if (!button || !panel) {
    return;
  }

  card.classList.toggle("project-card--open", open);
  button.setAttribute("aria-expanded", open ? "true" : "false");
  panel.hidden = !open;

  if (text) {
    text.textContent = open ? "Hide details" : "View details";
  }
}

function bindProjectCards() {
  if (!projectGridElement) {
    return;
  }

  projectGridElement.querySelectorAll("[data-project-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      const interactiveTarget = event.target.closest("a, button, input, textarea, select");

      if (interactiveTarget) {
        return;
      }

      card.querySelector("[data-project-toggle]")?.click();
    });
  });

  projectGridElement.querySelectorAll("[data-project-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-project-card]");

      if (!card) {
        return;
      }

      const shouldOpen = button.getAttribute("aria-expanded") !== "true";

      projectGridElement
        .querySelectorAll("[data-project-card]")
        .forEach((projectCard) => setProjectCardOpen(projectCard, false));

      setProjectCardOpen(card, shouldOpen);
    });
  });
}

function renderProjects() {
  if (!projectGridElement || !projectMetaElement || !projectsEmptyElement) {
    return;
  }

  const query = projectSearchElement ? projectSearchElement.value : "";
  const filteredProjects = filterProjects(allProjects, query, activeCategory);

  projectMetaElement.textContent = `${filteredProjects.length} project${
    filteredProjects.length === 1 ? "" : "s"
  } shown. Open a card to read the full build details.`;

  if (filteredProjects.length === 0) {
    projectGridElement.innerHTML = "";
    projectsEmptyElement.hidden = false;
    return;
  }

  projectsEmptyElement.hidden = true;
  projectGridElement.innerHTML = filteredProjects
    .map((project, index) => projectCardTemplate(project, index))
    .join("");
  bindProjectCards();

  requestAnimationFrame(() => {
    projectGridElement
      .querySelectorAll(".fade-in")
      .forEach((element) => element.classList.add("visible"));

    if (pendingProjectSlug) {
      const targetCard = projectGridElement.querySelector(
        `[data-project-slug="${CSS.escape(pendingProjectSlug)}"]`,
      );

      if (targetCard) {
        showProjectCard(targetCard);
        pendingProjectSlug = "";
      }
    }
  });
}

async function loadProjects() {
  if (!projectGridElement) {
    return;
  }

  try {
    const response = await fetch("data/projects.json");
    const payload = await response.json();

    allProjects = prepareProjects(payload.projects || []);
    renderHeroStats(buildProjectStats(allProjects));
    renderProjectFilters(getProjectCategories(allProjects));
    renderProjects();
  } catch (error) {
    console.error("Unable to load project data.", error);

    projectMetaElement.textContent = "Project data unavailable";
    projectGridElement.innerHTML = `
      <article class="empty-state">
        <h3>Project data did not load.</h3>
        <p>Try refreshing the page or opening the site from a local server.</p>
      </article>
    `;
  }
}

if (projectSearchElement) {
  projectSearchElement.addEventListener("input", () => {
    renderProjects();
  });

  projectSearchElement.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    renderProjects();
    showProjectDisplay();
  });
}

loadProjects();
