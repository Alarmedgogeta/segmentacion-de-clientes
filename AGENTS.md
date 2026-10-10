# Convenciones del proyecto

Presentación web de la actividad de segmentación de clientes, con 26 diapositivas, Next.js, Reveal.js y Tailwind CSS, y un clasificador con formulario y backend en la última diapositiva. El usuario autorizó su desarrollo para explicar el notebook analítico y su ampliación con pruebas A/B (18–23). La [publicación en Vercel](https://segmentacion-de-clientes.vercel.app) y sus verificaciones se documentan en `README.md` y `AUDITORIA_AB.md`; conservar el alcance histórico de auditorías anteriores. El PDF académico y su entrega siguen pendientes: no confundir la web publicada con la entrega oficial.

## Dependencias

- Usar **pnpm siempre y sin excepciones**. No usar npm, npx, Yarn o Bun ni agregar sus lockfiles.
- Antes de instalar o actualizar cualquier paquete, o de ejecutar un generador que descargue dependencias, comprobar la política en `pnpm-workspace.yaml`: `minimumReleaseAge: 10080` (7 días), `minimumReleaseAgeStrict: true`, `minimumReleaseAgeIgnoreMissingTime: false` y ninguna exclusión.
- No desactivar, reducir ni eludir la antigüedad mínima. Si una versión no cumple, elegir otra compatible que sí cumpla o esperar.
- Mantener la versión de pnpm declarada en `packageManager` y versionar `pnpm-lock.yaml`. En CI, instalar con `pnpm install --frozen-lockfile`.

## Desarrollo

- Usar App Router y TypeScript. Mantener las APIs de navegador de Reveal.js en un componente cliente, con inicialización y limpieza.
- Usar Tailwind para los estilos y mantener la documentación en `.md`.
- Conservar la navegación por teclado, el índice, la pantalla completa cuando esté disponible y la lectura vertical en móvil.
- Verificar los cambios con `pnpm lint`, `pnpm typecheck` y `pnpm build`.
- El contenido académico se desarrolla a partir de resultados verificados. No inventar cifras ni incorporar información privada al repositorio público.
- Usar `src/data/notebook-data.json` para las cifras y consultar `DATA_PROVENANCE.md` para su fuente y mapeo. Mantener el JSON sin identificadores de clientes; no añadir los archivos CSV/XLSX al repositorio.
- Mantener hipótesis y cifras didácticas A/B en `src/data/ab-plan.ts`, separadas del JSON observado. Rotular los ejemplos como hipotéticos; no presentarlos como resultados de campañas reales.

## Notebook descargable autorizado

- El usuario solicitó una copia exacta de `../actividad2_segmentacion_clientes.ipynb` en `public/notebooks/actividad2_segmentacion_clientes.ipynb`, descargable desde la presentación. Conservar todo su contenido, incluidas salidas, muestras de registros e identificadores presentes en ellas. Esta autorización específica es distinta de las restricciones del JSON.
- Si cambia el original, volver a copiarlo completo, comprobar igualdad byte por byte y SHA-256 y actualizar `DATA_PROVENANCE.md`. No editar la copia por separado ni limpiar sus salidas. Si cambian resultados, sincronizar y verificar también el JSON y la presentación.
- La copia conserva salidas, pero su ejecución requiere las dependencias de `requirements_actividad2.txt` de la actividad original y ambos CSV/XLSX en `datos/` junto al notebook. Esos archivos permanecen fuera del repositorio web.

## Servidores de pruebas

- Registrar la sesión, el PID y el puerto de cada servidor iniciado para pruebas.
- Detener los servidores que se hayan iniciado al terminar las pruebas o antes de la respuesta final, incluso si las pruebas fallan.
- Verificar que el proceso haya terminado y que su puerto esté liberado.
- No terminar servidores ajenos ni procesos que no se hayan iniciado para la tarea.
