import notebookData from "./notebook-data.json";

// Propuestas didácticas: no son resultados experimentales del notebook.
function customers(segment: string) {
  const profile = notebookData.segments.find((row) => row.segment === segment);
  if (!profile) throw new Error(`No se encontró el segmento ${segment}.`);
  return profile.customers;
}

export const retentionExperiments = [
  {
    segment: "Campeones",
    customers: customers("Campeones"),
    control: "Servicio y contactos habituales.",
    treatment: "Añadir acceso anticipado a novedades.",
    observe: "Recompra90 · CompraOtraCategoria90",
    guardrail: "Costos de servicio, devoluciones y bajas.",
  },
  {
    segment: "Leales",
    customers: customers("Leales"),
    control: "Experiencia habitual de compra.",
    treatment: "Añadir una recomendación de complemento.",
    observe: "Frecuencia90 · Ticket90",
    guardrail: "Costos de atención, devoluciones y bajas.",
  },
  {
    segment: "Potenciales",
    customers: customers("Potenciales"),
    control: "Sin recordatorio adicional.",
    treatment: "Añadir un recordatorio por categoría, sin descuento.",
    observe: "Recompra90 · Recurrencia90",
    guardrail: "Costo de contacto y bajas de comunicación.",
  },
] as const;

export const reactivationPopulations = {
  atRisk: customers("En riesgo de alto valor"),
  occasional: customers("Ocasionales recientes"),
  lowActivity: customers("Baja actividad y valor"),
};

// El tamaño de referencia procede de Potenciales. El reparto y TODAS las
// compras, contribuciones y costos son supuestos, no datos de una campaña.
const assignedPerArm = customers("Potenciales") / 2;
export const hypotheticalExperiment = {
  label: "Ejemplo hipotético: no son resultados de la base",
  control: {
    assigned: assignedPerArm,
    buyers: 16,
    contribution: 1296,
    additionalCosts: 0,
  },
  treatment: {
    assigned: assignedPerArm,
    buyers: 24,
    contribution: 1458,
    additionalCosts: 243,
  },
} as const;

function experimentMetrics(
  arm:
    | typeof hypotheticalExperiment.control
    | typeof hypotheticalExperiment.treatment,
) {
  const netContribution = arm.contribution - arm.additionalCosts;
  return {
    ...arm,
    repurchaseRate: (arm.buyers / arm.assigned) * 100,
    netContribution,
    netPerAssigned: netContribution / arm.assigned,
  };
}

export const hypotheticalResults = {
  control: experimentMetrics(hypotheticalExperiment.control),
  treatment: experimentMetrics(hypotheticalExperiment.treatment),
};

export const experimentDecisions = [
  {
    outcome: "Ampliar",
    symbol: "check",
    evidence:
      "Ganancia superior al mínimo útil, con precisión suficiente y sin deterioro inaceptable.",
    action: "Escalar gradualmente a clientes comparables y vigilar el efecto.",
  },
  {
    outcome: "Inconcluso",
    symbol: "uncertain",
    evidence:
      "La incertidumbre admite tanto una mejora útil como ausencia de mejora o daño.",
    action:
      "Mantener la política actual y planear otra prueba o una muestra mayor.",
  },
  {
    outcome: "Descartar o rediseñar",
    symbol: "stop",
    evidence:
      "Daño respaldado, costo inviable o incumplimiento de límites operativos.",
    action: "Revisar la intervención antes de volver a probarla.",
  },
] as const;
