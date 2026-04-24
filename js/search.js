let electronicsData = [];

const searchInput = document.getElementById("electronicsSearch");
const resultsContainer = document.getElementById("electronicsResults");
const noResultsMessage = document.getElementById("noResults");

const categoryIcons = {
  Components: "CMP",
  Microcontrollers: "MCU",
  Protocols: "BUS",
  Topics: "REF",
  Tools: "LAB",
};

const itemCodes = {
  resistor: "R",
  capacitor: "C",
  transistor: "BJT",
  led: "LED",
  inductor: "L",
  "op-amp": "AMP",
  "sensor-temp": "TEMP",
  "sensor-ultrasonic": "US",
  "arduino-uno": "UNO",
  "arduino-nano": "NANO",
  esp32: "ESP",
  esp8266: "8266",
  "raspberry-pi": "PI",
  stm32: "STM",
  attiny85: "AVR",
  teensy: "ARM",
  i2c: "I2C",
  spi: "SPI",
  uart: "UART",
  mqtt: "MQTT",
  "can-bus": "CAN",
  "one-wire": "1W",
  "pcb-design": "PCB",
  "embedded-systems": "EMB",
  "power-electronics": "PWR",
  iot: "IOT",
  "motor-control": "PWM",
  "signal-processing": "DSP",
  oscilloscope: "DSO",
  multimeter: "DMM",
  "logic-analyzer": "LA",
  "soldering-iron": "SOLD",
  "power-supply": "PSU",
  "function-generator": "FUNC",
  "3d-printer": "CAD",
};

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

function itemCode(item) {
  return itemCodes[item.id] || categoryIcons[item.category] || "EE";
}

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function linkTemplate(url, label) {
  if (!url || !isAllowedUrl(url)) {
    return "";
  }

  return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" class="electronics__item-link">${label}</a>`;
}

function renderMessage(message) {
  if (!resultsContainer) {
    return;
  }

  resultsContainer.innerHTML = `
    <article class="empty-state">
      <h3>${escapeHtml(message)}</h3>
      <p>Reload the page or run the site from a local server if this keeps happening.</p>
    </article>
  `;
}

function displayResults(items) {
  if (!resultsContainer || !noResultsMessage) {
    return;
  }

  if (!items.length) {
    resultsContainer.innerHTML = "";
    noResultsMessage.hidden = false;
    return;
  }

  noResultsMessage.hidden = true;

  resultsContainer.innerHTML = items
    .map((item) => {
      const links = item.links || {};
      const category = escapeHtml(item.category);
      const name = escapeHtml(item.name);
      const description = escapeHtml(item.description);

      return `
        <article class="electronics__item fade-in">
          <div class="electronics__item-header">
            <div class="electronics__item-icon">${escapeHtml(itemCode(item))}</div>
            <div>
              <span class="electronics__item-category">${category}</span>
              <h3 class="electronics__item-name">${name}</h3>
            </div>
          </div>

          <p class="electronics__item-description">${description}</p>

          <div class="electronics__item-links">
            ${linkTemplate(links.documentation, "Documentation")}
            ${linkTemplate(links.datasheet, "Datasheet")}
            ${linkTemplate(links.tutorial, "Tutorial")}
          </div>
        </article>
      `;
    })
    .join("");

  requestAnimationFrame(() => {
    resultsContainer
      .querySelectorAll(".fade-in")
      .forEach((element) => element.classList.add("visible"));
  });
}

function searchElectronics(query) {
  if (!query.trim()) {
    displayResults(electronicsData.slice(0, 8));
    return;
  }

  const searchTerm = query.toLowerCase();
  const results = electronicsData.filter((item) => {
    if (String(item.name || "").toLowerCase().includes(searchTerm)) {
      return true;
    }

    if (String(item.category || "").toLowerCase().includes(searchTerm)) {
      return true;
    }

    if (String(item.description || "").toLowerCase().includes(searchTerm)) {
      return true;
    }

    return Array.isArray(item.keywords)
      ? item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
      : false;
  });

  displayResults(results);
}

function debounce(callback, wait) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}

async function loadElectronicsData() {
  if (!searchInput || !resultsContainer || !noResultsMessage) {
    return;
  }

  try {
    const response = await fetch("data/electronics.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const payload = await response.json();
    electronicsData = payload.items || [];
    displayResults(electronicsData.slice(0, 8));
  } catch (error) {
    console.error("Unable to load electronics data.", error);
    renderMessage("Electronics data did not load.");
  }
}

if (searchInput) {
  const debouncedSearch = debounce((event) => {
    searchElectronics(event.target.value);
  }, 220);

  searchInput.addEventListener("input", debouncedSearch);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchElectronics(searchInput.value);
    }
  });
}

loadElectronicsData();
