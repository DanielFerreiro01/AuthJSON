import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes/app.routes";
import { Server } from "./presentation/server";
import { LoggerAdapter } from "./config";

(async () => {
  main();
})();

function main() {
  LoggerAdapter.serverInfo(envs.PORT, envs.PUBLIC_PATH);

  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    router: AppRoutes.routes,
  });

  server.start();
}