export interface HighlightRule {
  text: string[];
  regex: string[];
  color?: string;
  backgroundColor?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  border?: string;
  borderRadius?: string;
}

export interface HighlightConfig {
  rules: HighlightRule[];
}
