import type { Config } from "tailwindcss";

/*
  Design tokens live in src/app/globals.css as CSS custom properties.
  This config only maps Tailwind utility names to those variables —
  changing a color means editing globals.css, not this file.
*/

// Helper: build an RGB-with-alpha CSS expression that respects Tailwind's
// /<alpha-value> opacity modifier (e.g. bg-secondary/40).
const c = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: c("background"),
        surface: c("surface"),
        "surface-dim": c("surface-dim"),
        "surface-bright": c("surface-bright"),
        "surface-container-lowest": c("surface-container-lowest"),
        "surface-container-low": c("surface-container-low"),
        "surface-container": c("surface-container"),
        "surface-container-high": c("surface-container-high"),
        "surface-container-highest": c("surface-container-highest"),
        "on-surface": c("on-surface"),
        "on-surface-variant": c("on-surface-variant"),
        "on-background": c("on-background"),
        outline: c("outline"),
        "outline-variant": c("outline-variant"),
        border: c("border"),
        primary: c("primary"),
        "primary-container": c("primary-container"),
        "on-primary": c("on-primary"),
        "on-primary-container": c("on-primary-container"),
        "primary-fixed": c("primary-fixed"),
        "on-primary-fixed": c("on-primary-fixed"),
        secondary: c("secondary"),
        "secondary-container": c("secondary-container"),
        "on-secondary": c("on-secondary"),
        "on-secondary-container": c("on-secondary-container"),
        "secondary-fixed": c("secondary-fixed"),
        "secondary-fixed-dim": c("secondary-fixed-dim"),
        "on-secondary-fixed": c("on-secondary-fixed"),
        "tertiary-fixed": c("tertiary-fixed"),
        "on-tertiary-fixed": c("on-tertiary-fixed"),
        "on-tertiary-fixed-variant": c("on-tertiary-fixed-variant"),
        "on-tertiary-container": c("on-tertiary-container"),
        error: c("error"),
        "error-container": c("error-container"),
        "on-error-container": c("on-error-container"),
        success: c("success"),
        warning: c("warning"),
        danger: c("danger"),
        "success-container": c("success-container"),
        "on-success-container": c("on-success-container"),
        "warning-container": c("warning-container"),
        "on-warning-container": c("on-warning-container"),
        "danger-container": c("danger-container"),
        "on-danger-container": c("on-danger-container"),
        "error-subtle": c("error-subtle"),
        "error-subtle-border": c("error-subtle-border"),
        placeholder: c("placeholder"),
        "primary-hover": c("primary-hover"),
        "primary-disabled": c("primary-disabled"),
        "secondary-hover": c("secondary-hover"),
        "secondary-disabled": c("secondary-disabled"),
        "danger-hover": c("danger-hover"),
        "danger-disabled": c("danger-disabled"),
        "inspire-from": c("inspire-from"),
        "inspire-via": c("inspire-via"),
        "inspire-to": c("inspire-to"),
      },
      fontFamily: {
        display: ["var(--font-hanken)", "Hanken Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "title-sm": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "metadata-xs": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "mono-label": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        gutter: "var(--gutter)",
        "container-max": "var(--container-max)",
      },
      maxWidth: {
        "container-max": "var(--container-max)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};

export default config;
