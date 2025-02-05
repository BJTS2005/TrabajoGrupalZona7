CREATE TABLE IF NOT EXISTS gm_te_notificaciones_eventos (
  notificacion_id SERIAL PRIMARY KEY,
  id_eve            VARCHAR(5) NOT NULL,
  mensaje           TEXT NOT NULL,
  fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION gestionar_notificacion_evento()
RETURNS TRIGGER AS $$
DECLARE
    dias_antes INTEGER := 3;
    dias_restantes INTEGER;
BEGIN

    IF (TG_OP = 'DELETE') THEN
        DELETE FROM gm_te_notificaciones_eventos
         WHERE id_eve = OLD.ID_EVE;
        RETURN OLD;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        DELETE FROM gm_te_notificaciones_eventos
         WHERE id_eve = NEW.ID_EVE;
        
        IF NEW.EVE_FECHA IS NOT NULL THEN
            dias_restantes := NEW.EVE_FECHA - CURRENT_DATE;
            IF dias_restantes <= dias_antes AND dias_restantes >= 0 THEN
                INSERT INTO gm_te_notificaciones_eventos (id_eve, mensaje)
                VALUES (NEW.ID_EVE,
                        'El evento: ' || NEW.EVE_DETALLE || ' se hara en ' || dias_restantes || ' dias.');
            END IF;
        END IF;
        RETURN NEW;
        
    ELSIF (TG_OP = 'INSERT') THEN
        IF NEW.EVE_FECHA IS NOT NULL THEN
            dias_restantes := NEW.EVE_FECHA - CURRENT_DATE;
            IF dias_restantes <= dias_antes AND dias_restantes >= 0 THEN
                INSERT INTO gm_te_notificaciones_eventos (id_eve, mensaje)
                VALUES (NEW.ID_EVE,
                        'El evento: ' || NEW.EVE_DETALLE || ' se hara en ' || dias_restantes || ' días');
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER notificacion_evento
AFTER INSERT OR UPDATE OR DELETE ON GM_TE_EVENTOS_SOSTENIBLES
FOR EACH ROW EXECUTE FUNCTION gestionar_notificacion_evento();

SELECT * FROM gm_te_notificaciones_eventos
