export interface ProItem {
  id: string;
  title: string;
  description: string;
  strength: number; // 1 to 5
  dimension: string; // e.g., Technology, Personal, Financial
  impact: string; // e.g., High, Medium, Low
}

export interface ConItem {
  id: string;
  title: string;
  description: string;
  severity: number; // 1 to 5
  dimension: string; // e.g., Technology, Personal, Financial
  impact: string; // e.g., High, Medium, Low
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparisonRow {
  aspect: string;
  optionA: string;
  optionB: string;
  winner: "A" | "B" | "Tie";
}

export interface ComparisonTable {
  optionAName: string;
  optionBName: string;
  rows: ComparisonRow[];
}

export interface WebNode {
  id: string;
  label: string;
  type: "decision" | "pro" | "con" | "factor";
  score: number; // 1 to 5 index for importance/weight
  description: string;
}

export interface WebLink {
  source: string;
  target: string;
  relationship: "supports" | "opposes" | "neutral";
}

export interface DecisionGraph {
  nodes: WebNode[];
  links: WebLink[];
}

export interface DecisionAnalysis {
  id: string;
  topic: string;
  createdAt: string;
  summary: string;
  verdict: string;
  dimensions: string[];
  pros: ProItem[];
  cons: ConItem[];
  swot: SWOTAnalysis;
  comparison: ComparisonTable;
  graph: DecisionGraph;
}

export interface SavedDecisionHeader {
  id: string;
  topic: string;
  createdAt: string;
  verdict: string;
}
