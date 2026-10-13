import test from "node:test";
import assert from "node:assert/strict";

import {
  buildProjectStats,
  filterProjects,
  getProjectCategories,
  prepareProjects,
} from "../js/project-data.mjs";

const rawProjects = [
  {
    name: "HerCare",
    category: "Health Tech",
    summary: "A care companion app for shift planning and wellness support.",
    tech: ["React 19", "TypeScript", "Capacitor", "Firebase"],
    featured: true,
    year: 2026,
    repo: "kylesantos0411/HerCare",
  },
  {
    name: "MICROTECT",
    category: "Research Systems",
    summary: "AI-powered microplastic detection using YOLO on Raspberry Pi.",
    tech: ["Python", "YOLOv11", "Raspberry Pi", "Computer Vision"],
    featured: true,
    year: 2026,
    repo: "kylesantos0411/MICROTECT",
    details: {
      problem: "Manual microscopy is slow and inconsistent.",
      hardware: ["Pi camera", "UV LEDs"],
      results: ["Detection consistency testing"],
    },
  },
  {
    name: "FLAMES",
    category: "Web Experiments",
    summary: "A playful compatibility calculator with animated results.",
    tech: ["HTML", "CSS", "JavaScript"],
    featured: false,
    year: 2026,
    repo: "kylesantos0411/flames_game",
  },
];

test("prepareProjects normalizes records and sorts featured work first", () => {
  const projects = prepareProjects(rawProjects);

  assert.equal(projects.length, 3);
  assert.equal(projects[0].name, "HerCare");
  assert.equal(projects[1].name, "MICROTECT");
  assert.equal(projects[2].name, "FLAMES");
  assert.equal(projects[0].slug, "hercare");
  assert.match(projects[1].searchText, /raspberry pi/);
  assert.equal(projects[1].details.problem, "Manual microscopy is slow and inconsistent.");
});

test("filterProjects matches against title, summary, repo, and tech tags", () => {
  const projects = prepareProjects(rawProjects);

  assert.deepEqual(
    filterProjects(projects, "yolo").map((project) => project.name),
    ["MICROTECT"],
  );

  assert.deepEqual(
    filterProjects(projects, "firebase").map((project) => project.name),
    ["HerCare"],
  );

  assert.deepEqual(
    filterProjects(projects, "microscopy").map((project) => project.name),
    ["MICROTECT"],
  );
});

test("filterProjects also supports category filtering", () => {
  const projects = prepareProjects(rawProjects);

  assert.deepEqual(
    filterProjects(projects, "", "Health Tech").map((project) => project.name),
    ["HerCare"],
  );

  assert.deepEqual(
    filterProjects(projects, "animated", "Web Experiments").map(
      (project) => project.name,
    ),
    ["FLAMES"],
  );
});

test("buildProjectStats summarizes totals for portfolio callouts", () => {
  const projects = prepareProjects(rawProjects);
  const stats = buildProjectStats(projects);

  assert.deepEqual(stats, {
    total: 3,
    featured: 2,
    categories: 3,
    technologies: 11,
  });
});

test("getProjectCategories creates a stable filter list", () => {
  const projects = prepareProjects(rawProjects);

  assert.deepEqual(getProjectCategories(projects), [
    "all",
    "Health Tech",
    "Research Systems",
    "Web Experiments",
  ]);
});
