# Segmentación de clientes

Presentación web de la actividad de segmentación de clientes, desarrollada en **26 diapositivas** con Next.js, App Router, TypeScript, Reveal.js y Tailwind CSS. Explica el proceso del notebook: calidad de datos, descriptivos, comparaciones, scoring RFM, segmentos, perfiles, sensibilidad por categoría, acciones comerciales y medición. Las diapositivas 18–23 desarrollan cómo evaluar las decisiones mediante pruebas A/B. La última incorpora un formulario para clasificar un cliente mediante un endpoint del backend.

**Estado al 10 de octubre de 2026:** ampliación a **26 diapositivas publicada y comprobada en [Vercel](https://segmentacion-de-clientes.vercel.app/#/piloto)**. El despliegue del commit `245e684` terminó a las **14:41:32 de Ciudad de México**; [AUDITORIA_AB.md](AUDITORIA_AB.md) registra la evidencia y las comprobaciones locales y públicas. La versión anterior tenía 21 diapositivas y correspondía al commit `b5dbe9c`. El PDF solicitado por la consigna y su entrega académica permanecen pendientes.

## Navegación

**Bloque de pruebas A/B:** [guion y fundamento del bloque](PLAN_DIAPOSITIVAS_AB.md), autorizado e implementado el 10 de octubre de 2026. Conecta las cinco decisiones finales con comparaciones, costos y criterios para ampliar, ajustar o descartar una acción. Sustituye el piloto por seis diapositivas (18–23); límites, decisiones y clasificador pasan a 24, 25 y 26. La verificación y publicación se registran en [AUDITORIA_AB.md](AUDITORIA_AB.md).

- En escritorio, usar las flechas del teclado o los botones anterior/siguiente para recorrer las diapositivas.
- El índice permite ir directamente a una sección y el indicador muestra el avance.
- El botón de pantalla completa está disponible cuando el navegador admite esa función.
- En móvil, la presentación utiliza lectura vertical para recorrer el contenido sin reducirlo a una diapositiva de escritorio.
- El botón de descarga permite obtener el notebook completo con sus salidas guardadas.
- La última sección, `/#/clasificador`, permite ingresar RFM o cargar uno de los seis ejemplos del notebook y consultar el perfil del cliente.

## Datos y procedencia

Los datos de las tablas y gráficas provienen de `src/data/notebook-data.json`, exportado de una copia en memoria del notebook analítico de la actividad. [DATA_PROVENANCE.md](DATA_PROVENANCE.md) registra la fuente, sus hashes, el mapeo de celdas, las comprobaciones de exportación y la procedencia del clasificador. [AUDITORIA_PRESENTACION.md](AUDITORIA_PRESENTACION.md) documenta la revisión histórica de las primeras 20 diapositivas frente a una nueva ejecución del notebook y las precisiones de redacción aplicadas.

El JSON contiene agregados, ejemplos sin identificadores y puntos limitados a las variables de la gráfica de dispersión. El notebook descargable conserva su contenido completo, incluidas las muestras de registros e identificadores presentes en sus salidas. Los CSV y XLSX originales permanecen fuera del repositorio web. Las acciones y los KPIs son propuestas, no efectos de campañas observados.

## Notebook descargable

[Descargar el notebook](public/notebooks/actividad2_segmentacion_clientes.ipynb): copia exacta de `../actividad2_segmentacion_clientes.ipynb`, incorporada por solicitud expresa del usuario. Se sirve en `/notebooks/actividad2_segmentacion_clientes.ipynb` y conserva código, explicaciones y salidas. Su hash y procedencia están en [DATA_PROVENANCE.md](DATA_PROVENANCE.md).

Para ejecutarlo, usar las dependencias de `requirements_actividad2.txt` de la actividad original y colocar `retail_sales_dataset.csv` y `retail_sales_dataset.xlsx` en una subcarpeta `datos/` junto al notebook. Esos archivos de datos y el listado de dependencias no se incluyen en esta descarga; las salidas guardadas permiten revisar el análisis sin ejecutarlo.

Si cambia el notebook original, volver a copiar el archivo completo a `public/notebooks/actividad2_segmentacion_clientes.ipynb`, comprobar igualdad byte por byte y SHA-256 y actualizar la procedencia. No editar la copia por separado. Si cambian los resultados, regenerar y verificar también el JSON de la presentación.

## Desarrollo

Requisitos: Node.js 22.13 o posterior y pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abrir `http://localhost:3000` para revisar la presentación local.

## Clasificador de clientes

La diapositiva 26 envía los valores del formulario a `POST /api/classify`. El backend valida las entradas, asigna puntajes con los cortes globales del notebook y aplica sus seis reglas en el mismo orden. Devuelve el nombre y la interpretación del segmento, los puntajes RFM, la regla aplicada y una propuesta de acción con sus KPIs. No se entrena un modelo adicional ni se recalculan percentiles con cada consulta.

| Campo JSON | Entrada | Validación |
| --- | --- | --- |
| `recency` | Días desde la última compra | Número entero seguro mayor o igual que 0. |
| `frequency` | Número de compras | Número entero seguro mayor o igual que 1. |
| `monetary` | Valor con margen ya incorporado, en u.m. | Número finito entre 0 y `9007199254740991`; admite decimales. |

Los tres campos son obligatorios y deben ser números JSON: no se convierten cadenas, valores nulos ni booleanos. Todos se limitan a `Number.MAX_SAFE_INTEGER` (`9007199254740991`); recencia y frecuencia además deben ser enteros seguros. Un cuerpo malformado o entradas inválidas producen HTTP `400`; un `Content-Type` distinto de `application/json` produce `415`. Los errores se devuelven como `{ "error": "…", "fields": { "recency": "…" } }`, donde `fields` aparece cuando hay errores por campo.

Ejemplo de solicitud:

```sh
curl http://localhost:3000/api/classify \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"recency":3,"frequency":11,"monetary":192.5}'
```

Respuesta esperada, HTTP `200`:

```json
{
  "segment": {
    "name": "Campeones",
    "color": "#19725C",
    "profile": "Compra reciente, recurrente y de alto valor.",
    "action": "Acceso anticipado a novedades y recomendaciones complementarias a su categoría, con atención preferente.",
    "kpi": "Recompra90; CompraOtraCategoria90; MargenIncremental90."
  },
  "scores": { "recency": 4, "frequency": 5, "monetary": 4, "code": "454" },
  "rule": { "priority": 1, "condition": "R ≥ 4, F ≥ 4, M ≥ 4" },
  "warnings": []
}
```

Los cortes son R: `2, 4, 7, 12`; F: `2, 3, 5, 7`; M: `25, 56.25, 120, 450`. Los intervalos incluyen su extremo derecho, como `pd.cut(..., right=True)` en el notebook: R = 2 recibe 5; F = 2 y M = 25 reciben 1. Menor recencia obtiene mayor puntaje; mayor frecuencia o valor obtiene mayor puntaje. `rule.priority` identifica la regla aplicada entre 1 y 6; no representa confianza ni probabilidad.

Los ejemplos del formulario proceden de `scoring.examples`, sin identificadores de clientes:

| Perfil | R: días | F: compras | M: u.m. | Código RFM |
| --- | --- | --- | --- | --- |
| Campeones | 3 | 11 | 192.5 | 454 |
| Leales | 2 | 8 | 120 | 553 |
| Potenciales | 6 | 3 | 375 | 324 |
| Ocasionales recientes | 3 | 1 | 7.5 | 411 |
| En riesgo de alto valor | 11 | 3 | 450 | 224 |
| Baja actividad y valor | 8 | 4 | 30 | 232 |

La aplicación no guarda las consultas ni modifica los datos fuente; las respuestas se envían con `Cache-Control: no-store`. Los valores válidos fuera de los rangos observados —R: 0–24 días; F: 1–12 compras; M: 6.25–2100 u.m.— se clasifican con los mismos cortes y generan advertencias en `warnings`.

El resultado describe un perfil RFM según esta base; no estima CLV, probabilidad de abandono ni resultados futuros de campañas. Las acciones y los KPIs son propuestas de la actividad, con una ventana de piloto de 90 días. Esa ventana no establece el período original de Frequency/Monetary, que sigue sin conocerse. Para interpretar entradas externas debe confirmarse que sus unidades y período sean comparables con la base.

## Verificación y producción

La ampliación A/B del 10 de octubre pasó lint sin advertencias, TypeScript y compilación de producción con Turbopack. Se revisaron las seis nuevas diapositivas y el cierre en escritorio, lectura móvil, índice, teclado, clasificador e integridad de fuentes. [AUDITORIA_AB.md](AUDITORIA_AB.md) registra el alcance y el cierre de los servidores.

```sh
pnpm lint
pnpm format
pnpm typecheck
pnpm test:classifier
pnpm build
pnpm start
```

Verificaciones históricas completadas para la versión de **20 diapositivas**, anteriores a la incorporación del clasificador (su fecha de ejecución no quedó registrada en este resumen):

- `pnpm lint` sin advertencias; `pnpm typecheck` y `pnpm build` aprobados.
- Versión de producción revisada en navegador sin advertencias ni errores de hidratación. Las 20 diapositivas se revisaron sin recortes de contenido en escritorio.
- Índice, flechas del teclado y botones anterior/siguiente comprobados.
- En móvil de 390 × 844, las 20 secciones permanecen disponibles en lectura vertical, sin desbordamiento horizontal de la página ni contenido oculto por `aria-hidden`. La navegación y el desplazamiento horizontal de las tablas funcionan. También se verificó la transición escritorio → móvil → escritorio.

Los servidores iniciados para esas pruebas finalizaron; se confirmó el cierre de sus procesos y la liberación del puerto 3102. La auditoría de correspondencia con el notebook del 9 de octubre de 2026 conserva su alcance original de 20 diapositivas en [AUDITORIA_PRESENTACION.md](AUDITORIA_PRESENTACION.md).

### Verificación del clasificador — 9 de octubre de 2026

- `pnpm lint` y `pnpm typecheck` aprobados; `pnpm test:classifier` pasa sus 9 pruebas sobre los seis ejemplos, límites exactos, prioridad, rangos y entradas inválidas. Node emite un aviso de detección de módulo al cargar el archivo TypeScript de prueba; no afecta los resultados.
- Compilación de producción aprobada con `pnpm build --webpack`, con `/api/classify` registrado como ruta dinámica. `pnpm build` con Turbopack encontró una restricción del entorno al abrir un puerto temporal para procesar CSS; se usó Webpack sin modificar la configuración de producción del proyecto.
- 14 comprobaciones HTTP aprobadas en producción: los seis ejemplos y sus códigos, `no-store`, JSON malformado, campos ausentes o inválidos, Content-Type, charset y rechazo de GET con 405.
- Los seis perfiles se probaron desde el formulario. En producción se revisaron escritorio y móvil de 390 × 844, sin desbordamiento horizontal; los clics móviles funcionan al habilitar los eventos de puntero en lectura vertical. La presentación conserva 21 secciones.
- Se comprobaron errores con foco en el campo, limpieza del resultado al editar, avisos fuera del rango observado, desplazamiento por teclado del resultado sin cambiar de diapositiva y mensaje de conexión fallida. La consola de producción no mostró advertencias ni errores durante el flujo correcto.
- Servidores temporales: sesión `45696`, PID `55904`, y sesión `84640`, PID `56495`, ambos en `127.0.0.1:3103`. Se cerraron con SIGINT y se comprobó la desaparición de cada proceso y la liberación del puerto. El servidor preexistente en el puerto 3000 se conservó.

### Revisión del proyecto y producción — 10 de octubre de 2026

- `pnpm lint`, `pnpm typecheck` y las nueve pruebas de `pnpm test:classifier` aprobados con dependencias existentes, Node 24.19.0 y pnpm 11.19.0.
- Comparación del clasificador TypeScript con el recálculo Python de los 1,000 clientes: cero diferencias en segmento o puntajes R/F/M. Los 2,800 valores numéricos derivados del JSON coinciden con los recálculos. Se recalcularon diez celdas numéricas en un proceso limpio; no fue una nueva ejecución integral del notebook en kernel Jupyter ni se regeneraron sus figuras.
- `pnpm build --webpack` aprobado. Turbopack volvió a encontrar la restricción del sandbox al abrir un puerto temporal para CSS; no se alteró la configuración de producción.
- 18 comprobaciones HTTP aprobadas en el sitio publicado: portada, notebook y 16 casos del API (seis ejemplos, errores de formato/valor, valores fuera de rango, charset y GET rechazado). Los POST devuelven `no-store`; la descarga pública es idéntica al original, con el SHA registrado en `DATA_PROVENANCE.md`.
- Índice y clasificador revisados en producción a 1440×900 y 390×844. En móvil: 21 secciones, ninguna con `aria-hidden=true`, sin desbordamiento horizontal del documento. Se comprobaron Campeones→454 en escritorio y En riesgo→224 en móvil. No hubo errores ni advertencias de consola en el flujo revisado. La inspección visual nueva se concentró en portada, tabla de perfiles y clasificador; no reemplaza una auditoría completa de accesibilidad.
- Despliegue contrastado mediante el [estado del commit en GitHub](https://api.github.com/repos/Alarmedgogeta/segmentacion-de-clientes/commits/b5dbe9c71021688411512ceda710265cd5a5a47c/status) y el [sitio público](https://segmentacion-de-clientes.vercel.app). No se inspeccionaron ajustes privados ni logs internos de Vercel.
- No se instalaron paquetes, iniciaron servidores de aplicación ni cambiaron código, datos o despliegue. Esta revisión no acredita una instalación limpia ni una auditoría de vulnerabilidades.

Mejoras pendientes: versionar el exportador/conciliación del JSON, reducir cifras/reglas repetidas en la presentación y completar la estructura accesible con `h1`, salto al contenido y enlaces nativos en el índice. Los cálculos actuales coinciden; estas recomendaciones no se implementaron en la revisión documental.

## Servidores de pruebas

Registrar la sesión, el PID y el puerto de cualquier servidor iniciado para pruebas. Detenerlo al terminar o antes de la respuesta final, incluso tras fallos, y verificar que el proceso terminó y el puerto quedó libre. No detener servidores ajenos.

## Dependencias

Usar **pnpm siempre y sin excepciones**. `packageManager` fija su versión y `pnpm-lock.yaml` conserva las versiones resueltas.

Antes de instalar, agregar o actualizar librerías, comprobar `pnpm-workspace.yaml`:

```yaml
minimumReleaseAge: 10080
minimumReleaseAgeStrict: true
minimumReleaseAgeIgnoreMissingTime: false
minimumReleaseAgeExclude: []
trustLockfile: false
```

La espera mínima es de **7 días** desde la publicación de cada versión, incluidas las dependencias transitivas. Las versiones demasiado recientes o sin fecha verificable se rechazan. No se permiten exclusiones ni desactivar esta política. La antigüedad reduce la exposición a versiones recientes, pero no garantiza por sí sola que una dependencia esté libre de vulnerabilidades. [Documentación de pnpm](https://pnpm.io/settings/dependency-resolution#minimumreleaseage).

Para añadir paquetes, usar `pnpm add -w nombre` o `pnpm add -w -D nombre`, conservando la política. El hook `preinstall` rechaza otros gestores. Biome revisa y formatea el código con `pnpm lint` y `pnpm format`.

## Estructura

- `src/app/`: ruta principal, layout y estilos globales.
- `src/app/api/classify/route.ts`: endpoint POST y validación del formato de la solicitud.
- `src/lib/classifier.ts`: validación de valores, scoring y aplicación de reglas RFM.
- `src/lib/classifier-types.ts`: contrato compartido del formulario y del endpoint.
- `src/components/presentation.tsx`: contenido y orden de las 26 diapositivas.
- `src/components/ab-slides.tsx`: seis diapositivas de diseño y evaluación experimental.
- `src/data/ab-plan.ts`: propuestas A/B y ejemplo hipotético, separados de los resultados del notebook.
- `src/components/customer-classifier.tsx`: formulario, ejemplos y resultado del clasificador.
- `src/components/deck-shell.tsx`: navegación, índice, pantalla completa y modo de lectura.
- `src/components/charts.tsx`: gráficas basadas en los datos derivados.
- `src/data/notebook-data.json`: datos verificados para la presentación.
- `public/notebooks/actividad2_segmentacion_clientes.ipynb`: copia exacta descargable del notebook con salidas guardadas.
- `DATA_PROVENANCE.md`: trazabilidad del notebook y del proceso de exportación.
- `AUDITORIA_PRESENTACION.md`: correspondencia por diapositiva, resultados de la revisión y ajustes de redacción.
- `AUDITORIA_AB.md`: verificaciones de la ampliación a 26 diapositivas.
- `postcss.config.mjs`: integración de Tailwind.
- `pnpm-workspace.yaml`: política de dependencias.
- `scripts/check-package-manager.mjs`: verificación de pnpm.

La licencia del repositorio se conserva en `LICENSE`.
