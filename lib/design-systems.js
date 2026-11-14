import { createHash } from "node:crypto";

export const SYSTEM_SCHEMA_VERSION = 1;

const platforms = new Set(["mobile", "web", "both"]);
const styles = new Set([
  "Minimalist", "Modern", "Brutalist", "Neo-Brutalist", "Neumorphic",
  "Glassmorphism", "Material Design", "Editorial", "Playful", "Corporate", "Custom Style",
]);
const devices = new Set(["phone", "tablet", "laptop"]);
const colorPattern = /^#[0-9a-f]{6}$/i;

export class InvalidSystemError extends Error {}

function exactKeys(value, allowed) {
  return value && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).every((key) => allowed.includes(key));
}

function boundedText(value, maxLength) {
  return typeof value === "string" && value.length <= maxLength;
}

function validColor(value) {
  return typeof value === "string" && colorPattern.test(value);
}

function requireColorMap(value, keys) {
  if (!exactKeys(value, keys) || keys.some((key) => !validColor(value[key]))) {
    throw new InvalidSystemError("invalid-colors");
  }
  return Object.fromEntries(keys.map((key) => [key, value[key].toLowerCase()]));
}

function validateTextList(value, allowed, maxItems) {
  return Array.isArray(value) && value.length <= maxItems &&
    value.every((item) => typeof item === "string" && allowed.has(item)) &&
    new Set(value).size === value.length;
}

export function normalizeSystemInput(input) {
  if (!exactKeys(input, ["schemaVersion", "name", "description", "wizard", "tokens", "components", "editor"]) ||
      input.schemaVersion !== SYSTEM_SCHEMA_VERSION ||
      !boundedText(input.name, 80) || !input.name.trim() ||
      !boundedText(input.description, 300) ||
      !exactKeys(input.wizard, ["platform", "styles", "customStyleDescription", "projectDescription", "selectedColors"]) ||
      !platforms.has(input.wizard.platform) ||
      !validateTextList(input.wizard.styles, styles, 11) ||
      !boundedText(input.wizard.customStyleDescription, 120) ||
      !boundedText(input.wizard.projectDescription, 300) ||
      !exactKeys(input.tokens, ["colors", "typography"]) ||
      !exactKeys(input.tokens.typography, ["fontFamily", "scale"]) ||
      input.tokens.typography.fontFamily !== "Inter" ||
      !exactKeys(input.tokens.typography.scale, ["body", "heading", "display"]) ||
      input.tokens.typography.scale.body !== 16 ||
      input.tokens.typography.scale.heading !== 24 ||
      input.tokens.typography.scale.display !== 32 ||
      !exactKeys(input.components, ["buttons", "cards"]) ||
      JSON.stringify(input.components.buttons) !== JSON.stringify(["Primary", "Secondary", "Tertiary"]) ||
      JSON.stringify(input.components.cards) !== JSON.stringify(["Default", "Featured"]) ||
      !exactKeys(input.editor, ["previewDevice"]) ||
      !devices.has(input.editor.previewDevice)) {
    throw new InvalidSystemError("invalid-system");
  }

  return {
    schemaVersion: SYSTEM_SCHEMA_VERSION,
    name: input.name.trim(),
    description: input.description.trim(),
    wizard: {
      platform: input.wizard.platform,
      styles: [...input.wizard.styles],
      customStyleDescription: input.wizard.customStyleDescription.trim(),
      projectDescription: input.wizard.projectDescription.trim(),
      selectedColors: requireColorMap(input.wizard.selectedColors, ["primary", "secondary", "accent"]),
    },
    tokens: {
      colors: requireColorMap(input.tokens.colors, ["primary", "secondary", "accent", "surface"]),
      typography: {
        fontFamily: "Inter",
        scale: { body: 16, heading: 24, display: 32 },
      },
    },
    components: {
      buttons: ["Primary", "Secondary", "Tertiary"],
      cards: ["Default", "Featured"],
    },
    editor: { previewDevice: input.editor.previewDevice },
  };
}

export function makePrivateSystem(input, { uid, now, existing = null, source = null }) {
  return {
    ...normalizeSystemInput(input),
    ownerUid: uid,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    sharing: existing?.sharing ?? { visibility: "private", status: "draft", publishedAt: null },
    source: existing?.source ?? source ?? { type: "original", systemId: null, creatorId: null, creatorName: null },
  };
}

export function publicSystemProjection(system, id, creatorId, creatorName, publishedAt) {
  return {
    schemaVersion: system.schemaVersion,
    id,
    name: system.name,
    description: system.description,
    wizard: {
      platform: system.wizard.platform,
      styles: [...system.wizard.styles],
      customStyleDescription: system.wizard.customStyleDescription,
    },
    tokens: system.tokens,
    components: system.components,
    creatorId,
    creatorName,
    copiedFrom: system.source?.type === "copy" && typeof system.source.systemId === "string"
      ? {
          systemId: system.source.systemId,
          systemName: boundedText(system.source.systemName, 80) ? system.source.systemName : "Design system",
          creatorId: typeof system.source.creatorId === "string" ? system.source.creatorId : "",
          creatorName: boundedText(system.source.creatorName, 100) ? system.source.creatorName : "DSGen creator",
        }
      : null,
    publishedAt,
    status: "published",
  };
}

export function publicSystemResponse(value) {
  if (!value || value.status !== "published") return null;
  if (typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value.id) ||
      typeof value.creatorId !== "string" || !/^[a-f0-9]{24}$/.test(value.creatorId) ||
      !boundedText(value.name, 80) || !value.name.trim() ||
      !boundedText(value.description, 300) ||
      !boundedText(value.creatorName, 100) || !value.creatorName.trim()) return null;
  const colorKeys = ["primary", "secondary", "accent", "surface"];
  const colors = {};
  for (const key of colorKeys) {
    const candidate = value.tokens?.colors?.[key];
    if (!validColor(candidate)) return null;
    colors[key] = candidate.toLowerCase();
  }
  const publicStyles = Array.isArray(value.wizard?.styles)
    ? value.wizard.styles.filter((style) => styles.has(style)).slice(0, 11)
    : [];
  return {
    schemaVersion: SYSTEM_SCHEMA_VERSION,
    id: value.id,
    name: value.name,
    description: value.description,
    wizard: {
      platform: platforms.has(value.wizard?.platform) ? value.wizard.platform : "web",
      styles: publicStyles,
      customStyleDescription: boundedText(value.wizard?.customStyleDescription, 120)
        ? value.wizard.customStyleDescription
        : "",
    },
    tokens: {
      colors,
      typography: {
        fontFamily: "Inter",
        scale: { body: 16, heading: 24, display: 32 },
      },
    },
    components: { buttons: ["Primary", "Secondary", "Tertiary"], cards: ["Default", "Featured"] },
    creatorId: value.creatorId,
    creatorName: value.creatorName.trim(),
    copiedFrom: value.copiedFrom && typeof value.copiedFrom.systemId === "string"
      ? {
          systemId: value.copiedFrom.systemId,
          systemName: boundedText(value.copiedFrom.systemName, 80) ? value.copiedFrom.systemName : "Design system",
          creatorId: typeof value.copiedFrom.creatorId === "string" && /^[a-f0-9]{24}$/.test(value.copiedFrom.creatorId)
            ? value.copiedFrom.creatorId
            : "",
          creatorName: boundedText(value.copiedFrom.creatorName, 100) ? value.copiedFrom.creatorName : "DSGen creator",
        }
      : null,
    publishedAt: Number.isFinite(value.publishedAt) ? value.publishedAt : 0,
    status: "published",
  };
}

export function creatorIdForUid(uid) {
  // Stable opaque public identifier; the UID itself is never included in public payloads.
  return createHash("sha256").update(uid).digest("hex").slice(0, 24);
}

