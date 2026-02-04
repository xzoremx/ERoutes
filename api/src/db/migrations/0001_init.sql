-- =============================================
-- Migration 0001: Extensiones base
-- =============================================

-- UUID para IDs únicos (opcional, por si se necesita)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Funciones de texto útiles
CREATE EXTENSION IF NOT EXISTS "unaccent";
