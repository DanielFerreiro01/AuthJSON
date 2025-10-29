import { Router } from "express";
import { RepositoryFactory } from "../../shared/factories/repository.factory";
import { checkRole } from "../../shared/middlewares/auth.middleware";
import { RouteLogger } from "../../shared/utils/logger";
import { PaginationDto } from "../../domain/dtos/pagination.dto";

export class DynamicRoutes {
  static get routes(): Router {
    const router = Router();
    const repository = RepositoryFactory.getInstance();
    const data = repository.getData();

    // Log del header
    RouteLogger.logHeader();

    // Endpoint para listar metadatos de colecciones
    router.get("/collections", (req, res) => {
      const metadata = Object.keys(data.collections).map((name) => ({
        name,
        count: data.collections[name].data?.length || 0,
        permissions: data.collections[name].permissions || {},
      }));
      res.json(metadata);
    });

    // Generar rutas dinámicas para cada colección
    Object.keys(data.collections).forEach((collectionName) => {
      const permissions = data.collections[collectionName].permissions || {};
      const itemCount = data.collections[collectionName].data?.length || 0;

      RouteLogger.logCollection(collectionName, itemCount);

      // GET (todos con paginación)
      RouteLogger.logRoute("GET", `/api/${collectionName}`, permissions.GET || []);
      router.get(
        `/${collectionName}`,
        checkRole(permissions.GET || []),
        (req, res) => {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;

          const [error, paginationDto] = PaginationDto.create(page, limit);
          if (error || !paginationDto) return res.status(400).json({ error });

          const paginated = repository.getPaginatedCollection(collectionName, paginationDto);
          res.json(paginated);
        }
      );

      // GET by ID
      RouteLogger.logRoute("GET", `/api/${collectionName}/:id`, permissions.GET || []);
      router.get(
        `/${collectionName}/:id`,
        checkRole(permissions.GET || []),
        (req, res) => {
          const item = repository.getById(collectionName, req.params.id);
          if (!item) return res.status(404).json({ message: "Not found" });
          res.json(item);
        }
      );

      // POST
      RouteLogger.logRoute("POST", `/api/${collectionName}`, permissions.POST || []);
      router.post(
        `/${collectionName}`,
        checkRole(permissions.POST || []),
        (req, res) => {
          const newItem = repository.create(collectionName, req.body);
          res.status(201).json(newItem);
        }
      );

      // PUT
      RouteLogger.logRoute("PUT", `/api/${collectionName}/:id`, permissions.PUT || []);
      router.put(
        `/${collectionName}/:id`,
        checkRole(permissions.PUT || []),
        (req, res) => {
          const updated = repository.update(collectionName, req.params.id, req.body);
          if (!updated) return res.status(404).json({ message: "Not found" });
          res.json(updated);
        }
      );

      // DELETE
      RouteLogger.logRoute("DELETE", `/api/${collectionName}/:id`, permissions.DELETE || []);
      router.delete(
        `/${collectionName}/:id`,
        checkRole(permissions.DELETE || []),
        (req, res) => {
          const deleted = repository.delete(collectionName, req.params.id);
          if (!deleted) return res.status(404).json({ message: "Not found" });
          res.json(deleted);
        }
      );
    });

    RouteLogger.logFooter();
    return router;
  }
}
