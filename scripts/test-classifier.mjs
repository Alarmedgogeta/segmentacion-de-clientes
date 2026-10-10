import assert from "node:assert/strict";
import { test } from "node:test";
import notebookData from "../src/data/notebook-data.json" with { type: "json" };
import {
  classifyClient,
  validateClassifierInput,
} from "../src/lib/classifier.ts";

const baseline = { recency: 3, frequency: 6, monetary: 200 };

test("reproduce los seis ejemplos RFM verificados del notebook", () => {
  for (const [index, example] of notebookData.scoring.examples.entries()) {
    const result = classifyClient({
      recency: example.Recency,
      frequency: example.Frequency,
      monetary: example.Monetary,
    });
    assert.equal(result.segment.name, example.segment);
    assert.deepEqual(result.scores, {
      recency: example.R_Score,
      frequency: example.F_Score,
      monetary: example.M_Score,
      code: example.RFM_Score,
    });
    assert.equal(result.rule.priority, index + 1);
    assert.equal(result.rule.condition, notebookData.scoring.rules[index].rule);
    assert.equal(
      result.segment.profile,
      notebookData.scoring.rules[index].interpretation,
    );
    assert.equal(result.segment.color, notebookData.segments[index].color);
    assert.equal(result.segment.action, notebookData.actionPlans[index].action);
    assert.equal(result.segment.kpi, notebookData.actionPlans[index].kpis);
    assert.deepEqual(result.warnings, []);
  }
});

test("respeta cada corte de recencia con intervalos cerrados por la derecha", () => {
  const cases = [
    [0, 5],
    [2, 5],
    [3, 4],
    [4, 4],
    [5, 3],
    [7, 3],
    [8, 2],
    [12, 2],
    [13, 1],
    [24, 1],
  ];
  for (const [recency, expected] of cases) {
    assert.equal(
      classifyClient({ ...baseline, recency }).scores.recency,
      expected,
      `Recencia ${recency}`,
    );
  }
});

test("respeta cada corte de frecuencia sin dividir los empates", () => {
  const cases = [
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 3],
    [6, 4],
    [7, 4],
    [8, 5],
    [12, 5],
  ];
  for (const [frequency, expected] of cases) {
    assert.equal(
      classifyClient({ ...baseline, frequency }).scores.frequency,
      expected,
      `Frecuencia ${frequency}`,
    );
  }
});

test("respeta cada corte monetario, incluidos decimales y valores contiguos", () => {
  const cases = [
    [0, 1],
    [25, 1],
    [25.01, 2],
    [56.25, 2],
    [56.26, 3],
    [120, 3],
    [120.01, 4],
    [450, 4],
    [450.01, 5],
    [2100, 5],
  ];
  for (const [monetary, expected] of cases) {
    assert.equal(
      classifyClient({ ...baseline, monetary }).scores.monetary,
      expected,
      `Monetary ${monetary}`,
    );
  }
});

test("distingue Campeones, Leales y riesgo por sus umbrales de prioridad", () => {
  assert.equal(classifyClient(baseline).segment.name, "Campeones");
  assert.equal(
    classifyClient({ ...baseline, recency: 5 }).segment.name,
    "Leales",
  );
  assert.equal(
    classifyClient({ ...baseline, monetary: 120 }).segment.name,
    "Leales",
  );
  assert.equal(
    classifyClient({ recency: 8, frequency: 6, monetary: 10 }).segment.name,
    "En riesgo de alto valor",
  );
  assert.equal(
    classifyClient({ recency: 8, frequency: 1, monetary: 120.01 }).segment.name,
    "En riesgo de alto valor",
  );
  assert.equal(
    classifyClient({ recency: 8, frequency: 5, monetary: 120 }).segment.name,
    "Baja actividad y valor",
  );
});

test("advierte fuera de los rangos observados y conserva los cortes globales", () => {
  const input = { recency: 25, frequency: 13, monetary: 2100.01 };
  assert.equal(validateClassifierInput(input).valid, true);
  const result = classifyClient(input);
  assert.equal(result.scores.code, "155");
  assert.equal(result.warnings.length, 3);
  assert.match(result.warnings[0], /0–24 días/);
  assert.match(result.warnings[1], /1–12 compras/);
  assert.match(result.warnings[2], /6.25–2100 u.m./);
  assert.equal(classifyClient({ ...baseline, monetary: 0 }).warnings.length, 1);
  assert.deepEqual(
    classifyClient({ recency: 24, frequency: 12, monetary: 2100 }).warnings,
    [],
  );
});

test("acepta ceros válidos y decimales solo en Monetary", () => {
  const input = { recency: 0, frequency: 1, monetary: 0 };
  assert.deepEqual(validateClassifierInput(input), { valid: true, input });
  assert.equal(
    validateClassifierInput({ ...baseline, monetary: 56.251 }).valid,
    true,
  );
});

test("rechaza cuerpos que no son objetos y campos ausentes", () => {
  for (const value of [null, undefined, [], "cliente", 1, true]) {
    assert.equal(validateClassifierInput(value).valid, false);
  }
  const result = validateClassifierInput({});
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.error.fields), [
    "recency",
    "frequency",
    "monetary",
  ]);
});

test("rechaza coerción implícita, números no finitos y magnitudes no seguras", () => {
  for (const field of ["recency", "frequency", "monetary"]) {
    for (const value of [
      "2",
      "",
      null,
      true,
      [],
      {},
      undefined,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.MAX_SAFE_INTEGER + 1,
      -1,
    ]) {
      const result = validateClassifierInput({ ...baseline, [field]: value });
      assert.equal(result.valid, false, `${field}: ${String(value)}`);
      assert.ok(result.error.fields[field]);
    }
  }
  assert.equal(
    validateClassifierInput({ ...baseline, frequency: 0 }).valid,
    false,
  );
  for (const field of ["recency", "frequency"]) {
    assert.equal(
      validateClassifierInput({ ...baseline, [field]: 1.5 }).valid,
      false,
    );
  }
});
