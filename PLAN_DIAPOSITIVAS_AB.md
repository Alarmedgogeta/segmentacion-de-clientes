# Plan de diapositivas: de las decisiones RFM a pruebas A/B

**Fecha:** 10 de octubre de 2026. **Estado:** implementación autorizada por el usuario y aplicada a la presentación de 26 diapositivas; verificación y publicación en [AUDITORIA_AB.md](AUDITORIA_AB.md). Se conserva abajo el guion de planificación y su situación de partida (21 diapositivas). **Enfoque:** aplicado a las cinco decisiones finales, con un caso numérico didáctico y notas metodológicas breves. No se han ejecutado campañas ni creado resultados experimentales reales.

## 1. Objetivo y ubicación

El nuevo bloque debe responder: **¿cómo sabríamos si las acciones que recomendamos generan valor adicional y cuáles conviene ampliar?** La segmentación describe a quién atender; la experimentación evalúa lo que ocurre al aplicar una acción frente a una alternativa definida.

En la versión de partida existían las diapositivas 17 (`indicadores`), 18 (`piloto`), 19 (`limites`), 20 (`decisiones`) y 21 (`clasificador`). El piloto ya introducía asignación aleatoria, 90 días y tratamiento menos control. El plan amplía **la diapositiva 18 a un bloque de seis**, agregando cinco diapositivas netas, para alcanzar **26**. El cierre queda después del desarrollo experimental y el clasificador conserva la última posición.

| Posición propuesta | Contenido | Cambio |
| --- | --- | --- |
| 1–17 | Análisis, acciones y definiciones de KPIs actuales | Se mantienen. |
| 18–23 | Diseño A/B, experimentos por decisión, ejemplo y criterio de implementación | Se reformula el piloto y se agregan cinco diapositivas. |
| 24 | El valor futuro todavía está abierto | Actual 19; conserva las limitaciones de CLV y de los datos. |
| 25 | Cinco decisiones para poner a prueba | Actual 20; añadir una referencia breve al ensayo que permitiría evaluar cada decisión. |
| 26 | ¿Qué perfil tiene este cliente? | Actual 21; sigue aplicando los cortes globales existentes. |

El recorrido propuesto es: **decisión comercial → comparación concreta → medición → evidencia → ampliar, ajustar o descartar**. El bloque debería poder explicarse en unos seis a ocho minutos; es una estimación editorial, no una duración de entrega exigida por el curso.

## 2. Guion visual de las seis diapositivas

### 18. «¿La acción genera valor adicional?»

**Mensaje principal:** para evaluar una acción necesitamos una comparación simultánea con clientes asignados al azar.

**Visual:** un conjunto de clientes elegibles de un segmento se divide en dos ramas A/B y vuelve a un panel común de resultados.

- A = operación habitual, definida antes de comenzar.
- B = operación habitual más una intervención concreta.
- Asignación persistente por cliente; misma ventana de observación en ambos grupos.
- Resultado económico: diferencia de contribución neta media por cliente asignado, incluidos quienes no compran.

**Ejemplo conductor:** Potenciales; A sin recordatorio adicional, B con un recordatorio personalizado por categoría. Mantener las demás condiciones comparables. Si se prueban simultáneamente mensaje, descuento y momento, el efecto corresponde al paquete completo; no atribuirlo a un solo componente.

**Nota breve:** 90 días es la propuesta existente; confirmar su adecuación al ciclo de compra antes del lanzamiento. No es el período histórico del dataset.

### 19. «Probar cómo retener y desarrollar»

**Mensaje principal:** las decisiones 1 y 2 requieren tratamientos diferentes y una evaluación económica común.

**Visual:** tres filas compactas —Campeones, Leales y Potenciales— con columnas «A», «B» y «Qué observar». Evitar párrafos extensos y animaciones que oculten las condiciones.

- Campeones: mantener relación mediante acceso anticipado frente al servicio habitual.
- Leales: ofrecer una recomendación de complemento frente a la experiencia habitual.
- Potenciales: añadir un recordatorio por categoría frente a no añadirlo.

En las tres pruebas, proponer como criterio económico principal **MargenIncremental90**; mostrar los KPIs de comportamiento como explicación de cómo se produjo el resultado. Conectar estas propuestas con las acciones ya existentes, sin afirmar que funcionarán.

### 20. «Reactivar sin gastar más de lo que recuperamos»

**Mensaje principal:** las decisiones 3 y 4 necesitan comprobar si el contacto justifica su costo.

**Visual:** dos paneles, «Recuperación de alto valor» y «Contacto de bajo costo», cada uno con A/B y la condición económica que determinaría continuar.

- En riesgo: validar primero elegibilidad según ciclo de compra e historial; comparar contacto habitual con una invitación adicional a volver. Probar un incentivo en otro ensayo si resulta necesario.
- Ocasionales recientes y Baja actividad: plantillas de contacto automatizado de bajo costo; conservar el segmento inicial para interpretar resultados. No asumir que los dos segmentos responden igual.

**Cierre:** comprar después de recibir un mensaje no demuestra que el mensaje haya provocado la compra; la comparación estima cuánto agrega la intervención. El costo por comprador recuperado del tratamiento es descriptivo, no costo por recuperación incremental.

### 21. «¿También conviene probar a quién contactamos?»

**Mensaje principal:** la quinta decisión —usar RFM con contexto— puede evaluarse comparando políticas de selección.

**Visual:** una misma población elegible se asigna al azar a dos políticas: A prioriza con RFM global y B con referencias por categoría. Cada política selecciona a quién contactar dentro de su grupo bajo las mismas restricciones.

- Establecer igual presupuesto por cliente elegible y reglas de capacidad de contacto equivalentes.
- Mantener la acción, canal, oferta y calendario iguales para un cliente comparable; cambiar la política de selección.
- Medir contribución neta por **todos los clientes asignados a cada política**, incluidos los no contactados.
- Definir previamente cómo se prioriza, cómo se resuelven empates y cuántos contactos se permiten.

**Nota:** el 38.8% reclasificado muestra sensibilidad del método; no prueba superioridad comercial de la referencia por categoría. Este ensayo sería una segunda fase, separada de los experimentos de campañas, para evitar intervenciones superpuestas.

### 22. «Más recompra puede dejar menos margen»

**Mensaje principal:** una campaña puede mejorar la respuesta y aun así no justificar su costo.

**Visual:** tabla A/B pequeña, dos barras de recompra y una comparación de contribución neta por cliente. Rotular de forma visible **«Ejemplo hipotético: no son resultados de la base»**.

Usar el caso de Potenciales desarrollado en la sección 4. Mostrar +9.9 puntos porcentuales de recompra junto a −1 u.m. de contribución neta por cliente. No presentar una etiqueta de «ganador» basada en esos promedios.

**Cierre:** revisar la economía de la acción y su incertidumbre antes de ampliarla. No hay observaciones experimentales reales ni dispersión individual de margen para calcular su intervalo en este ejemplo agregado.

### 23. «Ampliar, ajustar o descartar con una regla previa»

**Mensaje principal:** el experimento debe terminar en una decisión que considere magnitud, incertidumbre y efectos adversos.

**Visual:** tres caminos con texto e iconos, no solo colores.

| Evidencia al cierre previsto | Decisión propuesta |
| --- | --- |
| Ganancia económica respaldada con precisión suficiente, superior al mínimo útil definido, sin deterioro inaceptable de indicadores de protección | Ampliar de forma gradual a una población comparable y vigilar que el efecto se mantenga. |
| Resultado compatible tanto con mejora útil como con ausencia de mejora o daño | Inconcluso: mantener la política actual y planear otra prueba o mayor muestra antes de iniciarla. |
| Efecto adverso respaldado, costo inviable o incumplimiento de límites operativos | Descartar o rediseñar la intervención. |

**Pie de diapositiva:** fijar antes de lanzar la métrica principal, el mínimo de mejora que justifica actuar, tamaño de muestra, duración y criterios de parada. La ausencia de significancia no demuestra equivalencia. Evitar prolongar la misma prueba hasta encontrar un resultado favorable.

## 3. Mapa de las cinco decisiones a experimentos

Los tamaños siguientes son los observados en el notebook, **no una audiencia ya disponible para contacto ni una garantía de potencia**. La elegibilidad se determina antes de asignar grupos. En cada ensayo se propone una métrica principal: diferencia B−A de contribución neta por cliente asignado; las otras métricas explican comportamiento y detectan perjuicios.

| Decisión final | Población de referencia | A: control | B: cambio propuesto | Métricas complementarias y protección |
| --- | --- | --- | --- | --- |
| 1. Retener Campeones y Leales | 92 Campeones y 194 Leales; conservar resultados por segmento | Servicio y contactos habituales definidos | Campeones: acceso anticipado; Leales: recomendación de complemento. Son dos hipótesis, no una oferta idéntica para ambos. | Recompra90/CompraOtraCategoria90 en Campeones; Frecuencia90/Ticket90 en Leales. Costos de servicio, devoluciones y bajas de comunicación como protección. |
| 2. Desarrollar Potenciales | 162 Potenciales | Operación habitual sin recordatorio adicional | Un recordatorio relacionado con categoría y momento pertinente, sin añadir descuento en este primer contraste | Recompra90, Recurrencia90; bajas de comunicación y costo del contacto. |
| 3. Revisar recuperación de alto valor | 156 en riesgo global; validar primero ciclo e historial | Operación habitual sin invitación adicional | Una invitación personalizada a volver | Reactivacion90, Frecuencia90; contribución neta, costo y bajas. No llamar abandonados a todos los elegibles. |
| 4. Mantener contacto de bajo costo | 184 Ocasionales recientes y 212 de Baja actividad | Operación habitual sin contacto experimental | Mensaje automatizado de bajo costo adecuado al segmento y categoría | Recompra90/Ticket90 en Ocasionales; Reactivacion90/CostoReactivacion90 en Baja actividad. Medir margen neto y saturación de contacto. |
| 5. Usar RFM con contexto | Misma población elegible predefinida para ambas políticas | Selección con RFM global | Selección con referencia por categoría | Contribución neta por asignado como principal; cobertura y composición de los contactos como diagnóstico. Igual presupuesto y tratamiento comparable. |

Para el primer relato didáctico, **Potenciales** es el caso más directo: permite explicar una sola intervención y aprovechar los 162 clientes del perfil. La elección del primer experimento real dependería de costos, elegibilidad y muestra requerida. No se propone lanzar todas las pruebas simultáneamente.

## 4. Ejemplo numérico para la diapositiva 22

**Datos inventados exclusivamente para explicar el cálculo.** El tamaño 162 procede del segmento Potenciales; los resultados, costos y contribuciones de la tabla son hipotéticos. El reparto 81/81 es una ilustración, no un cálculo de tamaño de muestra.

| Medida en una ventana propuesta de 90 días | A: habitual | B: recordatorio |
| --- | ---: | ---: |
| Clientes asignados | 81 | 81 |
| Clientes con al menos una compra | 16 | 24 |
| Recompra | 19.8% | 29.6% |
| Contribución posterior, antes de costos experimentales adicionales | 1,296 u.m. | 1,458 u.m. |
| Costos experimentales adicionales no incluidos en esa contribución | 0 u.m. | 243 u.m. |
| Contribución neta total | 1,296 u.m. | 1,215 u.m. |
| Contribución neta por cliente asignado | 16 u.m. | 15 u.m. |

**Cálculos:** diferencia de recompra = `(24/81 − 16/81) × 100 = 9.8765` puntos porcentuales. Diferencia de contribución neta por asignado = `(1458 − 243)/81 − 1296/81 = −1` u.m. El cambio de recompra se calcula sin redondear primero las tasas; se muestra como **+9.9 pp**.

La contribución es del período futuro del ejemplo, no el Monetary histórico del notebook. Los gastos comunes ya incorporados no se descuentan otra vez. Los asignados sin compras aportan cero compras, pero pueden tener costos de contacto. El costo de 3 u.m. por asignado de B es un supuesto didáctico, no un presupuesto recomendado ni un precio observado.

**Lectura prevista:** la campaña obtiene más compradores en este ejemplo, pero deja menos contribución neta observada por asignado. Esto motiva revisar el costo y reunir evidencia suficiente; no demuestra estadísticamente daño ni eficacia. Los totales de contribución no permiten calcular su variabilidad individual. No fabricar intervalos, p-values ni un resultado experimental real a partir de la base existente.

## 5. Método que debe quedar correcto, aunque vaya en notas breves

### Diseño y comparabilidad

Asignar por un identificador estable de cliente y conservar su grupo durante el seguimiento. Aleatorizar dentro de segmento inicial y categoría cuando haya suficiente población, evitando fragmentaciones adicionales innecesarias. Esto adapta al problema la lógica de diseños por bloques: comparar tratamientos dentro de grupos relevantes y combinar la evidencia de forma coherente. No comparar simplemente Electronics contra Beauty. [Referencia: NIST, diseños aleatorizados por bloques](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm).

Para este proyecto, registrar segmento, categoría, cortes y fecha de referencia **al inicio**. Los cambios posteriores de RFM pueden estudiarse como resultados, pero no reasignan retroactivamente a las personas en el análisis del experimento. Separar a los clientes de campañas incompatibles y aplicar iguales reglas de devoluciones, ventana y seguimiento.

### Métricas y lectura

Elegir una métrica principal, métricas diagnósticas y límites de deterioro aceptable. Aquí se propone contribución neta por asignado como principal, con recompra/frecuencia como explicación y devoluciones/bajas/costos como protección. Revisar pérdidas de datos y cumplimiento del reparto previsto; no declarar éxito por observar repetidamente un p-value favorable. El uso de segmentos fijados antes del tratamiento evita que la intervención cambie la composición de lo que se compara. [Referencia: Microsoft Research, seguimiento de experimentos](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/).

El análisis principal incluye a todos los asignados según su grupo original, no solo a quienes abren, responden o compran. Datos faltantes no equivalen a cero compras: requieren comprobar cobertura. La contribución monetaria necesita medición individual para estimar incertidumbre; un margen agregado positivo no basta por sí solo. Comparar por categoría no habilita seleccionar únicamente los resultados favorables.

### Muestra y horizonte

Un reparto 50/50 daría, antes de filtros, **46, 97, 81, 92, 78 y 106 clientes por brazo** para Campeones, Leales, Potenciales, Ocasionales, En riesgo y Baja actividad, respectivamente. Dividir además por categoría deja grupos más pequeños. Estos conteos no prueban que exista muestra suficiente.

Antes de comprometer un ensayo se necesita la tasa base para una métrica binaria o variabilidad para una monetaria, el cambio mínimo relevante y los niveles de error/potencia elegidos. El total del dataset no reemplaza ese cálculo. No hay tasa futura de recompra observada que permita deducirlo automáticamente del RFM. [Referencia: Microsoft Research, preparación de experimentos](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage/).

Si se necesitan más clientes, planear antes del lanzamiento reclutamiento/cohortes y análisis; observar más días a las mismas personas no las convierte en nuevas unidades independientes. Fijar una ventana común por cliente y permitir que madure completa. Si solo alcanza para un piloto operativo, presentarlo como validación de instrumentación y factibilidad, sin prometer evidencia concluyente de impacto.

Los umbrales de adopción y cómo resolver conflictos entre métricas deben acordarse antes de ver resultados. Separar prueba inconclusa de evidencia de que la acción no mejora lo suficiente. Si se examinan muchas campañas, métricas o subgrupos, prever comparaciones múltiples y distinguir hipótesis confirmatorias de exploratorias. [Referencia: Microsoft Research, decisiones después del experimento](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-post-experiment-stage/).

### Datos que faltan para ejecutar el plan

Asignación y fecha de entrada; cliente y segmento/categoría iniciales; tratamiento enviado y exposición; transacciones posteriores, fechas y categorías; ventas netas, devoluciones, contribución y costos de campaña sin duplicación; bajas/quejas; cobertura de seguimiento. Estas son necesidades de una futura campaña real, no funcionalidades que deban añadirse ahora a la presentación pública.

## 6. Integración técnica prevista en la web

1. **Contenido y navegación:** ampliar el arreglo `slides` y los componentes `Slide` de `src/components/presentation.tsx`. Mantener `piloto` para la nueva 18 y agregar `ab-retener-desarrollar`, `ab-reactivar-costos`, `ab-politicas`, `ab-ejemplo` y `ab-decision`. Mantener `limites`, `decisiones` y `clasificador`, aunque cambien a 24, 25 y 26. Revisar los índices numéricos de `Slide` para que coincidan con el arreglo; hoy la relación es manual.
2. **Datos:** obtener conteos y nombres actuales de `notebook-data.json`. Guardar hipótesis y cifras hipotéticas en un archivo diferenciado, por ejemplo `src/data/ab-plan.ts`, marcado como propuesta/ejemplo. No añadir resultados de campaña inventados al JSON exportado del notebook.
3. **Visuales:** reutilizar tipografía, colores, tablas y componentes del sitio. Diagramas y comparaciones sencillos con HTML/CSS o SVG, sin dependencias adicionales previstas. En móvil, apilar A/B conservando etiquetas; no depender del color para indicar el resultado.
4. **Cierre:** en las cinco decisiones finales, añadir condiciones breves: «ampliar si aporta margen», «desarrollar si mejora recompra de forma rentable», «recuperar cuando el efecto justifique el costo», «mantener contacto con contribución incremental» y «comparar políticas con presupuesto equivalente».
5. **Trazabilidad:** actualizar README y `DATA_PROVENANCE.md` para distinguir datos observados, diseño propuesto y aritmética hipotética. Preservar el alcance histórico de las auditorías previas y registrar la nueva revisión por separado.
6. **Verificación futura:** comprobar las cuentas del ejemplo, las 26 secciones, unicidad de IDs, índice, enlaces hash existentes y recorrido escritorio/móvil. Ejecutar `pnpm lint`, `pnpm typecheck` y `pnpm build`; documentar cualquier límite del entorno. Si se inician servidores de prueba, registrar sesión/PID/puerto, cerrarlos y verificar la liberación del puerto. La política de pnpm de siete días sigue vigente si llegara a requerirse instalar paquetes.

La propuesta es una ampliación educativa del contenido. No requiere cambiar `/api/classify`, entrenar modelos, guardar consultas, crear infraestructura experimental ni modificar el notebook original. Una implementación posterior deberá conservar esos límites y mantener visible la naturaleza hipotética de los ejemplos.

## 7. Criterios de aceptación del contenido

- Las cinco decisiones finales tienen una comparación posible y una consecuencia para la implementación.
- La audiencia entiende quién pertenece a A/B, qué cambia y cuál es la métrica principal.
- La selección por RFM global/categoría se trata como una comparación de políticas, no como evidencia causal obtenida del 38.8% de reclasificaciones.
- Las cifras del notebook se mantienen intactas y los números inventados llevan una etiqueta visible.
- Los 90 días, tamaños de grupo y umbrales propuestos no se presentan como requisitos oficiales ni garantías estadísticas.
- La regla de adopción considera incertidumbre, relevancia económica y efectos adversos; no se premia automáticamente la mayor tasa de respuesta.
- El clasificador sigue siendo la última diapositiva y conserva su función actual.

**Fuentes del proyecto:** `src/components/presentation.tsx` (bloques actuales 17–21), `src/data/notebook-data.json` (`priorities`, `actionPlans`, `kpis`, `pilot`) y [procedencia del notebook](DATA_PROVENANCE.md). Las fuentes externas enlazadas apoyan únicamente la metodología experimental; las acciones y cifras hipotéticas de este plan son propuestas propias para este caso.
