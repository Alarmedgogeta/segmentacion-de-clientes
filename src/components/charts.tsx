export const colors = [
  "#27634c",
  "#477db3",
  "#8766ac",
  "#b58024",
  "#c76250",
  "#77888b",
];
export const shortNames = [
  "Campeones",
  "Leales",
  "Potenciales",
  "Ocasionales recientes",
  "En riesgo de alto valor",
  "Baja actividad y valor",
];
export const number = (value: number, decimals = 0) =>
  new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);

export function Bars({
  rows,
  unit,
  decimals = 2,
  max,
}: {
  rows: { label: string; value: number; color?: string; secondary?: string }[];
  unit: string;
  decimals?: number;
  max?: number;
}) {
  const ceiling = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <figure className="bar-chart" aria-label={unit}>
      {rows.map((row, i) => (
        <div className="bar-row" key={row.label}>
          <div className="bar-label">
            <span>{row.label}</span>
            <strong>
              {number(row.value, decimals)}
              {row.secondary && <small>{row.secondary}</small>}
            </strong>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${(row.value / ceiling) * 100}%`,
                background: row.color ?? colors[i % colors.length],
              }}
            />
          </div>
        </div>
      ))}
      <figcaption className="chart-unit">{unit}</figcaption>
    </figure>
  );
}

export function Histogram({
  id,
  bins,
  median,
  title,
  unit,
  color,
}: {
  id: string;
  bins: { from: number; to: number; count: number }[];
  median: number;
  title: string;
  unit: string;
  color: string;
}) {
  const w = 370,
    h = 240,
    left = 42,
    right = 16,
    top = 24,
    bottom = 46;
  const low = bins[0].from,
    high = bins[bins.length - 1].to;
  const peak = Math.max(...bins.map((b) => b.count));
  const ticks =
    title === "Recency"
      ? [0, 12, 24]
      : title === "Frequency"
        ? [1, 6, 12]
        : [6.25, 1000, 2100];
  const x = (v: number) =>
    left + ((v - low) / (high - low)) * (w - left - right);
  const y = (v: number) => h - bottom - (v / peak) * (h - top - bottom);
  return (
    <figure className="histogram">
      <figcaption>
        {title}
        <span>
          Mediana: {number(median)} {unit}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>
          {`Distribución de ${title}. Eje horizontal: ${unit}. Eje vertical: clientes. Mediana: ${median}.`}
        </title>
        {[0, Math.round(peak / 2), peak].map((t) => (
          <g key={t}>
            <line
              x1={left}
              x2={w - right}
              y1={y(t)}
              y2={y(t)}
              className="grid-line"
            />
            <text x={left - 9} y={y(t) + 5} textAnchor="end">
              {number(t)}
            </text>
          </g>
        ))}
        {bins.map((b) => (
          <rect
            key={b.from}
            x={x(b.from) + 1}
            y={y(b.count)}
            width={Math.max(1, x(b.to) - x(b.from) - 2)}
            height={h - bottom - y(b.count)}
            fill={color}
            rx="2"
          >
            <title>
              {`${number(b.from, 2)} a ${number(b.to, 2)}: ${b.count} clientes`}
            </title>
          </rect>
        ))}
        <line
          x1={x(median)}
          x2={x(median)}
          y1={top - 4}
          y2={h - bottom}
          stroke="#192e28"
          strokeDasharray="5 4"
          strokeWidth="2"
        />
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={h - 20} textAnchor="middle">
            {number(t, Number.isInteger(t) ? 0 : 2)}
          </text>
        ))}
        <text x={left} y={15} className="axis-caption">
          Clientes
        </text>
      </svg>
      <p className="chart-unit">{unit}</p>
    </figure>
  );
}

export function Scatter({
  points,
}: {
  points: { x: number; y: number; segment: string }[];
}) {
  const grouped = new Map<
    string,
    { x: number; y: number; segment: string; count: number }
  >();
  for (const point of points) {
    const key = `${point.segment}-${point.x}-${point.y}`;
    const previous = grouped.get(key);
    grouped.set(key, { ...point, count: (previous?.count ?? 0) + 1 });
  }
  const w = 1050,
    h = 440,
    l = 82,
    r = 24,
    t = 28,
    b = 62;
  const x = (v: number) => l + ((v - 1) / 11) * (w - l - r);
  const y = (v: number) => h - b - (v / 2100) * (h - t - b);
  return (
    <figure className="scatter">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby="scatter-title">
        <title id="scatter-title">
          Frecuencia y valor monetario de 1,000 clientes, diferenciados por
          segmento. Una misma frecuencia se asocia con importes muy distintos.
        </title>
        {[0, 500, 1000, 1500, 2100].map((v) => (
          <g key={v}>
            <line x1={l} x2={w - r} y1={y(v)} y2={y(v)} className="grid-line" />
            <text x={l - 16} y={y(v) + 6} textAnchor="end">
              {number(v)}
            </text>
          </g>
        ))}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((v) => (
          <text key={v} x={x(v)} y={h - b + 28} textAnchor="middle">
            {v}
          </text>
        ))}
        {Array.from(grouped, ([key, p]) => (
          <circle
            key={key}
            cx={x(p.x)}
            cy={y(p.y)}
            r="4.5"
            fill={colors[shortNames.indexOf(p.segment)]}
            fillOpacity={1 - 0.54 ** p.count}
          >
            <title>
              {`${p.segment}: ${p.x} compras, ${number(p.y, 2)} u.m. · ${p.count} clientes`}
            </title>
          </circle>
        ))}
        <text x={l} y="17" className="axis-caption">
          Monetary (u.m.)
        </text>
        <text x={w / 2} y={h - 8} textAnchor="middle" className="axis-caption">
          Frequency · compras en el período
        </text>
      </svg>
      <figcaption className="legend">
        {shortNames.map((s, i) => (
          <span key={s}>
            <i style={{ background: colors[i] }} />
            {s}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
