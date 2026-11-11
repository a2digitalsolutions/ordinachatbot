-- Prima migrazione: prepara il database.
-- Le tabelle dei locali arrivano con il task OC1-01.
create extension if not exists pgcrypto;
