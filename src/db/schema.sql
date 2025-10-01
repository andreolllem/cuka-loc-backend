CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  telefone TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipamentos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco_diaria NUMERIC(10,2) NOT NULL,
  disponibilidade BOOLEAN DEFAULT TRUE,
  imagem_url TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE locacao_status AS ENUM ('pendente', 'confirmada', 'concluida', 'cancelada');

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'locacao_status') THEN
    CREATE TYPE locacao_status AS ENUM ('pendente', 'confirmada', 'concluida', 'cancelada');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS locacoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  equipamento_id INTEGER NOT NULL REFERENCES equipamentos(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status locacao_status DEFAULT 'pendente',
  valor_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locacoes_data ON locacoes (equipamento_id, data_inicio, data_fim);
