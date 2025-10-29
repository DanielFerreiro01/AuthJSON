import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RepositoryFactory } from "../../shared/factories/repository.factory";
import { LoggerAdapter } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const repository = RepositoryFactory.getInstance();
    const service = new AuthService(repository);
    const controller = new AuthController(service);

    const router = Router();
    
    // Log de rutas de autenticación
    console.log(LoggerAdapter.header('🔐 Authentication Routes'));
    console.log(LoggerAdapter.separator());
    console.log(`   ${LoggerAdapter.method('POST')} ${LoggerAdapter.path('/api/auth/register')} ${LoggerAdapter.roles([])}`);
    console.log(`   ${LoggerAdapter.method('POST')} ${LoggerAdapter.path('/api/auth/login')} ${LoggerAdapter.roles([])}`);
    console.log(LoggerAdapter.separator() + '\n');
    
    router.post("/register", controller.registerUser);
    router.post("/login", controller.loginUser);

    return router;
  }
}