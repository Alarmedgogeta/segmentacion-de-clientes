# Segmentación de clientes

Presentación web de la actividad de segmentación de clientes, desarrollada localmente en **20 diapositivas** con Next.js, App Router, TypeScript, Reveal.js y Tailwind CSS. Explica el proceso del notebook: calidad de datos, descriptivos, comparaciones, scoring RFM, segmentos, perfiles, sensibilidad por categoría, acciones comerciales y medición.

**Estado:** presentación desarrollada y verificada localmente. No se ha registrado despliegue ni entrega académica. El PDF solicitado por la consigna conserva sus requisitos y permanece pendiente.

## Navegación

- En escritorio, usar las flechas del teclado o los botones anterior/siguiente para recorrer las diapositivas.
- El índice permite ir directamente a una sección y el indicador muestra el avance.
- El botón de pantalla completa está disponible cuando el navegador admite esa función.
- En móvil, la presentación utiliza lectura vertical para recorrer el contenido sin reducirlo a una diapositiva de escritorio.
- El botón de descarga permite obtener el notebook completo con sus salidas guardadas.

## Datos y procedencia

Los datos de las tablas y gráficas provienen de `src/data/notebook-data.json`, exportado de una copia en memoria del notebook analítico de la actividad. [DATA_PROVENANCE.md](DATA_PROVENANCE.md) registra la fuente, sus hashes, el mapeo de celdas y las comprobaciones de exportación. [AUDITORIA_PRESENTACION.md](AUDITORIA_PRESENTACION.md) documenta la revisión de las 20 diapositivas frente a una nueva ejecución del notebook y las precisiones de redacción aplicadas.

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

## Verificación y producción

```sh
pnpm lint
pnpm format
pnpm typecheck
pnpm build
pnpm start
```

Verificaciones locales completadas:

- `pnpm lint` sin advertencias; `pnpm typecheck` y `pnpm build` aprobados.
- Versión de producción revisada en navegador sin advertencias ni errores de hidratación. Las 20 diapositivas se revisaron sin recortes de contenido en escritorio.
- Índice, flechas del teclado y botones anterior/siguiente comprobados.
- En móvil de 390 × 844, las 20 secciones permanecen disponibles en lectura vertical, sin desbordamiento horizontal de la página ni contenido oculto por `aria-hidden`. La navegación y el desplazamiento horizontal de las tablas funcionan. También se verificó la transición escritorio → móvil → escritorio.

Los servidores iniciados para estas pruebas finalizaron; se confirmó el cierre de sus procesos y la liberación del puerto 3102.

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
- `src/components/presentation.tsx`: contenido de las 20 diapositivas.
- `src/components/deck-shell.tsx`: navegación, índice, pantalla completa y modo de lectura.
- `src/components/charts.tsx`: gráficas basadas en los datos derivados.
- `src/data/notebook-data.json`: datos verificados para la presentación.
- `public/notebooks/actividad2_segmentacion_clientes.ipynb`: copia exacta descargable del notebook con salidas guardadas.
- `DATA_PROVENANCE.md`: trazabilidad del notebook y del proceso de exportación.
- `AUDITORIA_PRESENTACION.md`: correspondencia por diapositiva, resultados de la revisión y ajustes de redacción.
- `postcss.config.mjs`: integración de Tailwind.
- `pnpm-workspace.yaml`: política de dependencias.
- `scripts/check-package-manager.mjs`: verificación de pnpm.

La licencia del repositorio se conserva en `LICENSE`.
