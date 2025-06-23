export interface HighlightRule {
  text: string[];
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
