const collator = new Intl.Collator("en", { sensitivity: "base" });

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function toLinkMap(raw = {}) {
  return {
    github: raw.github || null,
    live: raw.live || null,
    notes: raw.notes || null,
  };
}

function toDetails(raw = {}) {
  return {
    problem: raw.problem || "",
    solution: raw.solution || "",
    architecture: raw.architecture || "",
    hardware: toArray(raw.hardware),
    software: raw.software || "",
    results: toArray(raw.results),
    challenges: toArray(raw.challenges),
  };
}

export function normalizeProject(raw = {}) {
  const name = raw.name || "Untitled Project";
  const repo = raw.repo || "";
  const tech = toArray(raw.tech);
  const highlights = toArray(raw.highlights);
  const links = toLinkMap(raw.links);
  const details = toDetails(raw.details);

  if (!links.github && repo) {
    links.github = `https://github.com/${repo}`;
  }

  const searchText = [
    name,
    raw.category,
    raw.summary,
    raw.impact,
    raw.role,
    repo,
    raw.posterEyebrow,
    raw.posterNote,
    details.problem,
    details.solution,
    details.architecture,
    details.software,
    ...tech,
    ...highlights,
    ...details.hardware,
    ...details.results,
    ...details.challenges,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    slug: slugify(raw.slug || name),
    name,
    repo,
    year: Number(raw.year) || new Date().getFullYear(),
    priority: Number(raw.priority) || 999,
    updated: raw.updated || "",
    category: raw.category || "General",
    status: raw.status || "In progress",
    featured: Boolean(raw.featured),
    summary: raw.summary || "",
    impact: raw.impact || "",
    role: raw.role || "",
    tech,
    highlights,
    posterEyebrow: raw.posterEyebrow || raw.category || "Project",
    posterNote: raw.posterNote || raw.summary || "",
    kind: raw.kind || "general",
    details,
    links,
    searchText,
  };
}

export function prepareProjects(rawProjects = []) {
  return rawProjects
    .map(normalizeProject)
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }

      if (left.year !== right.year) {
        return right.year - left.year;
      }

      return collator.compare(left.name, right.name);
    });
}

export function filterProjects(projects, query = "", category = "all") {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const normalizedCategory = String(category || "all").trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      normalizedCategory === "all" ||
      project.category.toLowerCase() === normalizedCategory;

    const matchesQuery =
      !normalizedQuery || project.searchText.includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function buildProjectStats(projects) {
  const categories = new Set();
  const technologies = new Set();
  let featured = 0;

  projects.forEach((project) => {
    categories.add(project.category);
    project.tech.forEach((item) => technologies.add(item));

    if (project.featured) {
      featured += 1;
    }
  });

  return {
    total: projects.length,
    featured,
    categories: categories.size,
    technologies: technologies.size,
  };
}

export function getProjectCategories(projects) {
  const categories = [];

  projects.forEach((project) => {
    if (!categories.includes(project.category)) {
      categories.push(project.category);
    }
  });

  return ["all", ...categories];
}
