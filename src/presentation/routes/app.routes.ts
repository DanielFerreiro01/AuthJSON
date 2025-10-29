import { Router } from "express";
import { AuthRoutes } from "../auth/auth.routes";
import { DynamicRoutes } from "../routes/dynamic.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api", DynamicRoutes.routes);

    return router;
  }
}