# Revisión de correspondencia: presentación y notebook

**Fecha:** 9 de octubre de 2026.  
**Resultado:** las cifras, las reglas RFM y las observaciones de las 20 diapositivas coinciden con el notebook. Se corrigieron tres expresiones ambiguas; no fue necesario cambiar datos, cálculos ni conclusiones.

## Fuentes y método

- Notebook fuente: `../actividad2_segmentacion_clientes.ipynb`; se revisaron código, salidas guardadas y explicaciones Markdown.
- Entradas: `../datos/retail_sales_dataset.csv` y `../datos/retail_sales_dataset.xlsx`.
- Presentación: [contenido](src/components/presentation.tsx), [gráficas](src/components/charts.tsx) y [datos derivados](src/data/notebook-data.json).
- Se volvió a ejecutar una copia del notebook desde un kernel limpio: sus 15 celdas de código originales, en orden, más una celda de exportación. No se modificaron el notebook ni los datasets originales.
- Se comparó el JSON completo de la nueva ejecución con el que consume la presentación, incluyendo estructura, tipos, listas, textos y números. La tolerancia numérica fue `rtol = atol = 1e-12`; la diferencia máxima observada fue **0**.
- Se contrastaron además las cifras escritas directamente en las diapositivas, sus unidades, redondeos, intervalos, ejes y explicaciones. Las propuestas comerciales se revisaron contra el texto del notebook.

## Comprobaciones reproducidas

| Comprobación | Resultado |
| --- | --- |
| Ejecución | 16 celdas de código, contadores consecutivos y cero errores. Kernel cerrado al concluir. |
| JSON completo | 21 campos de primer nivel y 5,457 nodos comparados; sin diferencias. |
| Valores numéricos del JSON | 2,805 valores; diferencia máxima de 0. |
| Salidas guardadas del notebook | 26 representaciones tabulares HTML/texto coinciden; contadores originales 1–15 coinciden. |
| Población y calidad | 1,000 clientes únicos, 10 columnas, CSV y Excel equivalentes, sin faltantes ni duplicados. |
| Segmentos | 92 Campeones, 194 Leales, 162 Potenciales, 184 Ocasionales recientes, 156 En riesgo de alto valor y 212 Baja actividad y valor. Total: 1,000. |
| Valor monetario | 247,113.00 u.m.; perfiles y prioridades conservan el total. |
| Histogramas | Los conteos de los 62 intervalos coinciden con el CSV y con los límites usados en el notebook. |
| Dispersión | Se conservan 1,000 observaciones y 281 combinaciones distintas de frecuencia, valor monetario y segmento. La agrupación visual de puntos coincidentes no elimina clientes. |
| Sensibilidad por categoría | Los 36 valores de la matriz coinciden; 388 clientes cambian de segmento (38.8%). |
| Planes comerciales | Seis planes con tres KPIs por segmento, perfiles y consideraciones fieles al notebook. |

La única diferencia en la salida de texto de ejecución fue un aviso de Matplotlib por construir la caché de fuentes en el directorio temporal. No afecta tablas, cifras ni cálculos. No se exigió identidad binaria de imágenes ni de metadatos de ejecución.

## Correspondencia por diapositiva

Las celdas se numeran **desde 1**, incluyendo Markdown y código.

| Diapositiva | Celdas fuente | Qué se verificó |
| --- | --- | --- |
| 1. Inicio | 37–38 | 286 clientes, 28.6% de la cartera y 51.62% de Monetary para Campeones + Leales; valor histórico. |
| 2. Datos | 2, 4, 6–7, 39 | Dimensiones, identificadores, calidad, equivalencia entre formatos y límites de las unidades. |
| 3. Descriptivos | 8–9 | Medias, medianas y extremos; 55/83 casos señalados por IQR; cinco tickets y cocientes de 25%, 30% y 35%. |
| 4. Región y género | 11–12 | Conteos, promedios, liderazgo de S en ticket/Monetary y N en frecuencia; brecha de ticket de 0.20% por género. |
| 5. Categorías | 11–12 | Conteos, porcentajes y medias de Recency, Frequency, Monetary y ticket; interpretación descriptiva del ciclo de recompra. |
| 6. Distribuciones | 14–15 | Histogramas, medianas 5/4/75, percentiles 80 de 12/7/450 y Spearman 0.81/0.52. |
| 7. Puntajes | 16–18 | Cortes, intervalos cerrados por la derecha, inversión de R y empates; 31.2% con puntaje F = 1. |
| 8. Reglas | 19–20 | Seis reglas, exclusión de Campeones en Leales y condición F ≥ 4 **o** M ≥ 4 en riesgo. |
| 9. Ejemplos y tamaños | 17, 20–21 | Seis ejemplos sin identificadores, conteos y porcentajes, 95 códigos RFM y 20 clientes con 555. |
| 10. Perfiles | 23–24 | Todas las métricas y modas por segmento, participaciones y total monetario; redondeos mostrados. |
| 11. Valor y frecuencia | 23–24, 28–29 | Medias por segmento y oportunidades planteadas; no se atribuye eficacia observada a una campaña. |
| 12. Dispersión | 8–9, 30–31 | Puntos, ejes, colores por segmento, bandas y superposición. |
| 13. Sensibilidad | 23–24, 32–34 | Matriz completa, 38.8%, riesgo 156→196, movimientos 110/46/86, Electronics 84→71 y Beauty 0→61. |
| 14. Retener | 35 | Acciones, perfiles, KPIs y riesgos de Campeones y Leales. |
| 15. Desarrollar | 35 | Acciones, perfiles, KPIs y riesgos de Potenciales y Ocasionales recientes. |
| 16. Reactivar | 35 | Acciones, perfiles, KPIs y riesgos de En riesgo y Baja actividad. |
| 17. Indicadores | 35 | Ocho definiciones; denominadores, ceros, promedios por compra y resultados no estimables. |
| 18. Piloto | 35 | Ventana propuesta de 90 días, asignación aleatoria dentro de segmento/categoría, T−C e incremento de margen neto. |
| 19. CLV y límites | 34–35 | CLV no calculado, falta de período/retención, horizonte de tres años y margen ya integrado. |
| 20. Decisiones | 37–40 | Cuatro agrupaciones comerciales, sus métricas, quinta decisión contextual y conciliación final. |

## Precisiones aplicadas

| Diapositiva | Texto anterior | Texto actualizado | Motivo |
| --- | --- | --- | --- |
| 2 | «Valores finitos, positivos y rangos plausibles.» | «Valores finitos y rangos válidos según la variable.» | Recency admite cero; no todas las validaciones exigen positividad estricta. |
| 7 | «el 31.2% obtiene F = 1» | «el 31.2% obtiene un puntaje F = 1» | Se trata de `F_Score`, que agrupa clientes con una o dos compras. |
| 9 | «Ejemplos reales sin identificadores» | «Ejemplos de la base, sin identificadores» | Los registros proceden de la base analizada; no se acredita su procedencia de una empresa real. |

## Límites que se conservan

- Las cantidades se expresan en u.m.; no se inventan moneda, período de Frequency/Monetary ni fecha de corte.
- Monetary incorpora margen y no se multiplica por otra tasa ni nuevamente por frecuencia.
- «En riesgo» no demuestra abandono. El cambio por categoría reclasifica la misma población y modifica los cortes de R, F y M; no representa evolución temporal.
- Acciones, piloto y KPIs son propuestas. No se presentan aumentos de ventas, tasas futuras, efectos causales ni CLV como resultados calculados.
- La revisión corresponde a estas versiones. Las huellas de los archivos fuente y del JSON siguen siendo las registradas en [DATA_PROVENANCE.md](DATA_PROVENANCE.md); todos conservaron sus bytes.

Tras las precisiones de texto se comprobaron formato, lint, tipos y compilación. Esta revisión no inició servidores de pruebas.

