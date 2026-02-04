-- =============================================
-- Migration 0002: Habilitar PostGIS
-- =============================================
-- PostGIS permite queries geoespaciales eficientes
-- En Supabase, PostGIS ya viene instalado pero hay que habilitarlo

CREATE EXTENSION IF NOT EXISTS "postgis";
