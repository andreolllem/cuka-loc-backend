import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "@/routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") ?? ["http://localhost:3000"],
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

export default app;
