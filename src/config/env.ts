import "dotenv/config";

const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  stripeSecret: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

export default env;
