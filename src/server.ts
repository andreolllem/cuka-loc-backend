import env from "@/config/env";
import app from "@/app";

app.listen(env.port, () => {
  console.log(`🚀 Cuka Loc API rodando na porta ${env.port}`);
});
