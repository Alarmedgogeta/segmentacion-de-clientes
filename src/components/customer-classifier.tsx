"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import type { ClassifierResult } from "@/lib/classifier-types";

type Field = "recency" | "frequency" | "monetary";
type Values = Record<Field, string>;
type Example = { label: string } & Record<Field, number>;

const fields = [
  {
    key: "recency",
    letter: "R",
    label: "Recencia",
    unit: "días",
    hint: "Días desde su última compra.",
    min: 0,
    step: "1",
  },
  {
    key: "frequency",
    letter: "F",
    label: "Frecuencia",
    unit: "compras",
    hint: "Número de compras en el período.",
    min: 1,
    step: "1",
  },
  {
    key: "monetary",
    letter: "M",
    label: "Valor monetario",
    unit: "u.m.",
    hint: "Valor del período, con margen ya integrado.",
    min: 0,
    step: "any",
  },
] as const;

function exampleValues(example: Example): Values {
  return {
    recency: String(example.recency),
    frequency: String(example.frequency),
    monetary: String(example.monetary),
  };
}

export default function CustomerClassifier({
  examples,
}: {
  examples: Example[];
}) {
  const [values, setValues] = useState<Values>(() =>
    exampleValues(examples[0]),
  );
  const [example, setExample] = useState("0");
  const [result, setResult] = useState<ClassifierResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<Field, string>>
  >({});
  const requestRef = useRef<AbortController | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (error) errorRef.current?.focus({ preventScroll: true });
  }, [error]);

  function clearResult() {
    requestRef.current?.abort();
    requestRef.current = null;
    setPending(false);
    setResult(null);
    setError("");
    setFieldErrors({});
  }

  async function classify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearResult();
    const errors: Partial<Record<Field, string>> = {};
    for (const field of fields) {
      const value = Number(values[field.key]);
      if (
        !values[field.key].trim() ||
        !Number.isFinite(value) ||
        value < field.min ||
        value > Number.MAX_SAFE_INTEGER ||
        (field.key !== "monetary" && !Number.isSafeInteger(value))
      ) {
        errors[field.key] =
          field.key === "monetary"
            ? "Escribe un importe válido igual o mayor que 0."
            : `Escribe un número entero igual o mayor que ${field.min}.`;
      }
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const first = fields.find((field) => errors[field.key]);
      formRef.current
        ?.querySelector<HTMLInputElement>(`[name="${first?.key}"]`)
        ?.focus();
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setPending(true);
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recency: Number(values.recency),
          frequency: Number(values.frequency),
          monetary: Number(values.monetary),
        }),
        signal: controller.signal,
      });
      if (requestRef.current !== controller) return;
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        if (requestRef.current !== controller) return;
        setFieldErrors(failure?.fields ?? {});
        setError(
          failure?.error ??
            "No se pudo clasificar el cliente. Intenta de nuevo.",
        );
        return;
      }
      const classification: ClassifierResult = await response.json();
      if (requestRef.current === controller) setResult(classification);
    } catch {
      if (requestRef.current === controller) {
        setError(
          controller.signal.aborted
            ? "La consulta tardó demasiado. Vuelve a intentar."
            : "No se pudo conectar con el clasificador. Vuelve a intentar.",
        );
      }
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setPending(false);
      }
    }
  }

  return (
    <div className="classifier-grid">
      <form
        ref={formRef}
        className="classifier-form"
        onSubmit={classify}
        noValidate
        aria-label="Datos del cliente"
      >
        <div className="classifier-example">
          <label htmlFor="classifier-example">Prueba un ejemplo</label>
          <select
            id="classifier-example"
            value={example}
            onChange={(event) => {
              clearResult();
              setExample(event.target.value);
              const selected = examples[Number(event.target.value)];
              if (selected) setValues(exampleValues(selected));
            }}
          >
            <option value="" disabled>
              Valores personalizados
            </option>
            {examples.map((item, index) => (
              <option key={item.label} value={index}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {error ? (
          <p
            ref={errorRef}
            className="classifier-error"
            role="alert"
            tabIndex={-1}
          >
            {error}
          </p>
        ) : null}
        <div className="classifier-fields">
          {fields.map((field) => (
            <div className="classifier-field" key={field.key}>
              <label htmlFor={`classifier-${field.key}`}>
                <span className="classifier-letter" aria-hidden="true">
                  {field.letter}
                </span>
                <span>
                  {field.label}
                  <small id={`classifier-${field.key}-hint`}>
                    {field.hint}
                  </small>
                </span>
              </label>
              <div className="classifier-input-wrap">
                <input
                  id={`classifier-${field.key}`}
                  name={field.key}
                  type="number"
                  inputMode={field.key === "monetary" ? "decimal" : "numeric"}
                  required
                  min={field.min}
                  max={Number.MAX_SAFE_INTEGER}
                  step={field.step}
                  value={values[field.key]}
                  aria-invalid={Boolean(fieldErrors[field.key])}
                  aria-describedby={`classifier-${field.key}-hint classifier-${field.key}-unit${fieldErrors[field.key] ? ` classifier-${field.key}-error` : ""}`}
                  onChange={(event) => {
                    clearResult();
                    setExample("");
                    setValues((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }));
                  }}
                />
                <span id={`classifier-${field.key}-unit`}>{field.unit}</span>
              </div>
              {fieldErrors[field.key] ? (
                <p
                  id={`classifier-${field.key}-error`}
                  className="classifier-field-error"
                  role="alert"
                >
                  {fieldErrors[field.key]}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <button type="submit" className="classifier-submit" disabled={pending}>
          {pending ? "Clasificando…" : "Clasificar cliente"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="classifier-privacy">
          Simulación sin guardar los datos del cliente.
        </p>
      </form>

      {/* biome-ignore lint/a11y/useSemanticElements: Reveal interpreta un section anidado como otra diapositiva. */}
      <div
        className="classifier-result"
        role="region"
        aria-label="Resultado de clasificación"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Permite desplazar el resultado y sus avisos con teclado.
        tabIndex={0}
        data-classifier-result
        aria-live="polite"
        aria-atomic="true"
        aria-busy={pending}
      >
        {result ? (
          <>
            <p className="classifier-eyebrow">
              <span style={{ backgroundColor: result.segment.color }} />
              Perfil del cliente
            </p>
            <h3>{result.segment.name}</h3>
            <p className="classifier-profile">{result.segment.profile}</p>
            <p className="sr-only">Código RFM {result.scores.code}</p>
            <div className="classifier-scores">
              {fields.map((field) => (
                <div key={field.key}>
                  <span>{field.letter}</span>
                  <strong>
                    {result.scores[field.key]}
                    <small>/ 5</small>
                  </strong>
                </div>
              ))}
            </div>
            <p className="classifier-rule">
              Regla aplicada: <strong>{result.rule.condition}</strong>
            </p>
            <div className="classifier-action">
              <h4>Acción sugerida</h4>
              <p>{result.segment.action}</p>
            </div>
            <p className="classifier-kpi">
              <strong>Medir en un piloto de 90 días</strong>
              {result.segment.kpi}
            </p>
            {result.warnings.length ? (
              <div className="classifier-warnings">
                {result.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="classifier-empty">
            <span className="classifier-eyebrow">
              Del comportamiento a la decisión
            </span>
            <div className="classifier-empty-code" aria-hidden="true">
              <span>R</span>
              <span>F</span>
              <span>M</span>
            </div>
            <h3>
              {pending ? "Consultando el perfil…" : "Un cliente. Tres señales."}
            </h3>
            <p>
              {pending
                ? "Estamos calculando sus puntajes y aplicando las reglas de segmentación."
                : "Ajusta los valores o elige un ejemplo. Al clasificar, verás su perfil, los puntajes y una acción para poner a prueba."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
