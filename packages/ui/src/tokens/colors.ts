// Semantic tokens — light mode (source of truth: docs/nico.dev.br.pen)
export const light = {
  background: "#F8F9FF",
  foreground: "#252742",

  surface: "#FFFFFF",
  "surface-raised": "#EDEDF8",
  "surface-overlay": "#E4E6F8",

  primary: "#5546E8",
  "primary-foreground": "#FFFFFF",
  "primary-hover": "#4032D6",

  secondary: "#8B5CF6",
  "secondary-foreground": "#FFFFFF",

  muted: "#EDEDF8",
  "muted-foreground": "#5A5C82",

  accent: "#EBE9FF",
  "accent-foreground": "#4032D6",

  destructive: "#CF2E2E",
  "destructive-foreground": "#FFFFFF",

  success: "#0F7A41",
  "success-foreground": "#FFFFFF",

  warning: "#C96D00",
  "warning-foreground": "#FFFFFF",

  border: "#DDE0F5",
  input: "#DDE0F5",
  ring: "#5546E8",

  "badge-destructive-bg": "#FFE4E4",
  "badge-success-bg": "#DCFCE7",
  "badge-warning-bg": "#FEF3C7",
  "badge-destructive-fg": "#B42323",
  "badge-warning-fg": "#9A5200",
} as const;

// Semantic tokens — dark mode (source of truth: docs/nico.dev.br.pen)
export const dark = {
  background: "#12131F",
  foreground: "#E6E7F4",

  surface: "#191A2C",
  "surface-raised": "#21233A",
  "surface-overlay": "#2C2F52",

  primary: "#6B5CF8",
  "primary-foreground": "#FFFFFF",
  "primary-hover": "#8073FF",

  secondary: "#BF81FF",
  "secondary-foreground": "#12131F",

  muted: "#191A2C",
  "muted-foreground": "#8A8CB0",

  accent: "#1D2040",
  "accent-foreground": "#A89BFF",

  destructive: "#FF4444",
  "destructive-foreground": "#FFFFFF",

  success: "#1ED97A",
  "success-foreground": "#12131F",

  warning: "#FFAA20",
  "warning-foreground": "#12131F",

  border: "#262850",
  input: "#262850",
  ring: "#6B5CF8",

  "badge-destructive-bg": "#2D1215",
  "badge-success-bg": "#0E2418",
  "badge-warning-bg": "#261A00",
  "badge-destructive-fg": "#FF4444",
  "badge-warning-fg": "#FFAA20",
} as const;

export type ColorToken = keyof typeof light;
