figma.showUI(__html__, { width: 360, height: 280 });

function rgb(value) {
  if (typeof value !== "string") throw new Error("Missing color token.");
  if (/^#[a-f\d]{6}$/i.test(value)) {
    return { r: parseInt(value.slice(1, 3), 16) / 255, g: parseInt(value.slice(3, 5), 16) / 255, b: parseInt(value.slice(5), 16) / 255, a: 1 };
  }
  const srgb = /^color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)$/.exec(value);
  if (srgb) return { r: +srgb[1], g: +srgb[2], b: +srgb[3], a: +(srgb[4] ?? 1) };
  const match = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(value);
  if (!match) throw new Error("Unsupported color token.");
  return { r: +match[1] / 255, g: +match[2] / 255, b: +match[3] / 255, a: +(match[4] ?? 1) };
}

let importing = false;
figma.ui.onmessage = async ({ json }) => {
  if (importing) return;
  importing = true;
  let sheet, collection;
  const styles = [];
  try {
    if (typeof json !== "string" || json.length > 100000) throw new Error("Paste a DSGen JSON export.");
    const { format, version, system, samples } = JSON.parse(json);
    if (format !== "dsgen-figma" || version !== 1 || !system?.tokens || !samples) throw new Error("This is not a DSGen export.");
    const { colors, typography } = system.tokens;
    const palette = Object.fromEntries(["primary", "secondary", "accent", "surface"].map(role => [role, rgb(colors[role])]));
    const preferred = { family: typography.fontFamily, style: "Regular" };
    let font = preferred;
    try {
      await figma.loadFontAsync(font);
    } catch {
      font = { family: "Inter", style: "Regular" };
      await figma.loadFontAsync(font);
    }
    const name = String(system.name || "Design system").slice(0, 80);
    collection = figma.variables.createVariableCollection(name);
    function variable(path, type, value) {
      const token = figma.variables.createVariable(path, collection, type);
      token.setValueForMode(collection.defaultModeId, value);
      return token;
    }
    function paint(token) {
      const { r, g, b } = token.valuesByMode[collection.defaultModeId];
      return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r, g, b } }, "color", token);
    }
    const paletteTokens = Object.fromEntries(Object.entries(palette).map(([role, value]) => [role, variable("Color/" + role, "COLOR", value)]));
    variable("Typography/Family", "STRING", typography.fontFamily);
    const type = {};
    for (const role of ["body", "heading", "display"]) {
      const size = typography.scale[role];
      if (!Number.isFinite(size) || size < 1 || size > 200) throw new Error("Invalid typography size.");
      const style = figma.createTextStyle();
      styles.push(style);
      style.name = name + "/" + role;
      style.fontName = font;
      style.fontSize = size;
      type[role] = { style, size: variable("Typography/" + role, "FLOAT", size) };
    }
    const ink = variable("Color/Ink", "COLOR", { r: 0.09, g: 0.09, b: 0.09, a: 1 });
    function layout(node, direction = "VERTICAL") {
      node.layoutMode = direction;
      node.primaryAxisSizingMode = "AUTO";
      node.counterAxisSizingMode = "AUTO";
      node.itemSpacing = 12;
      return node;
    }
    const textBindings = [];
    function label(parent, value, role = "body", color = ink) {
      const node = figma.createText();
      parent.appendChild(node);
      node.fontName = font;
      node.characters = String(value ?? "").slice(0, 400);
      textBindings.push(async () => {
        await node.setTextStyleIdAsync(type[role].style.id);
        node.setBoundVariable("fontSize", type[role].size);
        node.fills = [paint(color)];
      });
      return node;
    }
    function component(group, title, spec, card) {
      const node = layout(figma.createComponent());
      sheet.appendChild(node);
      node.name = group + "/" + title;
      const path = group + "/" + title + "/";
      const fill = rgb(spec.fill);
      const role = Object.keys(palette).find(key => ["r","g","b","a"].every(channel => palette[key][channel] === fill[channel]));
      node.fills = [paint(role ? paletteTokens[role] : variable(path + "Fill", "COLOR", fill))];
      const textColor = variable(path + "Text", "COLOR", rgb(spec.text));
      const fields = { topLeftRadius: spec.radius, topRightRadius: spec.radius, bottomLeftRadius: spec.radius,
        bottomRightRadius: spec.radius, paddingTop: spec.paddingY, paddingBottom: spec.paddingY,
        paddingLeft: spec.paddingX, paddingRight: spec.paddingX, strokeWeight: spec.strokeWidth };
      const numbers = new Map();
      for (const [field, value] of Object.entries(fields)) {
        const numeric = Number.isFinite(value) ? Math.max(0, Math.min(500, value)) : 0;
        const key = field.endsWith("Radius") ? "Radius" : field.startsWith("padding") ? (field.endsWith("Top") || field.endsWith("Bottom") ? "Padding Y" : "Padding X") : "Stroke width";
        if (!numbers.has(key)) numbers.set(key, variable(path + key, "FLOAT", numeric));
        node[field] = numeric;
        node.setBoundVariable(field, numbers.get(key));
      }
      if (spec.strokeWidth > 0) node.strokes = [paint(variable(path + "Stroke", "COLOR", rgb(spec.stroke)))];
      label(node, card?.title || title, card ? "heading" : "body", textColor);
      if (card?.metric) label(node, card.metric, "display", textColor);
      if (card?.description) label(node, card.description, "body", textColor);
      return node;
    }
    sheet = layout(figma.createFrame());
    sheet.name = name;
    sheet.paddingLeft = sheet.paddingRight = sheet.paddingTop = sheet.paddingBottom = 24;
    sheet.fills = [paint(paletteTokens.surface)];
    label(sheet, name, "display");
    if (system.description) label(sheet, system.description);
    for (const [role, token] of Object.entries(paletteTokens)) {
      const row = layout(figma.createFrame(), "HORIZONTAL");
      sheet.appendChild(row);
      row.fills = [];
      const swatch = figma.createRectangle();
      row.appendChild(swatch);
      swatch.resize(24, 24);
      swatch.fills = [paint(token)];
      label(row, role + " " + colors[role]);
    }
    for (const role of Object.keys(type)) label(sheet, "Aa · " + role + " · " + typography.scale[role] + " px", role);
    const buttons = system.components.buttons.slice(0, 3).map((title, i) => component("Buttons", title, samples.buttons[i]));
    const cards = system.components.cards.slice(0, 2).map((title, i) => component("Cards", title, samples.surfaces[i], samples.cards[i]));
    await Promise.all(textBindings.map(bind => bind()));
    const preview = layout(figma.createFrame());
    sheet.appendChild(preview);
    preview.name = "Component preview";
    preview.fills = [];
    for (const source of [buttons[0], ...cards]) preview.appendChild(source.createInstance());
    sheet.x = figma.viewport.center.x;
    sheet.y = figma.viewport.center.y;
    figma.currentPage.selection = [sheet];
    figma.viewport.scrollAndZoomIntoView([sheet]);
    figma.ui.postMessage({ status: font === preferred ? "Imported editable components and variables." : "Imported. Inter was used because the selected font was unavailable." });
  } catch (error) {
    sheet?.remove();
    styles.forEach(style => style.remove());
    collection?.remove();
    figma.ui.postMessage({ status: error.message || "Import failed." });
  } finally {
    importing = false;
  }
};
