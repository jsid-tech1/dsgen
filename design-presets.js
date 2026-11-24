(() => {
  // Each family ships with one preset per brief. Briefs also tune component
  // geometry, so two presets in the same family can differ without recoloring.
  const briefs = [
    ["general", "", 0, 0],
    ["analytics", "analytics dashboard metrics reporting kpi data insights", -2, -2],
    ["finance", "finance banking investment fintech payments budget", -1, -2],
    ["commerce", "shop ecommerce retail store checkout marketplace", 1, 0],
    ["portfolio", "portfolio agency studio designer showcase case study", 4, 1],
    ["fitness", "fitness workout training exercise gym activity", 2, 2],
    ["wellness", "wellness sleep meditation mindfulness calm yoga", 6, 3],
    ["health", "health healthcare clinic patient medical appointment", 2, 3],
    ["education", "education learning school course students classroom", 3, 2],
    ["kids", "kids children preschool family toys playful", 8, 1],
    ["gaming", "gaming esports arcade game leaderboard", -3, 2],
    ["music", "music audio playlist radio streaming podcast", 4, 0],
    ["photo", "photo photography gallery image camera visual", 2, -1],
    ["publishing", "editorial magazine article news blog publication", -2, 4],
    ["travel", "travel hotel booking vacation tourism maps itinerary", 5, 2],
    ["food", "food restaurant menu recipes delivery cafe", 6, 1],
    ["events", "event events ticket concert conference festival", 1, 4],
    ["productivity", "productivity task planner project workflow to do", 0, -3],
    ["developer", "developer code api terminal docs documentation", -4, -2],
    ["enterprise", "enterprise corporate operations admin crm internal", -3, -3],
    ["social", "social community chat messaging forum network", 7, -1],
    ["smart-home", "smart home iot devices controls thermostat", 5, -2],
    ["luxury", "luxury premium fashion beauty boutique elegant", -4, 4],
    ["nonprofit", "nonprofit charity donation volunteer fundraising", 1, 3],
  ];

  // Family rows define button radius, padding, border, and surface treatment.
  const families = {
    Minimalist: ["minimalist", 4, 11, 1, "flat"],
    Modern: ["modern", 11, 13, 0, "raised"],
    Brutalist: ["brutalist", 0, 12, 3, "raw"],
    "Neo-Brutalist": ["neo-brutalist", 5, 13, 2, "offset"],
    Neumorphic: ["neumorphic", 16, 14, 0, "soft"],
    Glassmorphism: ["glassmorphism", 14, 12, 0, "glass"],
    "Material Design": ["material-design", 22, 12, 0, "raised"],
    Editorial: ["editorial", 1, 13, 1, "rule"],
    Playful: ["playful", 21, 14, 0, "cushion"],
    Corporate: ["corporate", 7, 11, 1, "flat"],
    "Flat Design": ["flat-design", 3, 12, 0, "flat"],
  };

  const words = (value) => value.toLowerCase().match(/[a-z0-9]+/g) || [];
  const compositions = {
    compact: ["analytics", "finance", "productivity", "developer", "enterprise", "smart-home"],
    showcase: ["portfolio", "photo", "music", "travel", "luxury", "events"],
    reading: ["education", "publishing", "health", "nonprofit", "wellness"],
  };
  const catalog = Object.freeze(Object.entries(families).flatMap(
    ([style, [family, radius, padding, border, treatment]]) => briefs.map(
      ([brief, keywords, curve, density]) => Object.freeze({
        id: family + ":" + brief,
        style,
        composition: Object.keys(compositions).find(key => compositions[key].includes(brief)) || "standard",
        keywords: Object.freeze(words(keywords)),
        radius: style === "Brutalist" ? 0 : Math.max(0, radius + curve),
        padding: padding + density,
        border,
        treatment,
      }),
    ),
  ));
  const byId = new Map(catalog.map((preset) => [preset.id, preset]));
  const fonts = Object.freeze({
    Inter: "sans-serif", Arial: "sans-serif", Verdana: "sans-serif",
    "Trebuchet MS": "sans-serif", Georgia: "serif", "Times New Roman": "serif",
    "Courier New": "monospace", "Segoe UI": "sans-serif", Tahoma: "sans-serif",
    "DM Sans": "sans-serif", "Space Grotesk": "sans-serif", "IBM Plex Mono": "monospace",
    "Instrument Serif": "serif", "Nunito": "sans-serif", "Roboto": "sans-serif",
  });
  const recommendations = {
    Minimalist: ["Inter", "DM Sans"], Modern: ["DM Sans", "Space Grotesk"],
    Brutalist: ["IBM Plex Mono", "Arial"], "Neo-Brutalist": ["Space Grotesk", "IBM Plex Mono"],
    Neumorphic: ["Nunito", "DM Sans"], Glassmorphism: ["DM Sans", "Inter"],
    "Material Design": ["Roboto", "Inter"], Editorial: ["Instrument Serif", "Georgia"],
    Playful: ["Nunito", "Trebuchet MS"], Corporate: ["Inter", "Segoe UI"],
    "Flat Design": ["Inter", "Roboto"],
  };
  const hasFont = (name) => Object.hasOwn(fonts, name);

  function select({ styles, description = "", custom = "" }) {
    const terms = new Set(words(description + (styles.includes("Custom Style") ? " " + custom : "")));
    let best = null;
    let bestScore = -1;
    for (const style of styles) {
      for (const preset of catalog) {
        if (preset.style !== style) continue;
        const score = preset.keywords.filter((word) => terms.has(word)).length;
        if (score > bestScore) {
          best = preset;
          bestScore = score;
        }
      }
    }
    return best;
  }

  const channels = (hex) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  function mix(color, base, amount) {
    const other = channels(base);
    return "#" + channels(color).map((value, index) =>
      Math.round(value * amount + other[index] * (1 - amount)).toString(16).padStart(2, "0"),
    ).join("");
  }
  function ink(color) {
    const luminance = channels(color).map((value) => {
      const s = value / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    return luminance >= Math.sqrt(1.05 * 0.05) - 0.05 ? "#000000" : "#ffffff";
  }

  globalThis.designPresets = Object.freeze({
    catalog, select, get: (id) => byId.get(id), mix, ink, fonts, hasFont,
    suggestedFonts: (style) => recommendations[style] || ["Inter", "DM Sans"],
  });
})();
