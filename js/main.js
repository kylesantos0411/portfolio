const themeToggle = document.getElementById("themeToggle");
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");
const typingText = document.getElementById("typingText");
const codeBg = document.getElementById("codeBg");
const copyEmailButton = document.getElementById("copyEmailButton");
const scrollProgress = document.getElementById("scrollProgress");
const currentYear = document.getElementById("currentYear");
const featurePopout = document.getElementById("featurePopout");
const portfolioSidebar = document.getElementById("portfolioSidebar");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateThemeIcons(theme) {
  if (!themeToggle) {
    return;
  }

  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  if (!sunIcon || !moonIcon) {
    return;
  }

  if (theme === "dark") {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateThemeIcons(nextTheme);
  });
}

function initializeNavigation() {
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });

    navLinks.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileToggle.classList.remove("active");
      });
    });
  }

  const sectionLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]:not([hidden])");

  const onScroll = () => {
    if (scrollProgress) {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }

    if (navbar) {
      navbar.classList.toggle("nav--scrolled", window.scrollY > 24);
    }

    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < bottom) {
        sectionLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  onScroll();
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const offset = target.getBoundingClientRect().top + window.scrollY - 84;

      window.scrollTo({
        top: offset,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
}

function initializeTyping() {
  if (!typingText) {
    return;
  }

  const phrases = [
    "AI-powered microplastic detection with Raspberry Pi",
    "embedded systems using ESP32, Arduino, and sensors",
    "YOLOv11 computer vision for real-world inspection",
    "hardware-software prototypes with testable results",
  ];

  if (prefersReducedMotion) {
    typingText.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const type = () => {
    const phrase = phrases[phraseIndex];
    typingText.textContent = deleting
      ? phrase.slice(0, characterIndex--)
      : phrase.slice(0, characterIndex++);

    let delay = deleting ? 35 : 65;

    if (!deleting && characterIndex > phrase.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && characterIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      characterIndex = 0;
      delay = 450;
    }

    window.setTimeout(type, delay);
  };

  type();
}

function initializeBackgroundTrace() {
  if (!codeBg) {
    return;
  }

  const snippets = [
    "RPI5 :: CAPTURE -> ANALYZE -> REPORT",
    "MICROTECT :: AI + HARDWARE",
    "YOLOV11 :: FIBERS + FRAGMENTS",
    "I2C / SPI / UART / GPIO",
    "signal quality matters",
    "frontend explains the system",
    "detect -> verify -> document",
    "prototype, measure, refine",
    "YOLO + touch UI + hardware loop",
    "PCB thinking meets product thinking",
    "design for operators and teammates",
    "mobile app with calm UX",
    "searchable electronics knowledge base",
    "clear handoff beats mystery",
  ];

  codeBg.innerHTML = Array.from({ length: 42 }, (_, index) => {
    return `${String(index + 1).padStart(2, "0")} :: ${snippets[index % snippets.length]}`;
  }).join("<br>");
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".fade-in");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initializeCopyEmail() {
  if (!copyEmailButton) {
    return;
  }

  copyEmailButton.addEventListener("click", async () => {
    const email = "kylesantos0411@gmail.com";
    const originalLabel = copyEmailButton.textContent;

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = "Copied";
    } catch (error) {
      copyEmailButton.textContent = email;
      console.error("Could not copy email.", error);
    }

    window.setTimeout(() => {
      copyEmailButton.textContent = originalLabel;
    }, 1800);
  });
}

function initializeCurrentYear() {
  if (!currentYear) {
    return;
  }

  currentYear.textContent = String(new Date().getFullYear());
}

function initializeFeaturePopouts() {
  if (!featurePopout) {
    return;
  }

  const openButtons = document.querySelectorAll("[data-feature-open]");
  const closeButtons = document.querySelectorAll("[data-feature-close]");
  const panel = featurePopout.querySelector(".feature-popout__panel");
  const contents = featurePopout.querySelectorAll("[data-feature-content]");
  const closeButton = featurePopout.querySelector(".feature-popout__close");

  const closeFeature = () => {
    featurePopout.hidden = true;
    document.body.classList.remove("feature-popout-open");
  };

  const openFeature = (featureName) => {
    let activeContent = null;

    contents.forEach((content) => {
      const isActive = content.dataset.featureContent === featureName;

      content.hidden = !isActive;
      content.classList.toggle("is-active", isActive);

      if (isActive) {
        activeContent = content;
      }
    });

    if (!activeContent) {
      return;
    }

    const heading = activeContent.querySelector("h2");

    if (heading && panel) {
      if (!heading.id) {
        heading.id = `feature-popout-title-${featureName}`;
      }

      panel.setAttribute("aria-labelledby", heading.id);
    }

    featurePopout.hidden = false;
    document.body.classList.add("feature-popout-open");
    closeButton?.focus({ preventScroll: true });
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openFeature(button.dataset.featureOpen);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeFeature);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !featurePopout.hidden) {
      closeFeature();
    }
  });
}

function setPortfolioSidebarOpen(open) {
  if (!portfolioSidebar) {
    return;
  }

  portfolioSidebar.classList.toggle("is-open", open);
  document.body.classList.toggle("portfolio-sidebar-open", open);

  portfolioSidebar.querySelectorAll("[data-sidebar-toggle], [data-sidebar-search]").forEach((button) => {
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function initializePortfolioSidebar() {
  if (!portfolioSidebar) {
    return;
  }

  setPortfolioSidebarOpen(false);

  portfolioSidebar.querySelectorAll("[data-sidebar-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      setPortfolioSidebarOpen(!portfolioSidebar.classList.contains("is-open"));
    });
  });

  portfolioSidebar.querySelectorAll("[data-sidebar-search]").forEach((button) => {
    button.addEventListener("click", () => {
      setPortfolioSidebarOpen(true);
      window.setTimeout(() => {
        document.getElementById("projectSearch")?.focus({ preventScroll: true });
      }, 180);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && portfolioSidebar.classList.contains("is-open")) {
      setPortfolioSidebarOpen(false);
    }
  });
}

initializeTheme();
initializeNavigation();
initializeSmoothScroll();
initializeTyping();
initializeBackgroundTrace();
initializeRevealAnimations();
initializeCopyEmail();
initializeCurrentYear();
initializePortfolioSidebar();
initializeFeaturePopouts();

console.log(
  [
    "Portfolio loaded for Kyle Santos",
    "GitHub  : https://github.com/kylesantos0411",
    "LinkedIn: https://www.linkedin.com/in/santos-kyle-a-14287b349",
    "Email   : kylesantos0411@gmail.com",
    "Focus   : embedded systems + AI computer vision",
  ].join("\n"),
);
