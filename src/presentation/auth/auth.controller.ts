import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public registerUser = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const result = await this.authService.loginUser(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
