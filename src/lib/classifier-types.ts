export type ClassifierInput = {
  recency: number;
  frequency: number;
  monetary: number;
};

export type ClassifierResult = {
  segment: {
    name: string;
    color: string;
    profile: string;
    action: string;
    kpi: string;
  };
  scores: {
    recency: number;
    frequency: number;
    monetary: number;
    code: string;
  };
  rule: {
    priority: number;
    condition: string;
  };
  warnings: string[];
};

export type ClassifierError = {
  error: string;
  fields?: Record<string, string>;
};
