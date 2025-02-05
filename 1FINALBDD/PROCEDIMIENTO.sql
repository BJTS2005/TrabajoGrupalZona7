CREATE TABLE GM_TE_IMPACTO_AMBIENTAL (
   IMPACTO_ID          SERIAL              NOT NULL,
   VEH_ID              VARCHAR(10)         NOT NULL,
   CAMP_ID             VARCHAR(5)          NOT NULL,
   IMPACTO_EMISION     DECIMAL             NOT NULL,
   EMISION_TOTAL       DECIMAL             NOT NULL, 
   CONSTRAINT PK_GM_TE_IMPACTO_AMBIENTAL PRIMARY KEY (IMPACTO_ID),
   CONSTRAINT FK_GM_TE_IMPACTO_VEH FOREIGN KEY (VEH_ID) 
       REFERENCES GM_TE_VEHICULOS (VEH_ID) 
       ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT FK_GM_TE_IMPACTO_CAMP FOREIGN KEY (CAMP_ID) 
       REFERENCES GM_WSI_CAMPUS (CAMP_ID) 
       ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION registrar_vehiculo(
    p_veh_id VARCHAR(10),
    p_fre_id VARCHAR(5),
    p_tpe_id VARCHAR(5),
    p_tpv_id VARCHAR(5),
    p_camp_id VARCHAR(5),
    p_cantidad INT,
    p_cantidad_ruedas INT,
    p_fecha_registro DATE,
    p_distancia DECIMAL
)
RETURNS VOID AS $$
DECLARE
    v_emision DECIMAL;
    v_emision_total DECIMAL;
BEGIN

    IF EXISTS (SELECT 1 FROM GM_TE_VEHICULOS WHERE VEH_ID = p_veh_id) THEN
        RAISE EXCEPTION 'El vehículo con ID % ya está registrado.', p_veh_id;
    END IF;

    SELECT 
        CASE 
            WHEN TPE_ID = 'ZEV' THEN 0.0  
            WHEN TPE_ID = 'CMB' THEN 1.2  
            ELSE 0.5                       
        END 
    INTO v_emision
    FROM GM_TE_TIPOS_EMISION 
    WHERE TPE_ID = p_tpe_id;

    v_emision_total := (p_distancia * v_emision) * p_cantidad;

    INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
    VALUES (p_veh_id, p_fre_id, p_tpe_id, p_tpv_id, p_camp_id, p_cantidad, p_cantidad_ruedas, p_fecha_registro, p_distancia);

    INSERT INTO GM_TE_IMPACTO_AMBIENTAL (VEH_ID, CAMP_ID, IMPACTO_EMISION, EMISION_TOTAL)
    VALUES (p_veh_id, p_camp_id, p_distancia * v_emision, v_emision_total);

END;
$$ LANGUAGE plpgsql;

SELECT registrar_vehiculo(
    'VE07', 'F0001', 'CMB', 'V0001', 'EOAV.', 1, 1, '2024-02-05', 69.0
);

SELECT * FROM GM_TE_IMPACTO_AMBIENTAL