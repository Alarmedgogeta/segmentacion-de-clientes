# Procedencia de los datos de la presentación

## Fuente y alcance

`src/data/notebook-data.json` se deriva de `../actividad2_segmentacion_clientes.ipynb`, el notebook de resolución de la actividad. Los archivos originales están en `../datos/retail_sales_dataset.csv` y `../datos/retail_sales_dataset.xlsx`, fuera de este repositorio web. El JSON contiene agregados y observaciones limitadas para las visualizaciones; no incluye los datasets originales ni identificadores de clientes.

Por solicitud expresa del usuario, el repositorio también conserva una copia exacta del notebook en `public/notebooks/actividad2_segmentacion_clientes.ipynb`, descargable desde `/notebooks/actividad2_segmentacion_clientes.ipynb`. Esta copia completa incluye las salidas guardadas, con las muestras de registros e identificadores que aparecen en el original. La ausencia de identificadores descrita para el JSON no se aplica al notebook descargable.

La revisión contextual permanece en Markdown. No se creó un notebook documental adicional ni se modificó el notebook fuente.

## Huellas SHA-256

| Archivo | SHA-256 |
| --- | --- |
| `../actividad2_segmentacion_clientes.ipynb` (fuente) | `d06c63ab77a41fc903e0eb2544ce5d223017c8e816f627cef4235c5ebeff926f` |
| `public/notebooks/actividad2_segmentacion_clientes.ipynb` (copia exacta) | `d06c63ab77a41fc903e0eb2544ce5d223017c8e816f627cef4235c5ebeff926f` |
| `retail_sales_dataset.csv` | `0a724c78f2ec1f4937bd4bfd19558066d839b28ac2eab13c7f89a48545e4d747` |
| `retail_sales_dataset.xlsx` | `ea4dfbcf74f5139475955a3ea58016cf639e704d3b514cb99e204f94656827f5` |
| `src/data/notebook-data.json` | `b8d4856cf30003349ed0d11a3216612c28cde6e2837b844be10cc1239f0f18ea` |

## Exportación y verificación

1. Se leyó el notebook con `nbformat` y se conservó una copia en memoria; las 15 celdas originales de código se mantuvieron en su orden y sin cambios.
2. En esa copia se limpió el estado guardado y se añadió una celda final de exportación. `nbclient` ejecutó el conjunto desde un kernel limpio, usando la carpeta de la actividad como directorio de trabajo.
3. La celda adicional serializó los objetos calculados por el notebook. Los histogramas usan los mismos límites de intervalos de su gráfica original; las correlaciones, cuantiles y tablas de transición repiten exactamente las expresiones de presentación del notebook. No se entrenó otro modelo ni se cambiaron cortes o reglas.
4. Se extrajeron las reglas, acciones y definiciones de KPIs de sus tablas Markdown. Son propuestas de la actividad, no efectos medidos de campañas.
5. La ejecución completó 16 celdas de código (15 originales y la exportación) con contadores consecutivos y cero errores. Se conservaron en memoria los resultados y 4 figuras generadas; únicamente se guardaron este registro y el JSON. El kernel terminó al concluir.
6. Se verificó que notebook y datos originales conservan exactamente sus bytes y hashes. Se conciliaron 1,000 clientes, seis segmentos y Monetary total de 247,113 u.m.; los histogramas, la transición y los puntos de dispersión conservan los 1,000 clientes. El análisis de sensibilidad cambia 388 clientes (38.8%).
7. `pnpm format` ajustó el formato del JSON sin cambiar sus datos. Se comprobó su equivalencia al volver a serializarlo con las opciones de exportación y recuperar exactamente la huella original `000bb4d1846cf11bf1f15bd9e3cf46e89ef3eb7bd376df550053ee3d14a08075`. La tabla anterior registra la huella del archivo formateado que utiliza la presentación.

Entorno de reproducción: Python 3.12.14. Paquetes empleados: `nbformat==5.11.1`, `nbclient==0.11.0`, `ipykernel==7.4.0`, `pandas==2.2.3`, `numpy==2.3.5`, `matplotlib==3.11.2`, `openpyxl==3.1.5`. Se reutilizaron dependencias disponibles; no se instalaron paquetes durante la exportación.

## Mapeo de los bloques JSON

Las posiciones de celda son de base uno e incluyen celdas Markdown y de código.

| Bloque | Procedencia |
| --- | --- |
| `meta`, `quality`, `summary` | Celdas 2, 4, 6 y 39; entorno, hashes, dimensiones y conciliaciones. |
| `descriptives`, `ticketValueCounts`, `monetaryRatioCounts` | Celda 8; descriptivos, regla 1.5 IQR y frecuencias observadas. Los valores señalados por IQR permanecen en la base. |
| `groupSummaries`, `groupLeaders` | Celda 11; agrupaciones por región, género y categoría. |
| `distributions`, `quantiles`, `correlations` | Celda 14; mismos bins, percentiles y correlación de Spearman. Cada bin usa límite inferior incluido; el superior es excluido salvo el último, como `numpy.histogram`. |
| `scoring.cuts`, `scoring.intervals`, `scoring.scoreCounts` | Celda 17; percentiles globales y `pd.cut` cerrado por la derecha. Límites `null` representan extremos abiertos no acotados. `observedMin` y `observedMax` son extremos observados, no puntos de corte. |
| `scoring.rules`, `scoring.examples` | Celdas 19 y 20; reglas y primer ejemplo de cada segmento. Se eliminaron ambos identificadores, sin sustituirlos por identificadores persistentes. |
| `segments`, `segmentOrder` | Celdas 20, 23 y 26; perfiles, composición de categoría y colores originales. Los porcentajes se expresan de 0 a 100. |
| `scatter` | Celda 30; únicamente `Frequency`, `Monetary` y `segment`, ordenados para no conservar el orden de entrada. Son 1,000 puntos; algunos se superponen. |
| `sensitivity` | Celda 33; cortes por categoría, transición y movimientos del grupo en riesgo. |
| `priorities` | Celda 37; cuatro prioridades comerciales y conciliación de clientes/valor. |
| `actionPlans`, `kpis`, `pilot` | Celda 35; propuestas comerciales y de medición. La ventana de 90 días es propuesta, no la duración conocida de la base. |

## Límites de interpretación y publicación

- Monetary incorpora margen según la consigna; las cantidades se expresan en u.m. porque no se especifica moneda. El período de Frequency/Monetary y la fecha de corte siguen sin conocerse.
- RFM describe la fotografía disponible. Los segmentos no demuestran abandono, causalidad ni valor recuperable garantizado. El CLV no se calculó.
- En el JSON no se exportaron valores de `ID`, `Customer ID`, etiquetas de clientes ni filas crudas completas. Sus ejemplos contienen solo RFM y puntajes; el scatter conserva exclusivamente las tres variables necesarias para esa gráfica. La ausencia de identificadores no constituye una certificación general de anonimato. El notebook completo se distribuye por separado con sus salidas originales, incluidos identificadores y muestras de registros, conforme a la solicitud del usuario.
- El JSON no contiene rutas absolutas personales, entradas del entorno ni salidas completas del notebook. En él, los nombres de columnas identificadoras aparecen únicamente en el esquema y las comprobaciones agregadas de calidad. Estas restricciones del JSON no describen el contenido de la copia íntegra del notebook.
- Para reproducir la presentación, usar este JSON con su hash. Para actualizar sus datos, ejecutar otra copia del notebook sin modificar los originales, exportar los mismos bloques con el mapeo anterior y repetir las conciliaciones; actualizar las huellas de este registro.

## Clasificador de la diapositiva 21

El 9 de octubre de 2026 el usuario solicitó añadir una diapositiva final con un formulario y un endpoint backend para conocer el perfil de un cliente. El simulador usa `POST /api/classify` y conserva la segmentación global existente; no genera otro notebook, entrena otro modelo ni recalcula los percentiles.

| Elemento del simulador | Fuente en el JSON y tratamiento |
| --- | --- |
| Puntajes RFM | `scoring.cuts`, exportado de la celda 17. R: 2, 4, 7, 12; F: 2, 3, 5, 7; M: 25, 56.25, 120, 450. Se conserva el cierre por la derecha y el sentido inverso de Recency. |
| Regla, prioridad y descripción del perfil | `scoring.rules`, celda 19. Se aplican las seis condiciones en el orden del notebook; la prioridad devuelta es su posición de 1 a 6. La descripción usa `interpretation`, no los promedios de otros clientes del segmento. |
| Nombre y color | `segments`, celdas 20, 23 y 26. |
| Acción propuesta y KPIs | `actionPlans`, celda 35. El campo de respuesta `segment.kpi` contiene el texto de `kpis`; no representa un KPI calculado para la nueva entrada. |
| Seis ejemplos precargados | `scoring.examples`, celdas 19 y 20; se conservan RFM y puntajes, sin incorporar identificadores. |
| Advertencias de rango | Mínimos y máximos de `descriptives`, celda 8: Recency 0–24, Frequency 1–12 y Monetary 6.25–2100. No se convierten en puntos de corte ni en límites de rechazo del modelo. |

El backend requiere recencia entera no negativa, frecuencia entera de al menos una compra y Monetary finito no negativo, con margen ya incorporado y expresado en u.m. Los tres campos tienen el límite técnico de `Number.MAX_SAFE_INTEGER` (`9007199254740991`); recencia y frecuencia deben ser enteros seguros. Los valores válidos fuera del rango observado reciben un segmento y una advertencia; los inválidos se rechazan. Las entradas y sus resultados se procesan sin persistencia y no se incorporan al JSON ni al notebook. El contrato HTTP, sus ejemplos y estados de error están en [README.md](README.md#clasificador-de-clientes).

Esta clasificación es una aplicación de reglas descriptivas. No prueba abandono ni predice rentabilidad, CLV o éxito de una acción. La falta de período confirmado para Frequency/Monetary limita la comparación con clientes externos; la ventana propuesta de 90 días de los KPIs no resuelve esa falta. Los resultados de la auditoría histórica de las primeras 20 diapositivas se conservan abajo con su fecha y alcance.

## Mantenimiento de la copia descargable

Cuando cambie el notebook fuente, copiarlo íntegro a `public/notebooks/actividad2_segmentacion_clientes.ipynb`, sin limpiar salidas ni editar la copia de forma independiente. Comprobar igualdad byte por byte y SHA-256 y actualizar ambas huellas de este documento. Si cambian sus resultados, regenerar y verificar también el JSON y las observaciones de la presentación. Para ejecutar la descarga se requieren el `requirements_actividad2.txt` de la actividad original y ambos archivos CSV/XLSX en una subcarpeta `datos/` junto al notebook; esos archivos permanecen fuera de este repositorio.

## Revisión posterior de correspondencia

El 9 de octubre de 2026 se volvió a ejecutar el notebook desde un kernel limpio y se comparó el JSON completo: 2,805 valores numéricos, sin diferencias. También coincidieron las salidas tabulares guardadas y se revisaron las observaciones de las 20 diapositivas. Las fuentes y sus huellas permanecen intactas. [AUDITORIA_PRESENTACION.md](AUDITORIA_PRESENTACION.md) registra el método, la correspondencia por celda y tres precisiones de redacción.
