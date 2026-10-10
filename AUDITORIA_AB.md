# Verificación de la ampliación A/B

**Fecha:** 10 de octubre de 2026. **Estado:** implementación, verificación local y publicación completadas.

## Alcance

Ampliación autorizada del piloto a seis diapositivas (18–23), con 26 secciones en total. El cierre vincula las cinco decisiones comerciales con pruebas de efecto incremental. Se conservan los enlaces `piloto`, `limites`, `decisiones` y `clasificador`.

Los conteos observados proceden del JSON existente. Las hipótesis y cifras didácticas se separan en `src/data/ab-plan.ts`. El ejemplo se rotula como hipotético y compara recompra con contribución neta por cliente asignado.

## Comprobaciones

- Revisión académica independiente de las cinco decisiones, asignación persistente, población comparable en políticas y contribución neta por todos los asignados. Aritmética verificada: +9.9 pp de recompra y −1 u.m. neta por asignado. No se atribuyen efectos reales ni significancia al ejemplo.
- `pnpm lint`: 20 archivos, sin advertencias. `pnpm typecheck`: correcto.
- `pnpm build`: correcto con Turbopack; página estática y endpoint dinámico `/api/classify`. La compilación se ejecutó fuera del sandbox para permitir su puerto temporal de procesamiento CSS. Node 24.19.0 y pnpm 11.19.0 ya disponibles, sin instalar ni actualizar dependencias.
- 26 secciones con IDs únicos y orden correcto; enlaces previos conservados. Índice, botones y flecha de teclado comprobados, incluido el salto al cierre y al clasificador 26.
- Inspección visual de las seis nuevas diapositivas y del cierre a 1440×900, sin recortes ni superposiciones. Se redujo el espaciado de filas en el ejemplo para separar la tabla y su nota.
- En 390×844, las 26 secciones están disponibles en lectura vertical y ninguna tiene `aria-hidden=true`. Documento y cada sección A/B tienen ancho de 390 px sin desbordamiento horizontal. Tabla, resultados y notas del ejemplo inspeccionados visualmente; navegación del índice comprobada. Transición móvil → escritorio comprobada.
- El formulario sigue clasificando el ejemplo Campeones; no hubo errores ni advertencias de consola en el flujo local revisado. No se modificaron API ni reglas; sus pruebas exhaustivas históricas conservan su alcance.
- SHA-256 sin cambios: JSON `b8d4856cf30003349ed0d11a3216612c28cde6e2837b844be10cc1239f0f18ea`; notebook original y copia descargable `d06c63ab77a41fc903e0eb2544ce5d223017c8e816f627cef4235c5ebeff926f`.
- `git diff --check` sin problemas. No se añadieron CSV/XLSX, paquetes ni cambios a configuración de despliegue.

Estas comprobaciones no son una auditoría integral de accesibilidad ni una ejecución de campañas.

## Servidores temporales

- Primera revisión: sesión `25666`, PID `18712`, dirección `127.0.0.1:3104`. Cerrada con SIGINT; se comprobó la desaparición del proceso y liberación del puerto.
- Revisión del ajuste final: sesión `91880`, PID `18893`, dirección `127.0.0.1:3104`. Cerrada con SIGINT; se comprobó la desaparición del proceso y liberación del puerto.

## Publicación

- Commit de implementación: `245e684a16ff0e3f5f357104a4c77489b016e5bf`, enviado a `main`. [Estado de GitHub](https://api.github.com/repos/Alarmedgogeta/segmentacion-de-clientes/commits/245e684a16ff0e3f5f357104a4c77489b016e5bf/status): Vercel `success`, «Deployment has completed», **10 de octubre de 2026, 20:41:32 UTC / 14:41:32 Ciudad de México**.
- [Despliegue de Vercel](https://vercel.com/alan-diaz-yanezs-projects/segmentacion-de-clientes/CmvNcufyq4eHRYthtFE81PDy3dds). [Inicio del bloque publicado](https://segmentacion-de-clientes.vercel.app/#/piloto).
- Sitio público HTTP 200 con 26 IDs únicos, bloque A/B 18–23 y clasificador 26. El ejemplo hipotético se comprobó en el navegador; sin errores ni advertencias de consola. En móvil de 390×844, 26 secciones sin ocultamiento y ancho del documento de 390 px.
- Notebook público HTTP 200 y SHA-256 idéntico al original. `POST /api/classify` HTTP 200: ejemplo Campeones → código 454; cabecera `Cache-Control: no-store`.
- No se inspeccionaron ajustes privados ni logs internos de Vercel. La versión pública anterior (`b5dbe9c`) tenía 21 diapositivas y sus auditorías conservan su alcance histórico.
