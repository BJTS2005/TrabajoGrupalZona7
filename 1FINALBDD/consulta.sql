SELECT c.CAMP_NOM AS nombre_campus, c.CAMP_AREA AS area_campus,
c.CAMP_CAPACIDAD AS capacidad,
    (
      SELECT CONCAT('Ultimo Evento: ', es.EVE_DETALLE,
              ' | Fecha: ', TO_CHAR(es.EVE_FECHA, 'DD-MM-YYYY'),
              ' | Tipo: ', te.TPE_DETALLE,
              ' | Fondo Total: ', fi.FONDO_TOTAL,
              ' | Cursos: ', COALESCE(cc.total_cursos, 0),
              ' | Area Infraestructura: ', COALESCE(ia.total_infra_area, 0))
      FROM GM_TE_EVENTOS_SOSTENIBLES es
      INNER JOIN GM_TE_TIPOS_EVENTO te
             ON es.TPE_ID = te.TPE_ID
      INNER JOIN GM_TE_FONDOS_INVESTIGACION fi
             ON es.CAMP_ID = fi.CAMP_ID 
      LEFT JOIN (
          SELECT CAMP_ID, COUNT(*) AS total_cursos
          FROM GM_TE_CURSOS
          GROUP BY CAMP_ID
      ) cc ON es.CAMP_ID = cc.CAMP_ID
   
      LEFT JOIN (
          SELECT CAMP_ID, SUM(INT_AREA) AS total_infra_area
          FROM GM_TE_INFRAESTRUCTURAS_TRANSPOR
          GROUP BY CAMP_ID
      ) ia ON es.CAMP_ID = ia.CAMP_ID
	  
      WHERE es.CAMP_ID = c.CAMP_ID
      ORDER BY es.EVE_FECHA DESC, fi.FONDO_TOTAL DESC
      LIMIT 1
    ) AS "Resumen Completo"
FROM GM_WSI_CAMPUS c;
