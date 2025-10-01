import "dotenv/config";

type Env = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  stripeSecretKey: string;
  stripeWebhookSecret?: string;
};

const env: Env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
};

if (!env.databaseUrl) {
  console.warn("DATABASE_URL não configurada. Configure o arquivo .env.");
}

if (!env.jwtSecret) {
  console.warn("JWT_SECRET não configurado. Configure o arquivo .env.");
}

if (!env.stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY não configurada. Integrações de pagamento serão mockadas.");
}

export default env;
