import type { ReactNode } from "react";
import data from "@/data/notebook-data.json";
import { Bars, colors, Histogram, number, Scatter } from "./charts";
import DeckShell from "./deck-shell";

const slides = [
  {
    id: "inicio",
    chapter: "La pregunta",
    title: "Conocer mejor para decidir mejor",
  },
  { id: "datos", chapter: "Entender", title: "Una base, mil clientes" },
  {
    id: "descriptivos",
    chapter: "Entender",
    title: "El promedio no cuenta toda la historia",
  },
  {
    id: "region-genero",
    chapter: "Entender",
    title: "Dónde aparecen las diferencias",
  },
  {
    id: "categorias",
    chapter: "Entender",
    title: "La categoría cambia la lectura",
  },
  {
    id: "distribuciones",
    chapter: "Entender",
    title: "Tres señales del comportamiento",
  },
  {
    id: "puntajes",
    chapter: "Segmentar",
    title: "De valores a puntajes comparables",
  },
  {
    id: "reglas",
    chapter: "Segmentar",
    title: "Seis perfiles, seis decisiones",
  },
  { id: "ejemplos", chapter: "Segmentar", title: "Del código RFM al segmento" },
  {
    id: "perfiles",
    chapter: "Interpretar",
    title: "El perfil completo de la cartera",
  },
  {
    id: "valor-frecuencia",
    chapter: "Interpretar",
    title: "Recurrencia y valor no son lo mismo",
  },
  {
    id: "dispersion",
    chapter: "Interpretar",
    title: "La misma frecuencia, valores distintos",
  },
  {
    id: "sensibilidad",
    chapter: "Interpretar",
    title: "Importa con quién comparamos",
  },
  { id: "retener", chapter: "Actuar", title: "Retener sin regalar el margen" },
  {
    id: "desarrollar",
    chapter: "Actuar",
    title: "Dar una buena razón para volver",
  },
  { id: "reactivar", chapter: "Actuar", title: "Revisar antes de reactivar" },
  {
    id: "indicadores",
    chapter: "Medir",
    title: "Definir qué significa mejorar",
  },
  { id: "piloto", chapter: "Medir", title: "Probar, comparar y aprender" },
  {
    id: "limites",
    chapter: "Medir",
    title: "El valor futuro todavía está abierto",
  },
  {
    id: "decisiones",
    chapter: "Decidir",
    title: "Cinco decisiones para poner a prueba",
  },
] as const;

function Slide({
  index,
  title,
  lead,
  children,
  note,
  className = "",
}: {
  index: number;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={slides[index].id}
      className={`slide ${className}`}
      aria-labelledby={`${slides[index].id}-title`}
    >
      <div className="slide-body">
        <div className="slide-kicker">
          <span>{slides[index].chapter}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h2 id={`${slides[index].id}-title`}>{title}</h2>
        {lead && <p className="slide-lead">{lead}</p>}
        <div className="slide-content">{children}</div>
        {note && <aside className="slide-note">{note}</aside>}
      </div>
    </section>
  );
}

type Group = (typeof data.groupSummaries.Region)[number];
function GroupTable({ rows, label }: { rows: Group[]; label: string }) {
  return (
    <table className="data-table">
      <caption>{label}</caption>
      <thead>
        <tr>
          <th scope="col">Grupo</th>
          <th scope="col">Clientes</th>
          <th scope="col">Ticket</th>
          <th scope="col">Frequency</th>
          <th scope="col">Monetary</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.group}>
            <th scope="row">{row.group}</th>
            <td>{number(row.customers)}</td>
            <td>{number(row.ticketMean, 2)}</td>
            <td>{number(row.frequencyMean, 2)}</td>
            <td>{number(row.monetaryMean, 2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Actions({ start }: { start: number }) {
  return (
    <div className="action-grid">
      {data.actionPlans.slice(start, start + 2).map((plan, offset) => {
        const index = start + offset;
        return (
          <article
            className="action-plan"
            key={plan.segment}
            style={{ borderColor: colors[index] }}
          >
            <div className="segment-label">
              <i style={{ background: colors[index] }} />
              {plan.segment}
            </div>
            <p className="action-profile">{plan.profile}</p>
            <h3>
              {
                [
                  "Cuidar la relación",
                  "Elevar el valor de cada visita",
                  "Desarrollar recurrencia",
                  "Mantener un contacto útil",
                  "Entender el ciclo de compra",
                  "Acotar la inversión",
                ][index]
              }
            </h3>
            <p className="action-description">{plan.action}</p>
            <div className="action-measure">
              <span>Lo mediríamos con</span>
              <ul>
                {plan.kpis
                  .replace(/\.$/, "")
                  .split("; ")
                  .map((kpi) => (
                    <li key={kpi}>{kpi}</li>
                  ))}
              </ul>
            </div>
            <p className="action-caution">
              <strong>Qué cuidar.</strong> {plan.consideration}
            </p>
          </article>
        );
      })}
    </div>
  );
}

const metricLabels: Record<string, string> = {
  Age: "Edad · años",
  "Average ticket": "Ticket · u.m.",
  Recency: "Recency · días",
  Frequency: "Frequency · compras",
  Monetary: "Monetary · u.m.",
};
const scoreIntervals = [
  ["5", "≤ 2", "> 7", "> 450"],
  ["4", "(2, 4]", "(5, 7]", "(120, 450]"],
  ["3", "(4, 7]", "(3, 5]", "(56.25, 120]"],
  ["2", "(7, 12]", "(2, 3]", "(25, 56.25]"],
  ["1", "> 12", "≤ 2", "≤ 25"],
];
const kpiDefinitions = [
  ["Recompra90", "Clientes con ≥1 compra / clientes asignados × 100."],
  ["Recurrencia90", "Clientes con ≥2 compras / clientes asignados × 100."],
  [
    "CompraOtraCategoria90",
    "Clientes que compran fuera de su categoría principal inicial / asignados × 100. No exige que sea una categoría nueva.",
  ],
  [
    "Reactivacion90",
    "Clientes del segmento de menor actividad que vuelven a comprar / asignados de ese segmento × 100.",
  ],
  [
    "Frecuencia90",
    "Compras totales / clientes asignados, incluidos quienes no compran.",
  ],
  [
    "Ticket90",
    "Ventas netas / compras. Es un promedio por compra, distinto del ticket promedio por cliente del perfil.",
  ],
  [
    "CostoReactivacion90",
    "Costo de campaña / compradores del tratamiento. No mide el costo por reactivación incremental.",
  ],
  [
    "MargenIncremental90",
    "Contribución media neta de costos adicionales en tratamiento, menos la misma media en control.",
  ],
];

export default function Presentation() {
  return (
    <DeckShell slides={slides}>
      <Slide
        index={0}
        title={
          <>
            Conocer mejor.
            <br />
            Decidir mejor.
          </>
        }
        className="cover"
        note="Análisis RFM · 1,000 clientes · seis segmentos"
      >
        <div className="cover-grid">
          <div>
            <p className="cover-intro">
              ¿A quién conviene retener, desarrollar o recuperar?
            </p>
            <p className="cover-description">
              Leímos el comportamiento de compra para proponer acciones
              distintas y decidir cómo medirlas.
            </p>
            <div className="journey">
              <span>Entender</span>
              <span>Segmentar</span>
              <span>Actuar</span>
              <span>Medir</span>
            </div>
          </div>
          <div className="cover-evidence">
            <p>Campeones + Leales</p>
            <div className="hero-number">
              {number(data.priorities[0].customerShare, 1)}
              <span>%</span>
            </div>
            <p>de los clientes concentran</p>
            <div className="value-ribbon">
              <strong>{number(data.priorities[0].monetaryShare, 2)}%</strong>
              <span>del valor monetario histórico</span>
            </div>
            <small>Una primera señal para ordenar prioridades.</small>
          </div>
        </div>
      </Slide>

      <Slide
        index={1}
        title="Una base, mil clientes."
        lead="Primero comprobamos que estábamos mirando a la misma población, una sola vez."
        note="Usamos el CSV como entrada. Recency está en días; la moneda, el período de Frequency/Monetary y la fecha de corte no están especificados."
      >
        <div className="quality-strip">
          <div>
            <strong>1,000</strong>
            <span>clientes únicos</span>
          </div>
          <div>
            <strong>10</strong>
            <span>variables</span>
          </div>
          <div>
            <strong>0</strong>
            <span>faltantes y duplicados</span>
          </div>
          <div>
            <strong>CSV = XLSX</strong>
            <span>mismos datos, no se suman</span>
          </div>
        </div>
        <div className="two-col">
          <div>
            <h3>Qué contiene cada fila</h3>
            <dl className="definition-list">
              <div>
                <dt>Identidad</dt>
                <dd>ID y Customer ID: identificadores, no medidas.</dd>
              </div>
              <div>
                <dt>Perfil</dt>
                <dd>Región, género, edad y categoría de producto.</dd>
              </div>
              <div>
                <dt>Compra</dt>
                <dd>Ticket promedio, Recency, Frequency y Monetary.</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3>Qué revisamos</h3>
            <ul className="check-list">
              <li>Unicidad y equivalencia entre formatos.</li>
              <li>Valores finitos y rangos válidos según la variable.</li>
              <li>Enteros en recencia y frecuencia; etiquetas limpias.</li>
              <li>
                Versiones y huellas de archivos para reproducir el análisis.
              </li>
            </ul>
            <p className="quiet">
              Sin alertas en estas validaciones. Conservamos todos los registros
              y los archivos originales.
            </p>
          </div>
        </div>
      </Slide>

      <Slide
        index={2}
        title="El promedio no cuenta toda la historia."
        lead="Monetary tiene una cola de clientes de mayor valor: su media supera ampliamente a la mediana."
        note="Monetary ya integra el margen: no aplicamos otra tasa ni lo multiplicamos nuevamente por Frequency."
      >
        <div className="two-col wide-left">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">Media</th>
                <th scope="col">Mediana</th>
                <th scope="col">Mín.–máx.</th>
              </tr>
            </thead>
            <tbody>
              {data.descriptives.map((row) => (
                <tr key={row.variable}>
                  <th scope="row">{metricLabels[row.variable]}</th>
                  <td>{number(row.mean, 2)}</td>
                  <td>{number(row.median, 2)}</td>
                  <td>
                    {number(row.min, 2)}–{number(row.max, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="insight-column">
            <div>
              <h3>Observar no es eliminar</h3>
              <p>
                La regla de 1.5 IQR señala <strong>55</strong> casos en Recency
                y <strong>83</strong> en Monetary. Los conservamos: no son
                errores demostrados.
              </p>
            </div>
            <div>
              <h3>Una estructura muy regular</h3>
              <p>
                El ticket toma cinco valores. Monetary ÷ (ticket × Frequency)
                solo toma <strong>25%, 30% y 35%</strong>.
              </p>
              <p className="quiet">
                Esa regularidad exige cautela al generalizar a un negocio real.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      <Slide
        index={3}
        title="Dónde aparecen las diferencias."
        lead="Región y género aportan contexto, pero no explican por sí solos a quién conviene priorizar."
        note="Comparaciones descriptivas, sin afirmar causalidad. Los promedios son por cliente; el ticket no está ponderado por compras. Importes en u.m."
      >
        <div className="two-col">
          <div>
            <GroupTable rows={data.groupSummaries.Region} label="Por región" />
            <p className="takeaway">
              S lidera ticket y Monetary; N presenta la mayor frecuencia.
            </p>
          </div>
          <div>
            <GroupTable
              rows={data.groupSummaries.Gender}
              label="Por género · etiquetas originales"
            />
            <div className="small-spotlight">
              <strong>0.20%</strong>
              <p>
                de diferencia entre el mayor y el menor ticket medio por género.
              </p>
            </div>
            <p className="quiet">
              Las diferencias observadas por género son pequeñas.
            </p>
          </div>
        </div>
      </Slide>

      <Slide
        index={4}
        title="La categoría cambia la lectura."
        lead="Beauty presenta compras más recientes y frecuentes. Electronics tiene otro ritmo dentro de esta base."
        note="Antes de interpretar menor frecuencia como deslealtad o mayor recencia como abandono, necesitamos entender el ciclo de recompra de cada categoría."
      >
        <div className="category-grid">
          {data.groupSummaries["Product Category"].map((row, i) => (
            <article className="category-profile" key={row.group}>
              <span
                className="category-symbol"
                style={{ background: ["#e4edd7", "#eae4f3", "#e2ecf4"][i] }}
                aria-hidden="true"
              >
                {["B", "C", "E"][i]}
              </span>
              <h3>{row.group}</h3>
              <p className="quiet">
                {row.customers} clientes · {number(row.customerShare, 1)}%
              </p>
              <dl>
                <div>
                  <dt>Recency</dt>
                  <dd>
                    {number(row.recencyMean, 2)} <small>días</small>
                  </dd>
                </div>
                <div>
                  <dt>Frequency</dt>
                  <dd>
                    {number(row.frequencyMean, 2)} <small>compras</small>
                  </dd>
                </div>
                <div>
                  <dt>Monetary</dt>
                  <dd>
                    {number(row.monetaryMean, 2)} <small>u.m.</small>
                  </dd>
                </div>
                <div>
                  <dt>Ticket</dt>
                  <dd>
                    {number(row.ticketMean, 2)} <small>u.m.</small>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Slide>

      <Slide
        index={5}
        title="Tres señales del comportamiento."
        lead="R mira qué tan reciente fue la compra. F mide recurrencia. M añade el valor de esas compras."
        note="Spearman: Monetary–ticket = 0.81; Monetary–Frequency = 0.52. Son asociaciones, parcialmente ligadas a la construcción de Monetary."
      >
        <div className="histogram-grid">
          {(["Recency", "Frequency", "Monetary"] as const).map((key, i) => (
            <div key={key}>
              <Histogram
                id={key}
                title={key}
                bins={data.distributions[key].bins.map((b) => ({
                  from: b.lower,
                  to: b.upper,
                  count: b.customers,
                }))}
                median={data.distributions[key].median}
                unit={["días", "compras", "u.m."][i]}
                color={colors[i]}
              />
              <p className="percentile">
                Percentil 80:{" "}
                <strong>{["12 días", "7 compras", "450 u.m."][i]}</strong>
              </p>
            </div>
          ))}
        </div>
        <p className="takeaway">
          Monetary muestra la mayor asimetría. Comprar más veces no basta para
          explicar todo el valor.
        </p>
      </Slide>

      <Slide
        index={6}
        title="De valores a puntajes comparables."
        lead="Usamos percentiles 20, 40, 60 y 80 de toda la base. Los empates reciben el mismo puntaje."
        note="(a, b] significa mayor que a y menor o igual que b. Mantendríamos estos cortes durante la evaluación de una campaña para evitar cambios de referencia."
      >
        <div className="two-col wide-left">
          <table className="data-table scoring-table">
            <thead>
              <tr>
                <th scope="col">Puntaje</th>
                <th scope="col">R · días ↓</th>
                <th scope="col">F · compras ↑</th>
                <th scope="col">M · u.m. ↑</th>
              </tr>
            </thead>
            <tbody>
              {scoreIntervals.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th scope="row" key={cell}>
                        <span className="score-token">{cell}</span>
                      </th>
                    ) : (
                      <td
                        key={`${row[0]}-${["score", "recency", "frequency", "monetary"][i]}`}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="insight-column">
            <div>
              <h3>5 siempre es mejor</h3>
              <p>
                Invertimos R: menos días recibe más puntos. En F y M, los
                valores altos reciben más puntos.
              </p>
            </div>
            <div>
              <div className="rfm-code">
                <span>R</span>
                <span>F</span>
                <span>M</span>
              </div>
              <p>
                El código concatena tres puntajes.{" "}
                <strong>555 no es una suma ni una distancia numérica.</strong>
              </p>
            </div>
            <p className="quiet">
              Los grupos no tienen que medir 20%: el 31.2% obtiene un puntaje F
              = 1 porque registra una o dos compras.
            </p>
          </div>
        </div>
      </Slide>

      <Slide
        index={7}
        title="Seis perfiles, seis decisiones."
        lead="Estas reglas cubren a todos los clientes, sin duplicarlos. Aquí R, F y M son puntajes de 1 a 5."
        note="«En riesgo» es una señal relativa, no churn confirmado. La regla incorpora frecuencia alta o Monetary alto: no exige ambas condiciones."
      >
        <div className="rules-grid">
          {data.scoring.rules.map((rule, i) => (
            <article className="rule" key={rule.segment}>
              <span className="rule-dot" style={{ background: colors[i] }} />
              <div>
                <h3>{rule.segment}</h3>
                <p className="rule-formula">{rule.rule}</p>
                <p>{rule.interpretation}</p>
              </div>
            </article>
          ))}
        </div>
      </Slide>

      <Slide
        index={8}
        title="Del código RFM al segmento."
        lead="Un segmento reúne distintos códigos que comparten una oportunidad comercial."
        note="Hay 95 códigos RFM y 20 clientes con 555. Los 92 Campeones cumplen una regla más amplia; no se limitan al código perfecto."
      >
        <div className="two-col">
          <div>
            <table className="data-table example-table">
              <caption>Ejemplos de la base, sin identificadores</caption>
              <thead>
                <tr>
                  <th scope="col">R · días</th>
                  <th scope="col">F</th>
                  <th scope="col">M · u.m.</th>
                  <th scope="col">Código</th>
                  <th scope="col">Segmento</th>
                </tr>
              </thead>
              <tbody>
                {data.scoring.examples.map((r, i) => (
                  <tr key={r.segment}>
                    <td>{r.Recency}</td>
                    <td>{r.Frequency}</td>
                    <td>{number(r.Monetary, 2)}</td>
                    <td>
                      <strong>{r.RFM_Score}</strong>
                    </td>
                    <th scope="row">
                      <span style={{ color: colors[i] }}>{r.segment}</span>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Bars
            rows={data.segments.map((s, i) => ({
              label: s.segment,
              value: s.customers,
              color: colors[i],
              secondary: `${number(s.customerShare, 1)}%`,
            }))}
            unit="Número de clientes · 1,000 en total"
            decimals={0}
          />
        </div>
      </Slide>

      <Slide
        index={9}
        title="El perfil completo de la cartera."
        lead={
          <>
            Los Campeones son el 9.2% de los clientes y concentran el 29.35% de
            Monetary. Valor total:{" "}
            <strong>{number(data.summary.monetaryTotal, 2)} u.m.</strong>
          </>
        }
        note="Medias por cliente; importes en u.m. Modas con su porcentaje: la región predominante reúne cerca de 27–30%; no basta para restringir una campaña a ese territorio."
      >
        <table className="data-table profile-table">
          <thead>
            <tr>
              <th scope="col">Segmento</th>
              <th scope="col">n / %</th>
              <th scope="col">Edad</th>
              <th scope="col">Ticket</th>
              <th scope="col">
                R<br />
                días
              </th>
              <th scope="col">
                F<br />
                compras
              </th>
              <th scope="col">
                M<br />
                u.m.
              </th>
              <th scope="col">% M</th>
              <th scope="col">
                Categoría
                <br />
                principal
              </th>
              <th scope="col">
                Región
                <br />
                principal
              </th>
            </tr>
          </thead>
          <tbody>
            {data.segments.map((s, i) => (
              <tr key={s.segment}>
                <th scope="row">
                  <span
                    className="table-dot"
                    style={{ background: colors[i] }}
                  />
                  {s.segment}
                </th>
                <td>
                  {s.customers}
                  <small>{number(s.customerShare, 1)}%</small>
                </td>
                <td>{number(s.ageMean, 2)}</td>
                <td>{number(s.ticketMean, 2)}</td>
                <td>{number(s.recencyMean, 2)}</td>
                <td>{number(s.frequencyMean, 2)}</td>
                <td>{number(s.monetaryMean, 2)}</td>
                <td>
                  <strong>{number(s.monetaryShare, 2)}</strong>
                </td>
                <td>{s.dominantCategory}</td>
                <td>{s.dominantRegion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <Slide
        index={10}
        title="Recurrencia y valor no son lo mismo."
        lead="Leales compra casi tan seguido como Campeones. Potenciales combina el mayor ticket con menos compras."
        note="Estas diferencias describen grupos construidos con RFM; todavía no demuestran que una acción comercial vaya a funcionar."
      >
        <div className="two-col">
          <div>
            <h3>Monetary promedio</h3>
            <Bars
              rows={data.segments.map((s, i) => ({
                label: s.segment,
                value: s.monetaryMean,
                color: colors[i],
              }))}
              unit="Valor con margen por cliente · u.m."
            />
          </div>
          <div>
            <h3>Frequency promedio</h3>
            <Bars
              rows={data.segments.map((s, i) => ({
                label: s.segment,
                value: s.frequencyMean,
                color: colors[i],
              }))}
              unit="Compras por cliente en el período"
            />
          </div>
        </div>
      </Slide>

      <Slide
        index={11}
        title="La misma frecuencia, valores distintos."
        lead="La dispersión permite ver lo que un promedio esconde: el número de compras no determina por sí solo el valor."
        note="Las bandas reflejan los cinco niveles de ticket y los cocientes de margen. Hay puntos superpuestos; los conteos de la diapositiva 9 muestran mejor el tamaño de cada grupo."
      >
        <Scatter
          points={data.scatter.map((p) => ({
            x: p.Frequency,
            y: p.Monetary,
            segment: p.segment,
          }))}
        />
        <p className="quiet">
          El color incorpora la recencia a través del segmento; la clasificación
          usa las tres dimensiones.
        </p>
      </Slide>

      <Slide
        index={12}
        title="Importa con quién comparamos."
        lead="Ningún cliente de Electronics queda como Campeón o Leal con los cortes globales. Probamos una referencia por categoría."
        note="Cambian los cortes de R, F y M: no atribuimos todo el movimiento al ciclo de compra. Es una reclasificación de la misma población, no un cambio en el tiempo."
      >
        <div className="two-col wide-left">
          <div>
            <table className="data-table heatmap">
              <caption>
                De segmento global (filas) a segmento por categoría (columnas)
              </caption>
              <thead>
                <tr>
                  <th scope="col">Global / categoría</th>
                  {[
                    "Camp.",
                    "Leales",
                    "Potenc.",
                    "Ocas.",
                    "Riesgo",
                    "Baja act.",
                  ].map((s) => (
                    <th scope="col" key={s}>
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sensitivity.transition.map((row, i) => (
                  <tr key={row.fromSegment}>
                    <th scope="row">{row.fromSegment}</th>
                    {data.segmentOrder.map((segment, j) => {
                      const value = Number(row[segment as keyof typeof row]);
                      return (
                        <td
                          key={segment}
                          style={{
                            background:
                              i === j
                                ? `rgba(39,99,76,${0.1 + (value / 147) * 0.45})`
                                : `rgba(71,125,179,${(value / 147) * 0.32})`,
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="quiet">
              La diagonal conserva el segmento. Beauty es el 71.7% de Campeones;
              Electronics, el 53.8% de En riesgo.
            </p>
          </div>
          <div className="sensitivity-summary">
            <strong className="big-percent">38.8%</strong>
            <p>cambia de segmento al comparar dentro de cada categoría.</p>
            <div className="risk-equation">
              <span>
                156<small>en riesgo global</small>
              </span>
              <b>→</b>
              <span>
                196<small>por categoría</small>
              </span>
            </div>
            <p>
              <strong>110</strong> permanecen · <strong>46</strong> salen ·{" "}
              <strong>86</strong> entran.
            </p>
            <p className="quiet">
              Electronics: 84 → 71.
              <br />
              Beauty: 0 → 61.
            </p>
          </div>
        </div>
      </Slide>

      <Slide
        index={13}
        title="Retener sin regalar el margen."
        lead="La base más recurrente merece atención. La propuesta cambia según el valor de sus compras."
        note="Acciones propuestas para probar. Los indicadores se evaluarían a 90 días, con tratamiento y control."
      >
        <Actions start={0} />
      </Slide>
      <Slide
        index={14}
        title="Dar una buena razón para volver."
        lead="Potenciales tiene un ticket de 358.64 u.m.; Ocasionales recientes, de 33.02. El costo de la propuesta debe reflejar esa diferencia."
        note="Adaptaríamos la recomendación a la categoría de cada cliente, no solo a la categoría predominante del segmento."
      >
        <Actions start={2} />
      </Slide>
      <Slide
        index={15}
        title="Revisar antes de reactivar."
        lead="Una recencia mayor dentro de esta base no confirma abandono. La categoría y el historial importan."
        note="El 22.02% de Monetary en En riesgo es valor histórico: no es una pérdida estimada ni una recuperación garantizada."
      >
        <Actions start={4} />
      </Slide>

      <Slide
        index={16}
        title="Definir qué significa mejorar."
        lead="Ocho indicadores, una ventana propuesta de 90 días. Cada acción tiene al menos tres KPIs."
        className="kpi-slide"
        note="Todos los asignados cuentan en los denominadores por cliente, incluso si no compran. Sin compras o reactivaciones, Ticket90 o CostoReactivacion90 queda no estimable, no cero."
      >
        <div className="kpi-grid">
          {kpiDefinitions.map(([name, definition]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{definition}</p>
            </article>
          ))}
        </div>
      </Slide>

      <Slide
        index={17}
        title="Probar, comparar y aprender."
        lead="La segmentación sugiere a quién contactar. Un piloto permitiría saber si la acción aporta valor adicional."
        note="Necesitamos asignación T/C, compras y fechas posteriores, categorías, ventas netas, contribución y costos. Compararíamos con incertidumbre y tamaño de muestra."
      >
        <div className="pilot-flow">
          <div>
            <span>1</span>
            <h3>Asignar al azar</h3>
            <p>Tratamiento y control dentro de cada segmento y categoría.</p>
          </div>
          <div>
            <span>2</span>
            <h3>Observar 90 días</h3>
            <p>
              Misma ventana y seguimiento; ajustarla al ciclo real antes del
              lanzamiento.
            </p>
          </div>
          <div>
            <span>3</span>
            <h3>Comparar T − C</h3>
            <p>Tasas en puntos porcentuales; medias en sus propias unidades.</p>
          </div>
        </div>
        <div className="margin-formula">
          <h3>Margen incremental por cliente</h3>
          <p>
            <span>Media en tratamiento</span>
            <b>−</b>
            <span>Media en control</span>
          </p>
          <small>
            En ambos: valor con margen − costos adicionales de campaña, contando
            a quienes no compran y descontando cada costo una sola vez.
          </small>
        </div>
        <p className="takeaway">
          Más recompra no siempre significa más valor. Las metas se fijarían con
          una línea base comparable y costos reales.
        </p>
      </Slide>

      <Slide
        index={18}
        title="El valor futuro todavía está abierto."
        lead="Con esta fotografía podemos priorizar. Para estimar CLV o confirmar abandono necesitamos historia temporal."
        note="Los 90 días pertenecen al piloto propuesto. No son el período de los datos históricos ni permiten anualizar Monetary automáticamente."
      >
        <div className="two-col">
          <div className="clv-block">
            <span className="clv-label">CLV</span>
            <h3>
              No lo calculamos
              <br />
              con esta base.
            </h3>
            <p>
              Falta conocer el período que representa Monetary y estimar
              retención.
            </p>
            <div className="clv-horizon">
              <strong>3 años</strong>
              <span>sería el horizonte de estimación</span>
            </div>
          </div>
          <div>
            <h3>Qué mantendríamos bajo revisión</h3>
            <ul className="boundary-list">
              <li>
                <strong>La referencia.</strong> RFM global para comparar la
                cartera; por categoría para revisar prioridades.
              </li>
              <li>
                <strong>Las unidades.</strong> Importes en u.m.; sin moneda ni
                fecha de corte inventadas.
              </li>
              <li>
                <strong>El margen.</strong> Ya está integrado: no se aplica otra
                tasa ni se proyecta como 3 × Monetary.
              </li>
              <li>
                <strong>El alcance.</strong> Una señal relativa de riesgo no
                demuestra churn; una propuesta no es un efecto observado.
              </li>
            </ul>
          </div>
        </div>
      </Slide>

      <Slide
        index={19}
        title="Cinco decisiones para poner a prueba."
        lead="La prioridad combina valor histórico, oportunidad y costo de contacto."
        className="closing"
        note="Comprobación final: 1,000 clientes conservados, seis segmentos, porcentajes y Monetary conciliados. Los archivos originales permanecen intactos."
      >
        <div className="decision-list">
          {data.priorities.map((p, i) => (
            <div className="decision-row" key={p.decision}>
              <span className="decision-number">{i + 1}</span>
              <div>
                <h3>{p.decision}</h3>
                <p>
                  {
                    [
                      "Servicio y personalización; comprobar el margen antes de ampliar beneficios.",
                      "Recomendaciones que desarrollen recompra según la categoría.",
                      "Validar el ciclo de compra antes de invertir en incentivos.",
                      "Automatizar y exigir contribución positiva antes de escalar.",
                    ][i]
                  }
                </p>
              </div>
              <div className="decision-stat">
                <strong>{number(p.monetaryShare, 2)}%</strong>
                <span>del valor · {p.customers} clientes</span>
              </div>
            </div>
          ))}
          <div className="decision-row final-decision">
            <span className="decision-number">5</span>
            <div>
              <h3>Usar RFM con contexto</h3>
              <p>
                El 38.8% cambia al usar referencias por categoría. Revisar la
                selección y medir el efecto con grupos comparables.
              </p>
            </div>
          </div>
        </div>
        <p className="closing-line">
          Segmentar ordena las decisiones.
          <br />
          <strong>Medir nos dice cuáles funcionan.</strong>
        </p>
      </Slide>
    </DeckShell>
  );
}
