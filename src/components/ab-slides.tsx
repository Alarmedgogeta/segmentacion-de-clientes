import {
  experimentDecisions,
  hypotheticalExperiment,
  hypotheticalResults,
  reactivationPopulations,
  retentionExperiments,
} from "@/data/ab-plan";
import { number } from "./charts";

function EconomicMetric() {
  return (
    <div className="ab-economic-metric">
      <strong>MargenIncremental90</strong>
      <span>Contribución neta media por asignado: B − A</span>
    </div>
  );
}

export function AbDesign() {
  return (
    <div className="ab-design">
      <div className="ab-comparison-flow">
        <div className="ab-population">
          <strong>Potenciales elegibles</strong>
          <span>
            Asignación al azar por cliente, persistente durante la prueba
          </span>
        </div>
        <div className="ab-branches">
          <article className="ab-arm ab-control">
            <span className="ab-arm-letter">A</span>
            <h3>Operación habitual</h3>
            <p>Sin recordatorio adicional.</p>
          </article>
          <article className="ab-arm ab-treatment">
            <span className="ab-arm-letter">B</span>
            <h3>Una intervención</h3>
            <p>Añadir un recordatorio personalizado por categoría.</p>
          </article>
        </div>
        <EconomicMetric />
        <p className="ab-flow-caption">
          Incluir a todos los asignados, aunque no abran, respondan o compren.
        </p>
      </div>
      <div className="ab-design-notes">
        <h3>Una comparación justa</h3>
        <dl>
          <div>
            <dt>Antes de asignar</dt>
            <dd>
              Fijar elegibilidad, segmento, categoría, cortes y fecha iniciales.
            </dd>
          </div>
          <div>
            <dt>Durante el seguimiento</dt>
            <dd>
              Misma ventana y reglas; evitar campañas incompatibles. Los datos
              faltantes no son cero compras.
            </dd>
          </div>
          <div>
            <dt>Una hipótesis concreta</dt>
            <dd>
              Si cambia mensaje, oferta y momento, evaluamos el paquete
              completo.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function AbRetention() {
  return (
    <div className="ab-retention">
      <EconomicMetric />
      <div className="ab-experiments">
        {retentionExperiments.map((experiment) => (
          <article className="ab-experiment-row" key={experiment.segment}>
            <div className="ab-experiment-population">
              <h3>{experiment.segment}</h3>
              <p>{number(experiment.customers)} clientes en la base</p>
            </div>
            <div className="ab-experiment-contrast">
              <p>
                <strong>A</strong>
                <span>{experiment.control}</span>
              </p>
              <p>
                <strong>B</strong>
                <span>{experiment.treatment}</span>
              </p>
            </div>
            <div className="ab-experiment-observe">
              <h4>Qué observar</h4>
              <p>{experiment.observe}</p>
              <small>Protección: {experiment.guardrail}</small>
            </div>
          </article>
        ))}
      </div>
      <p className="ab-sample-note">
        <strong>Reparto ilustrativo 50/50:</strong>{" "}
        {retentionExperiments
          .map((row) => `${row.segment} ${row.customers / 2} por brazo`)
          .join("; ")}
        . Antes de filtros; estos tamaños no garantizan potencia.
      </p>
    </div>
  );
}

export function AbReactivation() {
  return (
    <div className="ab-reactivation">
      <div className="ab-contact-panels">
        <article className="ab-contact-panel">
          <h3>Recuperación de alto valor</h3>
          <p className="ab-population-count">
            {reactivationPopulations.atRisk} en riesgo global · validar ciclo e
            historial
          </p>
          <dl className="ab-treatment-list">
            <div>
              <dt>A</dt>
              <dd>Operación habitual, sin invitación adicional.</dd>
            </div>
            <div>
              <dt>B</dt>
              <dd>Añadir una invitación personalizada a volver.</dd>
            </div>
          </dl>
          <p className="ab-panel-measure">
            <strong>Observar</strong> Reactivacion90 y Frecuencia90.
          </p>
          <p className="ab-panel-protection">
            Vigilar costo y bajas. Un incentivo se probaría en otro ensayo.
          </p>
          <p className="ab-panel-sample">
            50/50 antes de filtros: {reactivationPopulations.atRisk / 2} por
            brazo.
          </p>
        </article>
        <article className="ab-contact-panel">
          <h3>Contacto de bajo costo</h3>
          <p className="ab-population-count">
            {reactivationPopulations.occasional} Ocasionales recientes ·{" "}
            {reactivationPopulations.lowActivity} Baja actividad
          </p>
          <dl className="ab-treatment-list">
            <div>
              <dt>A</dt>
              <dd>Operación habitual, sin contacto experimental.</dd>
            </div>
            <div>
              <dt>B</dt>
              <dd>Añadir un mensaje automatizado adecuado a cada segmento.</dd>
            </div>
          </dl>
          <p className="ab-panel-measure">
            <strong>Observar</strong> Recompra/Ticket en Ocasionales;
            Reactivación/Costo en Baja actividad, a 90 días.
          </p>
          <p className="ab-panel-protection">
            Vigilar saturación y bajas; analizar cada segmento inicial.
          </p>
          <p className="ab-panel-sample">
            50/50: {reactivationPopulations.occasional / 2} y{" "}
            {reactivationPopulations.lowActivity / 2} por brazo, antes de
            filtros.
          </p>
        </article>
      </div>
      <EconomicMetric />
      <p className="ab-flow-caption">
        Continuar si la contribución adicional justifica el costo, con
        incertidumbre y límites de protección aceptables.
      </p>
    </div>
  );
}

export function AbPolicies() {
  return (
    <div className="ab-policies">
      <div className="ab-population">
        <strong>Una misma población elegible</strong>
        <span>
          Asignar al azar a cada cliente a una política antes de seleccionar
          contactos
        </span>
      </div>
      <div className="ab-branches">
        <article className="ab-arm ab-control">
          <span className="ab-arm-letter">A</span>
          <h3>Priorizar con RFM global</h3>
          <p>
            Seleccionar contactos dentro del grupo A usando los cortes de la
            cartera.
          </p>
        </article>
        <article className="ab-arm ab-treatment">
          <span className="ab-arm-letter">B</span>
          <h3>Priorizar por categoría</h3>
          <p>
            Seleccionar contactos dentro del grupo B usando referencias de su
            categoría.
          </p>
        </article>
      </div>
      <div className="ab-policy-conditions">
        <div>
          <h3>Mismos recursos</h3>
          <p>
            Igual presupuesto por elegible y capacidad de contacto equivalente.
          </p>
        </div>
        <div>
          <h3>Misma acción</h3>
          <p>Canal, oferta y calendario iguales para clientes comparables.</p>
        </div>
        <div>
          <h3>Reglas previas</h3>
          <p>
            Fijar prioridad, desempates y número de contactos antes de probar.
          </p>
        </div>
      </div>
      <div className="ab-policy-outcome">
        <strong>Medir por todos los asignados</strong>
        <span>
          Contribución neta media por asignado: B − A, incluidos los no
          contactados. Cobertura y composición explican la selección.
        </span>
      </div>
    </div>
  );
}

export function AbExample() {
  const a = hypotheticalResults.control;
  const b = hypotheticalResults.treatment;
  const repurchaseDifference = b.repurchaseRate - a.repurchaseRate;
  const netDifference = b.netPerAssigned - a.netPerAssigned;
  const rows = [
    ["Clientes asignados", number(a.assigned), number(b.assigned)],
    ["Clientes con ≥1 compra", number(a.buyers), number(b.buyers)],
    [
      "Recompra",
      `${number(a.repurchaseRate, 1)}%`,
      `${number(b.repurchaseRate, 1)}%`,
    ],
    [
      "Contribución antes de costos adicionales",
      number(a.contribution),
      number(b.contribution),
    ],
    [
      "Costos experimentales adicionales",
      number(a.additionalCosts),
      number(b.additionalCosts),
    ],
    [
      "Contribución neta total",
      number(a.netContribution),
      number(b.netContribution),
    ],
    [
      "Contribución neta por asignado",
      number(a.netPerAssigned),
      number(b.netPerAssigned),
    ],
  ];
  return (
    <div className="ab-example">
      <p className="ab-hypothetical-label">{hypotheticalExperiment.label}</p>
      <div className="ab-example-columns">
        <div>
          <table className="data-table ab-example-table">
            <caption>
              Potenciales · 90 días propuestos · importes en u.m.
            </caption>
            <thead>
              <tr>
                <th scope="col">Medida</th>
                <th scope="col">A: habitual</th>
                <th scope="col">B: recordatorio</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, control, treatment]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{control}</td>
                  <td>{treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ab-example-source">
            Solo el tamaño de referencia viene del segmento. El reparto y los
            resultados son inventados; 81 por brazo no acredita muestra
            suficiente.
          </p>
        </div>
        <div className="ab-example-reading">
          <figure className="ab-repurchase-chart">
            <figcaption>Recompra</figcaption>
            <p className="ab-example-delta">
              +{number(repurchaseDifference, 1)}{" "}
              <span>puntos porcentuales</span>
            </p>
            {[
              { label: "A", rate: a.repurchaseRate },
              { label: "B", rate: b.repurchaseRate },
            ].map((arm) => (
              <div className="ab-rate-row" key={arm.label}>
                <span>{arm.label}</span>
                <div className="ab-rate-track">
                  <span style={{ width: `${arm.rate}%` }} />
                </div>
                <strong>{number(arm.rate, 1)}%</strong>
              </div>
            ))}
            <p className="ab-rate-scale">Escala de las barras: 0–100%</p>
          </figure>
          <div className="ab-net-reading">
            <h3>Contribución neta por asignado</h3>
            <p>
              <span>
                A <strong>{number(a.netPerAssigned)}</strong>
              </span>
              <span>
                B <strong>{number(b.netPerAssigned)}</strong>
              </span>
            </p>
            <strong className="ab-net-delta">
              {number(netDifference)} u.m.
            </strong>
            <span>de diferencia B − A</span>
          </div>
          <p className="ab-example-interpretation">
            Más compradores, menor contribución neta observada. Revisar la
            economía y su incertidumbre antes de ampliar.
          </p>
        </div>
      </div>
    </div>
  );
}

function DecisionMark({ symbol }: { symbol: "check" | "uncertain" | "stop" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {symbol === "check" ? (
        <path d="m5 12 4 4L19 6" />
      ) : symbol === "stop" ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5m0 3h.01" />
        </>
      )}
    </svg>
  );
}

export function AbDecision() {
  return (
    <div className="ab-decision">
      <div className="ab-decision-paths">
        {experimentDecisions.map((decision) => (
          <article
            className={`ab-decision-path ab-decision-${decision.symbol}`}
            key={decision.outcome}
          >
            <span className="ab-decision-mark">
              <DecisionMark symbol={decision.symbol} />
            </span>
            <div>
              <h3>{decision.outcome}</h3>
              <p>{decision.evidence}</p>
            </div>
            <p className="ab-decision-action">{decision.action}</p>
          </article>
        ))}
      </div>
      <div className="ab-preregister">
        <h3>Dejar definido antes de lanzar</h3>
        <div>
          <p>
            <strong>Qué decide</strong> Métrica principal, mejora mínima útil e
            indicadores de protección.
          </p>
          <p>
            <strong>Cuánta muestra</strong> Tasa base o variabilidad, efecto
            mínimo, error y potencia elegidos.
          </p>
          <p>
            <strong>Cuándo cerrar</strong> Duración, seguimiento completo,
            criterios de parada y comparaciones previstas.
          </p>
        </div>
      </div>
      <p className="ab-flow-caption">
        Si solo alcanza para un piloto operativo, comprobar instrumentación y
        factibilidad; no prometer un impacto concluyente.
      </p>
    </div>
  );
}
