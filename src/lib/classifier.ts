import notebookData from "../data/notebook-data.json" with { type: "json" };
import type {
  ClassifierError,
  ClassifierInput,
  ClassifierResult,
} from "./classifier-types";

type ValidationResult =
  | { valid: true; input: ClassifierInput }
  | { valid: false; error: ClassifierError };

const variables = [
  { field: "recency", source: "Recency", label: "Recencia", unit: "días" },
  {
    field: "frequency",
    source: "Frequency",
    label: "Frecuencia",
    unit: "compras",
  },
  { field: "monetary", source: "Monetary", label: "Monetary", unit: "u.m." },
] as const;

export function validateClassifierInput(value: unknown): ValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      valid: false,
      error: {
        error: "Envía un objeto JSON con recency, frequency y monetary.",
      },
    };
  }

  const input = value as Record<string, unknown>;
  const fields: Record<string, string> = {};

  for (const { field, label } of variables) {
    const number = input[field];
    if (
      typeof number !== "number" ||
      !Number.isFinite(number) ||
      number > Number.MAX_SAFE_INTEGER
    ) {
      fields[field] =
        `${label} debe ser un número finito que no supere ${Number.MAX_SAFE_INTEGER}.`;
    } else if (field === "monetary") {
      if (number < 0) fields[field] = "Monetary debe ser mayor o igual que 0.";
    } else if (
      !Number.isSafeInteger(number) ||
      number < (field === "frequency" ? 1 : 0)
    ) {
      fields[field] =
        field === "frequency"
          ? "La frecuencia debe ser un entero mayor o igual que 1."
          : "La recencia debe ser un entero mayor o igual que 0.";
    }
  }

  if (Object.keys(fields).length > 0) {
    return {
      valid: false,
      error: { error: "Revisa los datos del cliente.", fields },
    };
  }

  return {
    valid: true,
    input: {
      recency: input.recency as number,
      frequency: input.frequency as number,
      monetary: input.monetary as number,
    },
  };
}

function score(value: number, variable: "Recency" | "Frequency" | "Monetary") {
  // pd.cut(..., right=True): a value on a cut stays in the lower interval.
  const interval = notebookData.scoring.cuts.filter(
    (cut) => value > cut[variable],
  ).length;
  return variable === "Recency" ? 5 - interval : 1 + interval;
}

export function classifyClient(input: ClassifierInput): ClassifierResult {
  const recency = score(input.recency, "Recency");
  const frequency = score(input.frequency, "Frequency");
  const monetary = score(input.monetary, "Monetary");
  const champions = recency >= 4 && frequency >= 4 && monetary >= 4;

  // Same mutually exclusive rules and order as notebook cell 19.
  const matches = [
    champions,
    recency >= 3 && frequency >= 4 && !champions,
    recency >= 3 && frequency <= 3 && monetary >= 3,
    recency >= 3 && frequency <= 3 && monetary <= 2,
    recency <= 2 && (frequency >= 4 || monetary >= 4),
    recency <= 2 && frequency <= 3 && monetary <= 3,
  ];
  const ruleIndex = matches.findIndex(Boolean);
  const rule = notebookData.scoring.rules[ruleIndex];
  const segment = notebookData.segments.find(
    (item) => item.segment === rule.segment,
  );
  const plan = notebookData.actionPlans.find(
    (item) => item.segment === rule.segment,
  );

  if (!segment || !plan) {
    throw new Error("La configuración del clasificador está incompleta.");
  }

  const warnings: string[] = [];
  for (const { field, source, label, unit } of variables) {
    const observed = notebookData.descriptives.find(
      (item) => item.variable === source,
    );
    if (
      observed &&
      (input[field] < observed.min || input[field] > observed.max)
    ) {
      warnings.push(
        `${label} está fuera del rango observado (${observed.min}–${observed.max} ${unit}). Se aplicaron los mismos cortes; interpreta el perfil con cautela.`,
      );
    }
  }

  return {
    segment: {
      name: segment.segment,
      color: segment.color,
      profile: rule.interpretation,
      action: plan.action,
      kpi: plan.kpis,
    },
    scores: {
      recency,
      frequency,
      monetary,
      code: `${recency}${frequency}${monetary}`,
    },
    rule: { priority: ruleIndex + 1, condition: rule.rule },
    warnings,
  };
}
