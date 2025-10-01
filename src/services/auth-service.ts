import { query } from "@/config/db";
import { comparePassword, hashPassword } from "@/utils/password";
import { signJwt } from "@/utils/jwt";
import { User } from "@/types";

export async function registerUser({
  nome,
  email,
  senha,
  telefone
}: {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}) {
  const existing = await query<User>(
    "SELECT id, nome, email, senha as senha_hash, telefone, criado_em FROM usuarios WHERE email = $1",
    [email]
  );
  if (existing.length) {
    throw new Error("E-mail já cadastrado");
  }

  const senhaHash = await hashPassword(senha);
  const result = await query<User>(
    `INSERT INTO usuarios (nome, email, senha, telefone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, senha as senha_hash, telefone, criado_em`,
    [nome, email, senhaHash, telefone]
  );

  const usuario = result[0];
  const token = signJwt({ sub: usuario.id, email: usuario.email });

  const { senha_hash, ...safeUser } = usuario;

  return { token, usuario: safeUser };
}

export async function loginUser({ email, senha }: { email: string; senha: string }) {
  const users = await query<User>(
    "SELECT id, nome, email, senha as senha_hash, telefone, criado_em FROM usuarios WHERE email = $1",
    [email]
  );
  const usuario = users[0];

  if (!usuario) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatch = await comparePassword(senha, usuario.senha_hash);
  if (!passwordMatch) {
    throw new Error("Credenciais inválidas");
  }

  const token = signJwt({ sub: usuario.id, email: usuario.email });
  const { senha_hash, ...safeUser } = usuario;

  return { token, usuario: safeUser };
}
