import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../../config";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function checkRole(allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];
    const payload = await JWTAdapter.validateToken<{ id: string; role: string }>(token);
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    req.user = payload;
    if (!allowedRoles.includes(payload.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
